import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const PROJECT_ID = 'skillverse-test-project';
let testEnv: RulesTestEnvironment;

describe('Firestore Security Rules Authorization Suite', () => {
  beforeAll(async () => {
    // Read the exact firestore.rules file from workspace root
    const rulesPath = resolve(__dirname, '../firestore.rules');
    const rules = readFileSync(rulesPath, 'utf8');

    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules,
        host: '127.0.0.1',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    if (testEnv) {
      await testEnv.clearFirestore();
    }
  });

  describe('Users Collection Permissions (/users/{userId})', () => {
    it('allows anyone (unauthenticated or authenticated) to read public user profiles', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      const userRef = doc(unauthDb, 'users/user_alice');
      await assertSucceeds(getDoc(userRef));
    });

    it('allows authenticated user to create their own user document with role "user"', async () => {
      const aliceDb = testEnv.authenticatedContext('user_alice').firestore();
      const userRef = doc(aliceDb, 'users/user_alice');
      await assertSucceeds(
        setDoc(userRef, {
          uid: 'user_alice',
          email: 'alice@skillverse.dev',
          username: 'alice_dev',
          role: 'user',
          xp: 100,
        })
      );
    });

    it('denies user from setting their role to "admin" on creation', async () => {
      const aliceDb = testEnv.authenticatedContext('user_alice').firestore();
      const userRef = doc(aliceDb, 'users/user_alice');
      await assertFails(
        setDoc(userRef, {
          uid: 'user_alice',
          email: 'alice@skillverse.dev',
          username: 'alice_dev',
          role: 'admin',
        })
      );
    });

    it('denies user A from writing or updating user B document', async () => {
      // First setup Bob's document using admin context
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'users/user_bob'), {
          uid: 'user_bob',
          username: 'bob_dev',
          role: 'user',
        });
      });

      const aliceDb = testEnv.authenticatedContext('user_alice').firestore();
      const bobRef = doc(aliceDb, 'users/user_bob');
      await assertFails(updateDoc(bobRef, { username: 'hacked_by_alice' }));
      await assertFails(deleteDoc(bobRef));
    });

    it('allows verified admin to delete user accounts and manage roles', async () => {
      // Setup user document
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'users/user_bob'), {
          uid: 'user_bob',
          username: 'bob_dev',
          role: 'user',
        });
      });

      // Admin with custom claims { admin: true }
      const adminDb = testEnv.authenticatedContext('admin_user', { admin: true }).firestore();
      const bobRef = doc(adminDb, 'users/user_bob');
      await assertSucceeds(updateDoc(bobRef, { role: 'instructor' }));
      await assertSucceeds(deleteDoc(bobRef));
    });
  });

  describe('Course Catalog Permissions (/courses/{courseId})', () => {
    it('allows unauthenticated visitors to read published courses', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      const courseRef = doc(unauthDb, 'courses/arrays');
      await assertSucceeds(getDoc(courseRef));
    });

    it('denies standard users from creating or mutating course content', async () => {
      const aliceDb = testEnv.authenticatedContext('user_alice').firestore();
      const courseRef = doc(aliceDb, 'courses/arrays');
      await assertFails(
        setDoc(courseRef, {
          title: 'Modified Course',
          description: 'Malicious update',
        })
      );
    });

    it('allows verified admin to publish and edit courses', async () => {
      const adminDb = testEnv.authenticatedContext('admin_user', { admin: true }).firestore();
      const courseRef = doc(adminDb, 'courses/advanced-graphs');
      await assertSucceeds(
        setDoc(courseRef, {
          title: 'Advanced Graph Algorithms',
          categoryId: 'dsa',
        })
      );
    });
  });

  describe('User Private Subcollections (/users/{userId}/notifications/{id})', () => {
    it('allows user to read and mutate their own notifications', async () => {
      const aliceDb = testEnv.authenticatedContext('user_alice').firestore();
      const notifRef = doc(aliceDb, 'users/user_alice/notifications/notif_1');
      await assertSucceeds(
        setDoc(notifRef, {
          title: 'Streak Milestone!',
          read: false,
        })
      );
      await assertSucceeds(getDoc(notifRef));
      await assertSucceeds(updateDoc(notifRef, { read: true }));
      await assertSucceeds(deleteDoc(notifRef));
    });

    it('denies user B from reading or tampering with user A notifications', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'users/user_alice/notifications/notif_1'), {
          title: 'Private message',
        });
      });

      const bobDb = testEnv.authenticatedContext('user_bob').firestore();
      const aliceNotifRef = doc(bobDb, 'users/user_alice/notifications/notif_1');
      await assertFails(getDoc(aliceNotifRef));
      await assertFails(deleteDoc(aliceNotifRef));
    });
  });

  describe('Certificates Collection (/certificates/{certId})', () => {
    it('allows public verification reads on certificate records', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      const certRef = doc(unauthDb, 'certificates/cert_token_xyz');
      await assertSucceeds(getDoc(certRef));
    });

    it('denies unauthenticated guests from generating certificates', async () => {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      const certRef = doc(unauthDb, 'certificates/cert_token_xyz');
      await assertFails(
        setDoc(certRef, {
          userId: 'user_anonymous',
          courseTitle: 'Data Structures',
          passed: true,
        })
      );
    });
  });
});
