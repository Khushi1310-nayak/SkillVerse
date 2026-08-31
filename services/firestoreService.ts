import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Course, Company, QuizQuestion, Chapter, LessonComment, CourseReview, User, ContentReport, ReportStatus, AppNotification, CodeReviewRequest, CodeReviewComment, PublicLessonNote } from '../types';
import { COURSES, COMPANIES } from "../constants";
import { safeStorage, isArray } from "../utils/safeStorage";

// --- COURSE CATALOG CACHE (#328) ---
// A single shared in-memory snapshot of the courses collection.  It is
// populated on the first getCourses() call and cleared whenever the catalog
// is mutated (createCourse / updateCourse / deleteCourse / seed functions).
// This prevents repeated Firestore reads when the user navigates between
// pages that all display the same catalog data.
let _coursesCache: Course[] | null = null;

// Helper to structure chapters for initial seed courses
const generateInitialChapters = (topic: string): Chapter[] => {
  const sections = [
    { title: "1. Introduction & Origins" },
    { title: "2. Environment Setup" },
    { title: "3. Core Syntax & Variables" },
    { title: "4. Control Flow Logic" },
    { title: "5. Functions & Modularity" },
    { title: "6. Data Structures" },
    { title: "7. Advanced Patterns" },
    { title: "8. Best Practices & Optimization" },
  ];
  return sections.map((sec, i) => ({
    id: `chap-${i + 1}`,
    title: sec.title,
    lessons: [
      {
        id: `les-${i + 1}-1`,
        title: `Overview of ${sec.title.split(". ")[1] || sec.title}`,
        content: `<p>Welcome to ${sec.title}. In this lesson, we cover the core concepts, syntax, and best practices associated with this topic. Follow along with the official documentation for more context.</p>`,
      },
    ],
  }));
};

