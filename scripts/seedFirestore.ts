import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { COURSES, COMPANIES } from '../constants';
import * as fs from 'fs';
import * as path from 'path';

// Parse .env manually to retrieve VITE_FIREBASE_* credentials
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Error: Missing Firebase environment variables in .env file.");
  console.error("Please ensure you copy .env.example to .env and configure your Firebase project variables.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Starting Firestore migration...");

  // 1. Migrate courses and quizzes
  console.log(`Migrating ${COURSES.length} courses and quizzes...`);
  for (const course of COURSES) {
    const courseId = course.id;
    
    // Separate course details from quiz array
    const { quiz, ...courseDetails } = course;
    
    // Save course details to 'courses' collection
    await setDoc(doc(db, 'courses', courseId), courseDetails);
    
    // Save quiz to 'quizzes' collection
    await setDoc(doc(db, 'quizzes', courseId), {
      courseId,
      questions: quiz
    });
  }

  // 2. Migrate companies
  console.log(`Migrating ${COMPANIES.length} companies...`);
  for (const company of COMPANIES) {
    await setDoc(doc(db, 'companies', company.id), company);
  }

  console.log("Firestore migration completed successfully!");
}

seed().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
