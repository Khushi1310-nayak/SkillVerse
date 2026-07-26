import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Course, Company, QuizQuestion, Chapter } from '../types';
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
  }
};