export const firestoreService = {
  // --- DATABASE SEEDING ---
  seedDatabase: async (): Promise<void> => {
    _coursesCache = null; // invalidate before any seed writes
    try {
      const coursesCol = collection(db, "courses");
      const coursesSnap = await getDocs(coursesCol);

      if (coursesSnap.empty) {
        console.log("Seeding courses to Firestore...");
        for (const course of COURSES) {
          const initialChapters = generateInitialChapters(course.title);

          // Separate quiz from course metadata for /courses collection
          const { quiz, ...courseData } = course;

          // Seed course metadata
          await setDoc(doc(db, "courses", course.id), {
            ...courseData,
            chapters: initialChapters,
          });

          // Seed corresponding quiz under /quizzes
          await setDoc(doc(db, "quizzes", course.id), {
            id: course.id,
            courseId: course.id,
            title: `${course.title} Quiz`,
            questions: quiz,
          });
        }
      }

      const companiesCol = collection(db, "companies");
      const companiesSnap = await getDocs(companiesCol);

      if (companiesSnap.empty) {
        console.log("Seeding companies to Firestore...");
        for (const company of COMPANIES) {
          await setDoc(doc(db, "companies", company.id), company);
        }
      }
    } catch (error) {
      console.error("Error seeding database:", error);
      throw error;
    }
  },

  forceReseedDatabase: async (): Promise<void> => {
    _coursesCache = null; // invalidate before any seed writes
    try {
      console.log("Force re-seeding courses to Firestore...");
      for (const course of COURSES) {
        const initialChapters = generateInitialChapters(course.title);
        const { quiz, ...courseData } = course;

        await setDoc(
          doc(db, "courses", course.id),
          {
            ...courseData,
            chapters: initialChapters,
          },
          { merge: true },
        );

        await setDoc(
          doc(db, "quizzes", course.id),
          {
            id: course.id,
            courseId: course.id,
            title: `${course.title} Quiz`,
            questions: quiz,
          },
          { merge: true },
        );
      }

      console.log("Force re-seeding companies to Firestore...");
      for (const company of COMPANIES) {
        await setDoc(doc(db, "companies", company.id), company, {
          merge: true,
        });
      }
    } catch (error) {
      console.error("Error force re-seeding database:", error);
      throw error;
    }
  },

  // --- COURSES CRUD ---
  getCourses: async (): Promise<Course[]> => {
    if (_coursesCache !== null) {
      return _coursesCache;
    }
    const querySnapshot = await getDocs(collection(db, "courses"));
    const courses: Course[] = [];
    querySnapshot.forEach((docSnap) => {
      courses.push({ id: docSnap.id, ...docSnap.data() } as Course);
    });
    _coursesCache = courses;
    return courses;
  },

  getCourse: async (id: string): Promise<Course | null> => {
    const docRef = doc(db, "courses", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Course;
    }
    return null;
  },

  createCourse: async (course: Course): Promise<void> => {
    _coursesCache = null; // invalidate so the next getCourses() re-reads Firestore
    await setDoc(doc(db, "courses", course.id), {
      categoryId: course.categoryId,
      title: course.title,
      description: course.description,
      icon: course.icon,
      duration: course.duration,
      level: course.level,
      content: course.content || "",
      resources: course.resources || [],
      chapters: course.chapters || [],
    });

    // Create empty quiz linked to the course
    await setDoc(doc(db, "quizzes", course.id), {
      id: course.id,
      courseId: course.id,
      title: `${course.title} Quiz`,
      questions: [],
    });
  },

  updateCourse: async (id: string, course: Partial<Course>): Promise<void> => {
    _coursesCache = null; // invalidate so the next getCourses() re-reads Firestore
    const docRef = doc(db, "courses", id);
    await updateDoc(docRef, course);
  },

  deleteCourse: async (id: string): Promise<void> => {
    _coursesCache = null; // invalidate so the next getCourses() re-reads Firestore
    await deleteDoc(doc(db, "courses", id));
    await deleteDoc(doc(db, "quizzes", id));
  },

  // --- QUIZZES CRUD ---
  getQuiz: async (
    courseId: string,
  ): Promise<{
    id: string;
    courseId: string;
    title: string;
    questions: QuizQuestion[];
  } | null> => {
    const docSnap = await getDoc(doc(db, "quizzes", courseId));
    if (docSnap.exists()) {
      return docSnap.data() as any;
    }
    return null;
  },

  updateQuiz: async (
    courseId: string,
    questions: QuizQuestion[],
  ): Promise<void> => {
    await setDoc(
      doc(db, "quizzes", courseId),
      {
        id: courseId,
        courseId,
        questions,
      },
      { merge: true },
    );
  },

  // --- COMPANIES CRUD ---
  getCompanies: async (): Promise<Company[]> => {
    const querySnapshot = await getDocs(collection(db, "companies"));
    const companies: Company[] = [];
    querySnapshot.forEach((docSnap) => {
      companies.push({ id: docSnap.id, ...docSnap.data() } as Company);
    });
    return companies;
  },

  getCompany: async (id: string): Promise<Company | null> => {
    const docSnap = await getDoc(doc(db, "companies", id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Company;
    }
    return null;
  },

  createCompany: async (company: Company): Promise<void> => {
    await setDoc(doc(db, "companies", company.id), company);
  },

  updateCompany: async (
    id: string,
    company: Partial<Company>,
  ): Promise<void> => {
    const docRef = doc(db, "companies", id);
    await updateDoc(docRef, company);
  },

  deleteCompany: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, "companies", id));
  },

  // --- CODE REVIEW REQUESTS ---
  getCodeReviewRequests: async (): Promise<CodeReviewRequest[]> => {
    const requestsQuery = query(
      collection(db, "codeReviewRequests"),
      where("status", "==", "open"),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(requestsQuery);
    const requests: CodeReviewRequest[] = [];

    querySnapshot.forEach((docSnap) => {
      requests.push({ id: docSnap.id, ...docSnap.data() } as CodeReviewRequest);
    });

    return requests;
  },

  createCodeReviewRequest: async (
    data: Omit<CodeReviewRequest, "id" | "createdAt" | "status">,
  ): Promise<CodeReviewRequest> => {
    const requestData = {
      ...data,
      status: "open" as const,
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, "codeReviewRequests"), requestData);

    return {
      id: docRef.id,
      ...requestData,
    };
  },

  markCodeReviewRequestReviewed: async (requestId: string): Promise<void> => {
    const requestRef = doc(db, "codeReviewRequests", requestId);
    const requestSnapshot = await getDoc(requestRef);
    if (!requestSnapshot.exists()) {
      throw new Error("Code review request not found.");
    }

    const request = requestSnapshot.data() as CodeReviewRequest;
    await updateDoc(requestRef, { status: "reviewed" });

    await firestoreService.createNotification(request.userId, {
      type: "comment_reply",
      message: "Your code review request has been reviewed.",
      link: `/code-review/${requestId}`,
    });
  },

  getCodeReviewComments: async (requestId: string): Promise<CodeReviewComment[]> => {
    const commentsSnapshot = await getDocs(
      collection(db, "codeReviewRequests", requestId, "comments"),
    );
    const comments: CodeReviewComment[] = [];
    commentsSnapshot.forEach((docSnap) => {
      comments.push({ id: docSnap.id, ...docSnap.data() } as CodeReviewComment);
    });
    return comments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  postCodeReviewComment: async (
    commentData: Omit<CodeReviewComment, "id" | "createdAt" | "upvotes" | "upvotedBy">,
  ): Promise<CodeReviewComment> => {
    const comment: CodeReviewComment = {
      ...commentData,
      id: `review-comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      upvotedBy: [],
    };
    await setDoc(
      doc(db, "codeReviewRequests", comment.requestId, "comments", comment.id),
      comment,
    );
    return comment;
  },

  upvoteCodeReviewComment: async (
    commentId: string,
    userId: string,
    requestId: string,
  ): Promise<{ upvoted: boolean; upvotes: number }> => {
    const commentRef = doc(db, "codeReviewRequests", requestId, "comments", commentId);
    return runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(commentRef);
      if (!snapshot.exists()) throw new Error("Code review comment not found.");

      const data = snapshot.data() as Partial<CodeReviewComment>;
      const upvotedBy = Array.isArray(data.upvotedBy) ? data.upvotedBy : [];
      const upvoted = !upvotedBy.includes(userId);
      const currentUpvotes = typeof data.upvotes === "number" ? data.upvotes : upvotedBy.length;
      const upvotes = Math.max(0, currentUpvotes + (upvoted ? 1 : -1));

      transaction.update(commentRef, {
        upvotes: increment(upvoted ? 1 : -1),
        upvotedBy: upvoted ? arrayUnion(userId) : arrayRemove(userId),
      });
      return { upvoted, upvotes };
    });
  },

  editCodeReviewComment: async (
    commentId: string,
    requestId: string,
    content: string,
  ): Promise<void> => {
    await updateDoc(
      doc(db, "codeReviewRequests", requestId, "comments", commentId),
      { content },
    );
  },

  deleteCodeReviewComment: async (commentId: string, requestId: string): Promise<void> => {
    const commentsSnapshot = await getDocs(
      collection(db, "codeReviewRequests", requestId, "comments"),
    );
    const idsToRemove = [
      commentId,
      ...commentsSnapshot.docs
        .filter((comment) => comment.data().parentId === commentId)
        .map((comment) => comment.id),
    ];
    await Promise.all(
      idsToRemove.map((id) =>
        deleteDoc(doc(db, "codeReviewRequests", requestId, "comments", id)),
      ),
    );
  },

  pinCodeReviewComment: async (commentId: string, requestId: string): Promise<void> => {
    await updateDoc(
      doc(db, "codeReviewRequests", requestId, "comments", commentId),
      { pinned: true },
    );
  },

  unpinCodeReviewComment: async (commentId: string, requestId: string): Promise<void> => {
    await updateDoc(
      doc(db, "codeReviewRequests", requestId, "comments", commentId),
      { pinned: false },
    );
  },

  // --- LESSON DISCUSSIONS & Q&A ---
  getLessonComments: async (
    courseId: string,
    lessonId: string,
  ): Promise<LessonComment[]> => {
    const key = `lesson_comments_${courseId}_${lessonId}`;
    try {
      const colRef = collection(
        db,
        "courses",
        courseId,
        "lessons",
        lessonId,
        "comments",
      );
      const querySnapshot = await getDocs(colRef);
      if (!querySnapshot.empty) {
        const comments: LessonComment[] = [];
        querySnapshot.forEach((docSnap) => {
          comments.push({ id: docSnap.id, ...docSnap.data() } as LessonComment);
        });
        comments.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        safeStorage.writeJSON(key, comments);
        return comments;
      }
    } catch (err) {
      console.warn(
        "Firestore offline, falling back to local storage for comments:",
        err,
      );
    }
    return safeStorage.readJSON<LessonComment[]>(key, [], isArray);
  },

  postLessonComment: async (
    commentData: Omit<
      LessonComment,
      "id" | "createdAt" | "upvotes" | "upvotedBy"
    >,
  ): Promise<LessonComment> => {
    const newComment: LessonComment = {
      ...commentData,
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      upvotedBy: [],
    };
    const key = `lesson_comments_${commentData.courseId}_${commentData.lessonId}`;
    try {
      const docRef = doc(
        db,
        "courses",
        commentData.courseId,
        "lessons",
        commentData.lessonId,
        "comments",
        newComment.id,
      );
      await setDoc(docRef, newComment);
    } catch (err) {
      console.warn("Firestore write failed, saving locally:", err);
    }
    const comments = safeStorage.readJSON<LessonComment[]>(key, [], isArray);
    comments.unshift(newComment);
    safeStorage.writeJSON(key, comments);

    if (newComment.parentId) {
      const parent = comments.find(c => c.id === newComment.parentId);
      if (parent?.userId && parent.userId !== newComment.userId) {
        await firestoreService.createNotification(parent.userId, {
          type: 'comment_reply',
          message: `${newComment.username} replied to your comment.`,
          actorUsername: newComment.username,
          link: `/course/${newComment.courseId}`,
        });
      }
    }

    return newComment;
  },

  upvoteLessonComment: async (
    commentId: string,
    userId: string,
    courseId: string,
    lessonId: string,
  ): Promise<{ upvoted: boolean; upvotes: number }> => {
    const docRef = doc(
      db,
      "courses",
      courseId,
      "lessons",
      lessonId,
      "comments",
      commentId,
    );

    return runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(docRef);
      if (!snapshot.exists()) {
        throw new Error("Comment not found.");
      }

      const data = snapshot.data() as Partial<LessonComment>;
      const upvotedBy = Array.isArray(data.upvotedBy) ? data.upvotedBy : [];
      const hasUpvoted = upvotedBy.includes(userId);
      const upvoted = !hasUpvoted;
      const currentUpvotes =
        typeof data.upvotes === "number" ? data.upvotes : upvotedBy.length;
      const upvotes = Math.max(0, currentUpvotes + (upvoted ? 1 : -1));

      transaction.update(docRef, {
        upvotes: increment(upvoted ? 1 : -1),
        upvotedBy: upvoted ? arrayUnion(userId) : arrayRemove(userId),
      });

      return { upvoted, upvotes };
    });
  },

  editLessonComment: async (
    commentId: string,
    courseId: string,
    lessonId: string,
    content: string,
  ): Promise<LessonComment[]> => {
    const key = `lesson_comments_${courseId}_${lessonId}`;
    let comments = safeStorage.readJSON<LessonComment[]>(key, [], isArray);

    comments = comments.map((comment) =>
      comment.id === commentId ? { ...comment, content } : comment,
    );

    try {
      const docRef = doc(
        db,
        "courses",
        courseId,
        "lessons",
        lessonId,
        "comments",
        commentId,
      );
      await updateDoc(docRef, { content });
    } catch (err) {
      console.warn(
        "Firestore update failed, comment edited locally only:",
        err,
      );
    }

    safeStorage.writeJSON(key, comments);
    return comments;
  },

  deleteLessonComment: async (
    commentId: string,
    courseId: string,
    lessonId: string,
  ): Promise<LessonComment[]> => {
    const key = `lesson_comments_${courseId}_${lessonId}`;
    let comments = safeStorage.readJSON<LessonComment[]>(key, [], isArray);

    // Deleting a top-level comment also removes its replies, so no reply is
    // ever left pointing at a parentId that no longer exists.
    const idsToRemove = new Set([
      commentId,
      ...comments.filter((c) => c.parentId === commentId).map((c) => c.id),
    ]);
    comments = comments.filter((comment) => !idsToRemove.has(comment.id));

    try {
      await Promise.all(
        Array.from(idsToRemove).map((id) =>
          deleteDoc(
            doc(db, "courses", courseId, "lessons", lessonId, "comments", id),
          ),
        ),
      );
    } catch (err) {
      console.warn(
        "Firestore delete failed, comment removed locally only:",
        err,
      );
    }

    safeStorage.writeJSON(key, comments);
    return comments;
  },

  pinComment: async (commentId: string, courseId: string, lessonId: string): Promise<LessonComment[]> => {
    const key = `lesson_comments_${courseId}_${lessonId}`;
    let comments = safeStorage.readJSON<LessonComment[]>(key, [], isArray);

    comments = comments.map(comment =>
      comment.id === commentId ? { ...comment, pinned: true } : comment
    );

    try {
      const docRef = doc(db, 'courses', courseId, 'lessons', lessonId, 'comments', commentId);
      await updateDoc(docRef, { pinned: true });
    } catch (err) {
      console.warn('Firestore update failed, comment pinned locally only:', err);
    }

    safeStorage.writeJSON(key, comments);

    const pinnedComment = comments.find(c => c.id === commentId);
    if (pinnedComment?.userId) {
      await firestoreService.createNotification(pinnedComment.userId, {
        type: 'comment_pinned',
        message: 'Your comment was pinned to the top of the discussion.',
        link: `/course/${courseId}`,
      });
    }

    return comments;
  },

  unpinComment: async (
    commentId: string,
    courseId: string,
    lessonId: string,
  ): Promise<LessonComment[]> => {
    const key = `lesson_comments_${courseId}_${lessonId}`;
    let comments = safeStorage.readJSON<LessonComment[]>(key, [], isArray);

    comments = comments.map((comment) =>
      comment.id === commentId ? { ...comment, pinned: false } : comment,
    );

    try {
      const docRef = doc(
        db,
        "courses",
        courseId,
        "lessons",
        lessonId,
        "comments",
        commentId,
      );
      await updateDoc(docRef, { pinned: false });
    } catch (err) {
      console.warn(
        "Firestore update failed, comment unpinned locally only:",
        err,
      );
    }

    safeStorage.writeJSON(key, comments);
    return comments;
  },

  // --- COURSE RATINGS & REVIEWS ---

  /**
   * Reads every review for a course straight from Firestore, newest first.
   * Throws if the read fails so callers can tell "no reviews" apart from
   * "could not reach the server".
   */
  fetchRemoteCourseReviews: async (
    courseId: string,
  ): Promise<CourseReview[]> => {
    const colRef = collection(db, "courses", courseId, "reviews");
    const querySnapshot = await getDocs(colRef);

    const reviews: CourseReview[] = [];
    querySnapshot.forEach((docSnap) => {
      reviews.push({ id: docSnap.id, ...docSnap.data() } as CourseReview);
    });

    return reviews.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  getCourseReviews: async (courseId: string): Promise<CourseReview[]> => {
    const key = `course_reviews_${courseId}`;
    try {
      const reviews = await firestoreService.fetchRemoteCourseReviews(courseId);
      // Cache the remote result even when it is empty. Previously an empty
      // result fell through to the local cache, so a review deleted server-side
      // kept reappearing from this browser's copy.
      safeStorage.writeJSON(key, reviews);
      return reviews;
    } catch (err) {
      console.warn(
        "Firestore offline, falling back to local storage for reviews:",
        err,
      );
    }

    return safeStorage.readJSON<CourseReview[]>(key, [], isArray);
  },

  /** Average, total and 1–5 star breakdown for a set of reviews. */
  summarizeCourseReviews: (
    reviews: CourseReview[],
  ): {
    average: number;
    count: number;
    distribution: Record<number, number>;
  } => {
    const distribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    let sum = 0;

    reviews.forEach((review) => {
      const rating = Math.round(review?.rating ?? 0);
      if (rating < 1 || rating > 5) return; // ignore anything out of range
      distribution[rating] += 1;
      sum += rating;
    });

    const count = Object.values(distribution).reduce(
      (total, n) => total + n,
      0,
    );
    const average = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;

    return { average, count, distribution };
  },

  submitCourseReview: async (
    courseId: string,
    reviewData: Omit<CourseReview, "id" | "createdAt">,
  ): Promise<CourseReview[]> => {
    const key = `course_reviews_${courseId}`;
    const newReview: CourseReview = {
      ...reviewData,
      id: reviewData.userId, // one review per user per course; re-submitting overwrites it
      createdAt: new Date().toISOString(),
    };

    // Write remotely first. The cache is only updated once the review actually
    // exists server-side — writing it up front meant a failed write left the
    // user looking at a review that would silently vanish on the next load.
    const docRef = doc(db, "courses", courseId, "reviews", newReview.id);
    await setDoc(docRef, newReview);

    // The aggregate on the course document must come from the reviews that
    // actually exist, never from this browser's cache. A user whose cache was
    // empty (any first visit) used to overwrite the true average with a count
    // of one, permanently corrupting the rating shown to everybody.
    let reviews: CourseReview[];
    try {
      reviews = await firestoreService.fetchRemoteCourseReviews(courseId);
    } catch (err) {
      // We could not confirm the full set, so leave the stored aggregate alone.
      // A stale average is much better than a wrong one.
      console.warn(
        "Review saved, but the course rating could not be recomputed:",
        err,
      );

      const cached = safeStorage.readJSON<CourseReview[]>(key, [], isArray);

      // Dedupe by userId — the review id *is* the user id, one per course.
      const merged = [
        newReview,
        ...cached.filter((r) => r.userId !== newReview.userId),
      ];
      safeStorage.writeJSON(key, merged);
      return merged;
    }

    safeStorage.writeJSON(key, reviews);

    const { average, count } = firestoreService.summarizeCourseReviews(reviews);
    try {
      const courseRef = doc(db, "courses", courseId);
      await updateDoc(courseRef, { rating: average, reviewCount: count });
    } catch (err) {
      console.warn("Could not update the denormalized course rating:", err);
    }

    return reviews;
  },

  deleteCourseReview: async (
    courseId: string,
    userId: string,
  ): Promise<CourseReview[]> => {
    const key = `course_reviews_${courseId}`;

    // The review id is the user id (one review per user per course), so this
    // is the same doc submitCourseReview writes.
    const docRef = doc(db, "courses", courseId, "reviews", userId);
    await deleteDoc(docRef);

    let reviews: CourseReview[];
    try {
      reviews = await firestoreService.fetchRemoteCourseReviews(courseId);
    } catch (err) {
      console.warn(
        "Review deleted, but the course rating could not be recomputed:",
        err,
      );
      const cached = safeStorage.readJSON<CourseReview[]>(key, [], isArray);
      const filtered = cached.filter((r) => r.userId !== userId);
      safeStorage.writeJSON(key, filtered);
      return filtered;
    }

    safeStorage.writeJSON(key, reviews);

    const { average, count } = firestoreService.summarizeCourseReviews(reviews);
    try {
      const courseRef = doc(db, "courses", courseId);
      await updateDoc(courseRef, { rating: average, reviewCount: count });
    } catch (err) {
      console.warn("Could not update the denormalized course rating:", err);
    }

    return reviews;
  },

  // --- PUBLIC PROFILE (by username) ---
  getUserByUsername: async (
    username: string,
  ): Promise<(User & { uid: string }) | null> => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username), limit(1));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data() as any;
      return {
        uid: docSnap.id,
        username: data.username || "Learner",
        email: data.email || "",
        enrolledDate: data.enrolledDate || "Recent",
        settings: data.preferences?.settings ||
          data.settings || { avatarId: "1", activeFrame: "none" },
        xp: data.xp || 0,
        level: data.level || 1,
        courses: data.courses || [],
        photoURL: data.photoURL,
        streak: data.streak || 0,
        lastActiveDate: data.lastActiveDate || "",
        badges: data.badges || ["first_step"],
        role: data.role || "user",
      } as User & { uid: string };
    } catch (err) {
      console.error("Error fetching public profile by username:", err);
      return null;
    }
  },

  // --- CONTENT REPORTING & MODERATION ---
  flagContent: async (
    report: Omit<ContentReport, "id" | "createdAt" | "status">,
  ): Promise<ContentReport> => {
    const reportId = `${report.contentId}_${report.reporterId}`;
    const docRef = doc(db, "reports", reportId);

    const existing = await getDoc(docRef);
    if (existing.exists()) {
      return {
        id: reportId,
        ...(existing.data() as Omit<ContentReport, "id">),
      };
    }

    const newReport: ContentReport = {
      ...report,
      id: reportId,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const { id, ...payload } = newReport;
    await setDoc(docRef, payload);
    return newReport;
  },

  getReports: async (
    status: ReportStatus = "pending",
    limitCount: number = 50,
  ): Promise<ContentReport[]> => {
    const colRef = collection(db, "reports");
    const q = query(colRef, where("status", "==", status), limit(limitCount));
    const querySnapshot = await getDocs(q);
    const reports: ContentReport[] = [];
    querySnapshot.forEach((docSnap) => {
      reports.push({ id: docSnap.id, ...docSnap.data() } as ContentReport);
    });
    reports.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return reports;
  },

  updateReportStatus: async (
    reportId: string,
    status: ReportStatus,
  ): Promise<void> => {
    const docRef = doc(db, "reports", reportId);
    await updateDoc(docRef, { status });
  },

  // --- SOCIAL & ACTIVITY FEED ---
  createNotification: async (
    recipientUid: string,
    notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>
  ): Promise<void> => {
    if (!recipientUid) return;
    try {
      const colRef = collection(db, 'users', recipientUid, 'notifications');
      await addDoc(colRef, {
        ...notification,
        read: false,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      // A failed notification write should never block the action that
      // triggered it (following, replying, pinning).
      console.warn('Failed to create notification:', err);
    }
  },

  toggleFollowUser: async (
    currentUserId: string,
    targetUserId: string,
    isFollowing: boolean,
    currentUsername?: string,
  ): Promise<void> => {
    const userRef = doc(db, "users", currentUserId);
    await updateDoc(userRef, {
      following: isFollowing
        ? arrayRemove(targetUserId)
        : arrayUnion(targetUserId),
    });

    if (!isFollowing) {
      await firestoreService.createNotification(targetUserId, {
        type: 'follow',
        message: `${currentUsername || 'Someone'} started following you.`,
        actorUsername: currentUsername,
        link: currentUsername ? `/u/${currentUsername}` : undefined,
      });
    }
  },

  publishActivityEvent: async (
    userId: string,
    userName: string,
    userAvatar: string,
    type: "badge" | "course" | "streak",
    details: string,
  ): Promise<void> => {
    const activitiesRef = collection(db, "activities");
    await addDoc(activitiesRef, {
      userId,
      userName,
      userAvatar,
      type,
      details,
      kudosCount: 0,
      kudosUsers: [],
      createdAt: serverTimestamp(),
    });
  },

  getFriendActivityFeed: async (followingIds: string[]): Promise<any[]> => {
    if (!followingIds || followingIds.length === 0) return [];

    const IN_QUERY_CHUNK_SIZE = 30; // Firestore's current cap for the `in` operator
    const FEED_LIMIT = 20; // overall feed size — also used as each chunk's per-query cap,
    // since no single chunk can contribute more than the final feed size anyway

    const chunks: string[][] = [];
    for (let i = 0; i < followingIds.length; i += IN_QUERY_CHUNK_SIZE) {
      chunks.push(followingIds.slice(i, i + IN_QUERY_CHUNK_SIZE));
    }

    const activitiesRef = collection(db, "activities");
    const chunkResults = await Promise.allSettled(
      chunks.map((chunk) =>
        getDocs(
          query(
            activitiesRef,
            where("userId", "in", chunk),
            orderBy("createdAt", "desc"),
            limit(FEED_LIMIT),
          ),
        ),
      ),
    );

    // A document's createdAt is written with serverTimestamp(), which can
    // still read as null if the client sees the write before the server
    // timestamp has resolved. Treat that as "just now" so it sorts to the
    // top predictably instead of throwing or landing at a random position.
    const getCreatedAtMillis = (activity: any): number => {
      const createdAt = activity?.createdAt;
      if (!createdAt) return Date.now();
      if (typeof createdAt.toMillis === "function") return createdAt.toMillis();
      if (typeof createdAt === "string") {
        const parsed = new Date(createdAt).getTime();
        return Number.isNaN(parsed) ? Date.now() : parsed;
      }
      return Date.now();
    };

    const merged = new Map<string, any>();
    chunkResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        result.value.docs.forEach((docSnap) => {
          merged.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
        });
      } else {
        // One chunk failing (e.g. a transient network error) shouldn't blank
        // out activity from everyone else the user follows.
        console.error(
          `Activity feed chunk ${index} failed, showing partial results:`,
          result.reason,
        );
      }
    });

    return Array.from(merged.values())
      .sort((a, b) => getCreatedAtMillis(b) - getCreatedAtMillis(a))
      .slice(0, FEED_LIMIT);
  },

  sendKudos: async (
    activityId: string,
    currentUserId: string,
  ): Promise<void> => {
    const activityRef = doc(db, "activities", activityId);
    await updateDoc(activityRef, {
      kudosCount: increment(1),
      kudosUsers: arrayUnion(currentUserId),
    });
  },

  // --- PUBLIC LESSON NOTES (#355) ---
  getPublicLessonNotes: async (
    courseId: string,
    lessonId: string,
  ): Promise<PublicLessonNote[]> => {
    const colRef = collection(
      db,
      "courses",
      courseId,
      "lessons",
      lessonId,
      "publicNotes",
    );
    const querySnapshot = await getDocs(colRef);
    const notes: PublicLessonNote[] = [];
    querySnapshot.forEach((docSnap) => {
      notes.push({ id: docSnap.id, ...docSnap.data() } as PublicLessonNote);
    });
    return notes.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  createPublicLessonNote: async (
    noteData: Omit<PublicLessonNote, "createdAt" | "updatedAt"> & {
      id?: string;
      createdAt?: string;
      updatedAt?: string;
    },
  ): Promise<PublicLessonNote> => {
    const now = new Date().toISOString();
    const noteId =
      noteData.id ||
      `pub_note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const newPublicNote: PublicLessonNote = {
      id: noteId,
      courseId: noteData.courseId,
      lessonId: noteData.lessonId,
      userId: noteData.userId,
      username: noteData.username,
      avatarId: noteData.avatarId || "1",
      photoURL: noteData.photoURL,
      text: noteData.text,
      createdAt: noteData.createdAt || now,
      updatedAt: noteData.updatedAt || now,
    };

    const docRef = doc(
      db,
      "courses",
      noteData.courseId,
      "lessons",
      noteData.lessonId,
      "publicNotes",
      noteId,
    );
    await setDoc(docRef, newPublicNote);
    return newPublicNote;
  },

  updatePublicLessonNote: async (
    courseId: string,
    lessonId: string,
    noteId: string,
    text: string,
  ): Promise<void> => {
    const docRef = doc(
      db,
      "courses",
      courseId,
      "lessons",
      lessonId,
      "publicNotes",
      noteId,
    );
    await updateDoc(docRef, {
      text,
      updatedAt: new Date().toISOString(),
    });
  },

  deletePublicLessonNote: async (
    courseId: string,
    lessonId: string,
    noteId: string,
  ): Promise<void> => {
    const docRef = doc(
      db,
      "courses",
      courseId,
      "lessons",
      lessonId,
      "publicNotes",
      noteId,
    );
    await deleteDoc(docRef);
  },
};
