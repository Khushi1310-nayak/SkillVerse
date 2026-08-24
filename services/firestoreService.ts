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
  increment
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Course, Company, QuizQuestion, Chapter, LessonComment, CourseReview, User, ContentReport, ReportStatus } from '../types';
import { COURSES, COMPANIES } from '../constants';

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
        title: `Overview of ${sec.title.split('. ')[1] || sec.title}`,
        content: `<p>Welcome to ${sec.title}. In this lesson, we cover the core concepts, syntax, and best practices associated with this topic. Follow along with the official documentation for more context.</p>`
      }
    ]
  }));
};

export const firestoreService = {
  // --- DATABASE SEEDING ---
  seedDatabase: async (): Promise<void> => {
    try {
      const coursesCol = collection(db, 'courses');
      const coursesSnap = await getDocs(coursesCol);

      if (coursesSnap.empty) {
        console.log('Seeding courses to Firestore...');
        for (const course of COURSES) {
          const initialChapters = generateInitialChapters(course.title);

          // Separate quiz from course metadata for /courses collection
          const { quiz, ...courseData } = course;

          // Seed course metadata
          await setDoc(doc(db, 'courses', course.id), {
            ...courseData,
            chapters: initialChapters,
          });

          // Seed corresponding quiz under /quizzes
          await setDoc(doc(db, 'quizzes', course.id), {
            id: course.id,
            courseId: course.id,
            title: `${course.title} Quiz`,
            questions: quiz
          });
        }
      }

      const companiesCol = collection(db, 'companies');
      const companiesSnap = await getDocs(companiesCol);

      if (companiesSnap.empty) {
        console.log('Seeding companies to Firestore...');
        for (const company of COMPANIES) {
          await setDoc(doc(db, 'companies', company.id), company);
        }
      }
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  },

  forceReseedDatabase: async (): Promise<void> => {
    try {
      console.log('Force re-seeding courses to Firestore...');
      for (const course of COURSES) {
        const initialChapters = generateInitialChapters(course.title);
        const { quiz, ...courseData } = course;

        await setDoc(doc(db, 'courses', course.id), {
          ...courseData,
          chapters: initialChapters,
        }, { merge: true });

        await setDoc(doc(db, 'quizzes', course.id), {
          id: course.id,
          courseId: course.id,
          title: `${course.title} Quiz`,
          questions: quiz
        }, { merge: true });
      }

      console.log('Force re-seeding companies to Firestore...');
      for (const company of COMPANIES) {
        await setDoc(doc(db, 'companies', company.id), company, { merge: true });
      }
    } catch (error) {
      console.error('Error force re-seeding database:', error);
      throw error;
    }
  },

  // --- COURSES CRUD ---
  getCourses: async (): Promise<Course[]> => {
    const querySnapshot = await getDocs(collection(db, 'courses'));
    const courses: Course[] = [];
    querySnapshot.forEach((docSnap) => {
      courses.push({ id: docSnap.id, ...docSnap.data() } as Course);
    });
    return courses;
  },

  getCourse: async (id: string): Promise<Course | null> => {
    const docRef = doc(db, 'courses', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Course;
    }
    return null;
  },

  createCourse: async (course: Course): Promise<void> => {
    await setDoc(doc(db, 'courses', course.id), {
      categoryId: course.categoryId,
      title: course.title,
      description: course.description,
      icon: course.icon,
      duration: course.duration,
      level: course.level,
      content: course.content || '',
      resources: course.resources || [],
      chapters: course.chapters || [],
    });

    // Create empty quiz linked to the course
    await setDoc(doc(db, 'quizzes', course.id), {
      id: course.id,
      courseId: course.id,
      title: `${course.title} Quiz`,
      questions: []
    });
  },

  updateCourse: async (id: string, course: Partial<Course>): Promise<void> => {
    const docRef = doc(db, 'courses', id);
    await updateDoc(docRef, course);
  },

  deleteCourse: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'courses', id));
    await deleteDoc(doc(db, 'quizzes', id));
  },

  // --- QUIZZES CRUD ---
  getQuiz: async (courseId: string): Promise<{ id: string; courseId: string; title: string; questions: QuizQuestion[] } | null> => {
    const docSnap = await getDoc(doc(db, 'quizzes', courseId));
    if (docSnap.exists()) {
      return docSnap.data() as any;
    }
    return null;
  },

  updateQuiz: async (courseId: string, questions: QuizQuestion[]): Promise<void> => {
    await setDoc(doc(db, 'quizzes', courseId), {
      id: courseId,
      courseId,
      questions
    }, { merge: true });
  },

  // --- COMPANIES CRUD ---
  getCompanies: async (): Promise<Company[]> => {
    const querySnapshot = await getDocs(collection(db, 'companies'));
    const companies: Company[] = [];
    querySnapshot.forEach((docSnap) => {
      companies.push({ id: docSnap.id, ...docSnap.data() } as Company);
    });
    return companies;
  },

  getCompany: async (id: string): Promise<Company | null> => {
    const docSnap = await getDoc(doc(db, 'companies', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Company;
    }
    return null;
  },

  createCompany: async (company: Company): Promise<void> => {
    await setDoc(doc(db, 'companies', company.id), company);
  },

  updateCompany: async (id: string, company: Partial<Company>): Promise<void> => {
    const docRef = doc(db, 'companies', id);
    await updateDoc(docRef, company);
  },

  deleteCompany: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'companies', id));
  },

  // --- LESSON DISCUSSIONS & Q&A ---
  getLessonComments: async (courseId: string, lessonId: string): Promise<LessonComment[]> => {
    const key = `lesson_comments_${courseId}_${lessonId}`;
    try {
      const colRef = collection(db, 'courses', courseId, 'lessons', lessonId, 'comments');
      const querySnapshot = await getDocs(colRef);
      if (!querySnapshot.empty) {
        const comments: LessonComment[] = [];
        querySnapshot.forEach((docSnap) => {
          comments.push({ id: docSnap.id, ...docSnap.data() } as LessonComment);
        });
        comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        localStorage.setItem(key, JSON.stringify(comments));
        return comments;
      }
    } catch (err) {
      console.warn('Firestore offline, falling back to local storage for comments:', err);
    }
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  },

  postLessonComment: async (commentData: Omit<LessonComment, 'id' | 'createdAt' | 'upvotes' | 'upvotedBy'>): Promise<LessonComment> => {
    const newComment: LessonComment = {
      ...commentData,
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      upvotedBy: [],
    };
    const key = `lesson_comments_${commentData.courseId}_${commentData.lessonId}`;
    try {
      const docRef = doc(db, 'courses', commentData.courseId, 'lessons', commentData.lessonId, 'comments', newComment.id);
      await setDoc(docRef, newComment);
    } catch (err) {
      console.warn('Firestore write failed, saving locally:', err);
    }
    const saved = localStorage.getItem(key);
    const comments: LessonComment[] = saved ? JSON.parse(saved) : [];
    comments.unshift(newComment);
    localStorage.setItem(key, JSON.stringify(comments));
    return newComment;
  },

  upvoteLessonComment: async (commentId: string, userId: string, courseId: string, lessonId: string): Promise<LessonComment[]> => {
    const key = `lesson_comments_${courseId}_${lessonId}`;
    const saved = localStorage.getItem(key);
    let comments: LessonComment[] = saved ? JSON.parse(saved) : [];

    comments = comments.map(comment => {
      if (comment.id === commentId) {
        const upvotedBy = comment.upvotedBy || [];
        const hasUpvoted = upvotedBy.includes(userId);
        const newUpvotedBy = hasUpvoted
          ? upvotedBy.filter(id => id !== userId)
          : [...upvotedBy, userId];
        const newUpvotes = newUpvotedBy.length;
        const updated = { ...comment, upvotes: newUpvotes, upvotedBy: newUpvotedBy };

        // Try updating firestore as well asynchronously
        try {
          const docRef = doc(db, 'courses', courseId, 'lessons', lessonId, 'comments', commentId);
          updateDoc(docRef, { upvotes: newUpvotes, upvotedBy: newUpvotedBy }).catch(() => { });
        } catch (e) { }

        return updated;
      }
      return comment;
    });

    localStorage.setItem(key, JSON.stringify(comments));
    return comments;
  },

  editLessonComment: async (commentId: string, courseId: string, lessonId: string, content: string): Promise<LessonComment[]> => {
    const key = `lesson_comments_${courseId}_${lessonId}`;
    const saved = localStorage.getItem(key);
    let comments: LessonComment[] = saved ? JSON.parse(saved) : [];

    comments = comments.map(comment =>
      comment.id === commentId ? { ...comment, content } : comment
    );

    try {
      const docRef = doc(db, 'courses', courseId, 'lessons', lessonId, 'comments', commentId);
      await updateDoc(docRef, { content });
    } catch (err) {
      console.warn('Firestore update failed, comment edited locally only:', err);
    }

    localStorage.setItem(key, JSON.stringify(comments));
    return comments;
  },

  deleteLessonComment: async (commentId: string, courseId: string, lessonId: string): Promise<LessonComment[]> => {
    const key = `lesson_comments_${courseId}_${lessonId}`;
    const saved = localStorage.getItem(key);
    let comments: LessonComment[] = saved ? JSON.parse(saved) : [];

    // Deleting a top-level comment also removes its replies, so no reply is
    // ever left pointing at a parentId that no longer exists.
    const idsToRemove = new Set([commentId, ...comments.filter(c => c.parentId === commentId).map(c => c.id)]);
    comments = comments.filter(comment => !idsToRemove.has(comment.id));

    try {
      await Promise.all(
        Array.from(idsToRemove).map(id =>
          deleteDoc(doc(db, 'courses', courseId, 'lessons', lessonId, 'comments', id))
        )
      );
    } catch (err) {
      console.warn('Firestore delete failed, comment removed locally only:', err);
    }

    localStorage.setItem(key, JSON.stringify(comments));
    return comments;
  },

  pinComment: async (commentId: string, courseId: string, lessonId: string): Promise<LessonComment[]> => {
    const key = `lesson_comments_${courseId}_${lessonId}`;
    const saved = localStorage.getItem(key);
    let comments: LessonComment[] = saved ? JSON.parse(saved) : [];

    comments = comments.map(comment =>
      comment.id === commentId ? { ...comment, pinned: true } : comment
    );

    try {
      const docRef = doc(db, 'courses', courseId, 'lessons', lessonId, 'comments', commentId);
      await updateDoc(docRef, { pinned: true });
    } catch (err) {
      console.warn('Firestore update failed, comment pinned locally only:', err);
    }

    localStorage.setItem(key, JSON.stringify(comments));
    return comments;
  },

  unpinComment: async (commentId: string, courseId: string, lessonId: string): Promise<LessonComment[]> => {
    const key = `lesson_comments_${courseId}_${lessonId}`;
    const saved = localStorage.getItem(key);
    let comments: LessonComment[] = saved ? JSON.parse(saved) : [];

    comments = comments.map(comment =>
      comment.id === commentId ? { ...comment, pinned: false } : comment
    );

    try {
      const docRef = doc(db, 'courses', courseId, 'lessons', lessonId, 'comments', commentId);
      await updateDoc(docRef, { pinned: false });
    } catch (err) {
      console.warn('Firestore update failed, comment unpinned locally only:', err);
    }

    localStorage.setItem(key, JSON.stringify(comments));
    return comments;
  },

  // --- COURSE RATINGS & REVIEWS ---

  /**
   * Reads every review for a course straight from Firestore, newest first.
   * Throws if the read fails so callers can tell "no reviews" apart from
   * "could not reach the server".
   */
  fetchRemoteCourseReviews: async (courseId: string): Promise<CourseReview[]> => {
    const colRef = collection(db, 'courses', courseId, 'reviews');
    const querySnapshot = await getDocs(colRef);

    const reviews: CourseReview[] = [];
    querySnapshot.forEach((docSnap) => {
      reviews.push({ id: docSnap.id, ...docSnap.data() } as CourseReview);
    });

    return reviews.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getCourseReviews: async (courseId: string): Promise<CourseReview[]> => {
    const key = `course_reviews_${courseId}`;
    try {
      const reviews = await firestoreService.fetchRemoteCourseReviews(courseId);
      // Cache the remote result even when it is empty. Previously an empty
      // result fell through to the local cache, so a review deleted server-side
      // kept reappearing from this browser's copy.
      localStorage.setItem(key, JSON.stringify(reviews));
      return reviews;
    } catch (err) {
      console.warn('Firestore offline, falling back to local storage for reviews:', err);
    }

    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  /** Average, total and 1–5 star breakdown for a set of reviews. */
  summarizeCourseReviews: (
    reviews: CourseReview[]
  ): { average: number; count: number; distribution: Record<number, number> } => {
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    reviews.forEach(review => {
      const rating = Math.round(review?.rating ?? 0);
      if (rating < 1 || rating > 5) return; // ignore anything out of range
      distribution[rating] += 1;
      sum += rating;
    });

    const count = Object.values(distribution).reduce((total, n) => total + n, 0);
    const average = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;

    return { average, count, distribution };
  },

  submitCourseReview: async (
    courseId: string,
    reviewData: Omit<CourseReview, 'id' | 'createdAt'>
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
    const docRef = doc(db, 'courses', courseId, 'reviews', newReview.id);
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
      console.warn('Review saved, but the course rating could not be recomputed:', err);

      let cached: CourseReview[] = [];
      try {
        const saved = localStorage.getItem(key);
        cached = saved ? JSON.parse(saved) : [];
      } catch {
        cached = [];
      }

      // Dedupe by userId — the review id *is* the user id, one per course.
      const merged = [newReview, ...cached.filter(r => r.userId !== newReview.userId)];
      localStorage.setItem(key, JSON.stringify(merged));
      return merged;
    }

    localStorage.setItem(key, JSON.stringify(reviews));

    const { average, count } = firestoreService.summarizeCourseReviews(reviews);
    try {
      const courseRef = doc(db, 'courses', courseId);
      await updateDoc(courseRef, { rating: average, reviewCount: count });
    } catch (err) {
      console.warn('Could not update the denormalized course rating:', err);
    }

    return reviews;
  },

  deleteCourseReview: async (courseId: string, userId: string): Promise<CourseReview[]> => {
    const key = `course_reviews_${courseId}`;

    // The review id is the user id (one review per user per course), so this
    // is the same doc submitCourseReview writes.
    const docRef = doc(db, 'courses', courseId, 'reviews', userId);
    await deleteDoc(docRef);

    let reviews: CourseReview[];
    try {
      reviews = await firestoreService.fetchRemoteCourseReviews(courseId);
    } catch (err) {
      console.warn('Review deleted, but the course rating could not be recomputed:', err);
      const saved = localStorage.getItem(key);
      const cached: CourseReview[] = saved ? JSON.parse(saved) : [];
      const filtered = cached.filter(r => r.userId !== userId);
      localStorage.setItem(key, JSON.stringify(filtered));
      return filtered;
    }

    localStorage.setItem(key, JSON.stringify(reviews));

    const { average, count } = firestoreService.summarizeCourseReviews(reviews);
    try {
      const courseRef = doc(db, 'courses', courseId);
      await updateDoc(courseRef, { rating: average, reviewCount: count });
    } catch (err) {
      console.warn('Could not update the denormalized course rating:', err);
    }

    return reviews;
  },

  // --- PUBLIC PROFILE (by username) ---
  getUserByUsername: async (username: string): Promise<(User & { uid: string }) | null> => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username), limit(1));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data() as any;
      return {
        uid: docSnap.id,
        username: data.username || 'Learner',
        email: data.email || '',
        enrolledDate: data.enrolledDate || 'Recent',
        settings: data.preferences?.settings || data.settings || { avatarId: '1', activeFrame: 'none' },
        xp: data.xp || 0,
        level: data.level || 1,
        courses: data.courses || [],
        photoURL: data.photoURL,
        streak: data.streak || 0,
        lastActiveDate: data.lastActiveDate || '',
        badges: data.badges || ['first_step'],
        role: data.role || 'user',
      } as User & { uid: string };
    } catch (err) {
      console.error('Error fetching public profile by username:', err);
      return null;
    }
  },

  // --- CONTENT REPORTING & MODERATION ---
  flagContent: async (
    report: Omit<ContentReport, 'id' | 'createdAt' | 'status'>
  ): Promise<ContentReport> => {
    const reportId = `${report.contentId}_${report.reporterId}`;
    const docRef = doc(db, 'reports', reportId);

    const existing = await getDoc(docRef);
    if (existing.exists()) {
      return { id: reportId, ...(existing.data() as Omit<ContentReport, 'id'>) };
    }

    const newReport: ContentReport = {
      ...report,
      id: reportId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const { id, ...payload } = newReport;
    await setDoc(docRef, payload);
    return newReport;
  },

  getReports: async (): Promise<ContentReport[]> => {
    const colRef = collection(db, 'reports');
    const querySnapshot = await getDocs(colRef);
    const reports: ContentReport[] = [];
    querySnapshot.forEach((docSnap) => {
      reports.push({ id: docSnap.id, ...docSnap.data() } as ContentReport);
    });
    reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return reports;
  },

  updateReportStatus: async (reportId: string, status: ReportStatus): Promise<void> => {
    const docRef = doc(db, 'reports', reportId);
    await updateDoc(docRef, { status });
  },

  // --- SOCIAL & ACTIVITY FEED ---
  toggleFollowUser: async (currentUserId: string, targetUserId: string, isFollowing: boolean): Promise<void> => {
    const userRef = doc(db, 'users', currentUserId);
    await updateDoc(userRef, {
      following: isFollowing ? arrayRemove(targetUserId) : arrayUnion(targetUserId)
    });
  },

  publishActivityEvent: async (userId: string, userName: string, userAvatar: string, type: 'badge' | 'course' | 'streak', details: string): Promise<void> => {
    const activitiesRef = collection(db, 'activities');
    await addDoc(activitiesRef, {
      userId,
      userName,
      userAvatar,
      type,
      details,
      kudosCount: 0,
      kudosUsers: [],
      createdAt: serverTimestamp()
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

    const activitiesRef = collection(db, 'activities');
    const chunkResults = await Promise.allSettled(
      chunks.map(chunk =>
        getDocs(
          query(
            activitiesRef,
            where('userId', 'in', chunk),
            orderBy('createdAt', 'desc'),
            limit(FEED_LIMIT)
          )
        )
      )
    );

    // A document's createdAt is written with serverTimestamp(), which can
    // still read as null if the client sees the write before the server
    // timestamp has resolved. Treat that as "just now" so it sorts to the
    // top predictably instead of throwing or landing at a random position.
    const getCreatedAtMillis = (activity: any): number => {
      const createdAt = activity?.createdAt;
      if (!createdAt) return Date.now();
      if (typeof createdAt.toMillis === 'function') return createdAt.toMillis();
      if (typeof createdAt === 'string') {
        const parsed = new Date(createdAt).getTime();
        return Number.isNaN(parsed) ? Date.now() : parsed;
      }
      return Date.now();
    };

    const merged = new Map<string, any>();
    chunkResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        result.value.docs.forEach(docSnap => {
          merged.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
        });
      } else {
        // One chunk failing (e.g. a transient network error) shouldn't blank
        // out activity from everyone else the user follows.
        console.error(`Activity feed chunk ${index} failed, showing partial results:`, result.reason);
      }
    });

    return Array.from(merged.values())
      .sort((a, b) => getCreatedAtMillis(b) - getCreatedAtMillis(a))
      .slice(0, FEED_LIMIT);
  },

  sendKudos: async (activityId: string, currentUserId: string): Promise<void> => {
    const activityRef = doc(db, 'activities', activityId);
    await updateDoc(activityRef, {
      kudosCount: increment(1),
      kudosUsers: arrayUnion(currentUserId)
    });
  }
};
