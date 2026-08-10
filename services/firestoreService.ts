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
import { Course, Company, QuizQuestion, Chapter, LessonComment, CourseReview } from '../types';
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

  // --- COURSE RATINGS & REVIEWS ---
  getCourseReviews: async (courseId: string): Promise<CourseReview[]> => {
    const key = `course_reviews_${courseId}`;
    try {
      const colRef = collection(db, 'courses', courseId, 'reviews');
      const querySnapshot = await getDocs(colRef);
      if (!querySnapshot.empty) {
        const reviews: CourseReview[] = [];
        querySnapshot.forEach((docSnap) => {
          reviews.push({ id: docSnap.id, ...docSnap.data() } as CourseReview);
        });
        reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        localStorage.setItem(key, JSON.stringify(reviews));
        return reviews;
      }
    } catch (err) {
      console.warn('Firestore offline, falling back to local storage for reviews:', err);
    }
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
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

    // Upsert into local cache by userId first (offline-friendly, matches comment pattern)
    const saved = localStorage.getItem(key);
    let reviews: CourseReview[] = saved ? JSON.parse(saved) : [];
    reviews = reviews.filter(r => r.userId !== newReview.userId);
    reviews.unshift(newReview);
    localStorage.setItem(key, JSON.stringify(reviews));

    try {
      const docRef = doc(db, 'courses', courseId, 'reviews', newReview.id);
      await setDoc(docRef, newReview);

      // Recompute and persist the denormalized average rating on the course doc
      const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
      const reviewCount = reviews.length;
      const avgRating = reviewCount > 0 ? Math.round((ratingSum / reviewCount) * 10) / 10 : 0;

      const courseRef = doc(db, 'courses', courseId);
      await updateDoc(courseRef, { rating: avgRating, reviewCount }).catch(() => { });
    } catch (err) {
      console.warn('Firestore write failed, review saved locally only:', err);
    }

    return reviews;
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

    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef,
      where('userId', 'in', followingIds.slice(0, 10)),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  },

  sendKudos: async (activityId: string, currentUserId: string): Promise<void> => {
    const activityRef = doc(db, 'activities', activityId);
    await updateDoc(activityRef, {
      kudosCount: increment(1),
      kudosUsers: arrayUnion(currentUserId)
    });
  }
};
