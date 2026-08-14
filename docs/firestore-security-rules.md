# Firestore Security Rules

This document maps every Firestore path the SkillVerse client touches to the
rule that authorises it, and explains the two mistakes that are easy to make
when adding a new feature.

The rules themselves live in [`../firestore.rules`](../firestore.rules) and are
deployed with:

```bash
firebase deploy --only firestore:rules
```

---

## The two traps

### 1. Rules do not cascade into subcollections

This is the single most common cause of a "works on my machine, permission
denied in production" bug in this repo.

```
match /courses/{courseId} {
  allow read: if true;
}
```

That block matches `courses/js-basics`. It does **not** match
`courses/js-basics/reviews/someone@example.com`, and it does not match
`courses/js-basics/lessons/main-lesson/comments/c1`. A path with no matching
`match` block is denied — the SDK reports
`FirebaseError: Missing or insufficient permissions`.

If you want a rule to apply to everything beneath a document you have to say so
explicitly with a recursive wildcard (`match /{document=**}`), which this
project deliberately avoids because it makes the effective permissions of a
path very hard to reason about. Every subcollection gets its own block instead.

### 2. A localStorage fallback hides the failure

`firestoreService.getLessonComments`, `postLessonComment` and
`getCourseReviews` all fall back to a local cache when the Firestore call
throws. That is good offline behaviour, but it also means a missing rule looks
like a *working feature* to whoever wrote it: the review appears, the comment
appears, and only a second device — or a teammate's browser — reveals that
nothing was ever persisted.

**When you add a collection to `firestoreService.ts`, add its rule in the same
pull request.** If you cannot, say so in the PR description.

---

## Path map

| Path | Read | Create | Update | Delete |
| --- | --- | --- | --- | --- |
| `users/{uid}` | anyone | owner, and `role` must be absent or `user` | owner (never `role`) | owner or admin |
| `courses/{id}` | anyone | admin | admin, **or** a user who has reviewed this course changing only `rating` + `reviewCount` | admin |
| `courses/{id}/reviews/{authorId}` | anyone | author, id must equal author | author | author or admin |
| `courses/{id}/lessons/{lessonId}/comments/{id}` | signed in | author | author (full), others (vote fields only) | author or admin |
| `quizzes/{courseId}` | signed in | admin | admin | admin |
| `companies/{id}` | anyone | admin | admin | admin |
| `activities/{id}` | signed in | author | author, **or** anyone adding one kudos | author or admin |

### Notes on individual paths

**`users`** — read is open, not authenticated. The shareable profile route
`/u/:username` is mounted outside `ProtectedRoute` in `App.tsx` precisely so a
link shared on LinkedIn resolves for a logged-out visitor; requiring auth here
is what made every such link render "Profile Not Found".

This is only acceptable because the user document holds no contact details.
`createUserDocument` writes `uid`, `username`, `photoURL`, `provider`,
`emailVerified`, progress counters and preferences — **never** the email
address. Do not add email, phone numbers or any other personal data to this
document; put it in a separate owner-only collection.

**`courses`** — writes are admin-only apart from one carve-out. Submitting a
review recomputes the denormalised `rating`/`reviewCount` aggregate on the
course document (`firestoreService.submitCourseReview`). Without the carve-out
every review write from an ordinary user logged
`Could not update the denormalized course rating` and the catalog kept showing
a stale average. The carve-out is as narrow as rules allow: `onlyChanges(['rating',
'reviewCount'])`, range checks, and an `exists()` check that the caller has
actually reviewed this course.

It is **not** airtight, and it is worth being honest about why. Rules cannot
count documents, so they cannot verify that the average being written matches
the reviews that exist — a reviewer can still write a wrong one. Recomputing
the aggregate in a Cloud Function (the `functions/` workspace already exists)
and making the field admin-only again is the real fix.

**`reviews` / `comments` — identity is the email, not the uid.** Both
`CourseReview.tsx` and `LessonDiscussion.tsx` write `userId: user.email`, and
the review document id is that same email (one review per user per course, so
re-submitting overwrites). Ownership therefore has to be checked against
`request.auth.token.email` rather than `request.auth.uid`. That works, but it
bakes an email address into a document id, and it is the reason those documents
cannot be validated with the simpler `isOwner()` helper. Migrating both to the
uid is worth doing; it needs a data migration, so it is not bundled here.

**Comment votes.** Any signed-in user may update `upvotes` and `upvotedBy` on
somebody else's comment — that is how voting works at all — but the rule
constrains the change to adding or removing *the caller*:

```
after.upvotedBy.hasOnly(before.upvotedBy.concat([request.auth.token.email])) &&
before.upvotedBy.hasOnly(after.upvotedBy.concat([request.auth.token.email]))
```

The two directions together mean the two lists may differ by the caller and
nothing else, so a voter cannot add other people, drop other people's votes, or
inflate the list.

The counter is tied to the direction of that change — exactly `+1` when the
caller is added, exactly `-1` when removed. The list constraint alone is not
enough: it is satisfied by a legitimate list change carrying `upvotes: 9999`
alongside it.

**`activities`.** Kudos are the mirror image: a third party may only increment
`kudosCount` by exactly one while adding themselves once to `kudosUsers`, and
only if they are not already in it. Note the "adding themselves" half is load
bearing — `hasAll(before) && hasOnly(before + uid)` is satisfied by an
*unchanged* list, so without an explicit `uid in after` the counter could be
incremented forever without anybody being recorded.

**`users` — `role` on create.** Restricting `role` on *update* is pointless on
its own, because a user's first write is a create: `allow create: if
isOwner(userId)` would let them author their initial document with
`role: "admin"`, which `isAdmin()` then trusts. Create requires the field to be
absent or `"user"`.

---

## Verifying a rules change

Rules are easy to get subtly wrong and impossible to eyeball, so verify against
the emulator rather than reasoning about the text.

```bash
# Terminal 1 — the emulator loads firestore.rules and reports compile errors
npx firebase emulators:start --only firestore

# Terminal 2 — drive it with @firebase/rules-unit-testing
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node your-rules-check.mjs
```

A minimal harness:

```js
import { initializeTestEnvironment, assertSucceeds, assertFails }
  from '@firebase/rules-unit-testing';
import { doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const env = await initializeTestEnvironment({
  projectId: 'skillverse-rules-test',
  firestore: { rules: fs.readFileSync('firestore.rules', 'utf8'),
               host: '127.0.0.1', port: 8080 },
});

const alice = env.authenticatedContext('alice-uid', { email: 'alice@test.dev' })
                 .firestore();

await assertSucceeds(setDoc(doc(alice, 'courses/js/reviews/alice@test.dev'), {
  courseId: 'js', userId: 'alice@test.dev', username: 'alice',
  rating: 5, createdAt: new Date().toISOString(),
}));
```

Cover both directions for anything you add: the case that should be allowed
**and** the case that should be denied. A rule that only ever gets tested with
`assertSucceeds` is indistinguishable from `allow write: if true`.

The Rules Playground in the Firebase console is a reasonable second check for
one-off paths, but it cannot express "bob cannot do this", so it is not a
substitute.

---

## Adding a new collection

1. Write the client code in `services/firestoreService.ts`.
2. Add the `match` block — including one per subcollection level.
3. Validate the document shape in the rule, not only the caller's identity. The
   client is not a trust boundary; anyone can call the REST API with a valid
   token and write whatever they like to a path they are allowed to write.
4. Add allow-and-deny checks against the emulator.
5. Update the path map above.
6. Redeploy the rules with the release — rules are not part of the Vite build
   and will not ship on their own.
