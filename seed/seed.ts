/** تشغيل: ts-node seed/seed.ts بعد ضبط .env.local وتشغيل emulator أو Firestore مباشر */
import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
});
const db = getFirestore(app);

async function load(collectionName: string, file: string) {
  const arr = JSON.parse(readFileSync(file, 'utf-8'));
  for (const it of arr) {
    await setDoc(doc(db, collectionName, it.id), it);
    console.log('✔', collectionName, it.id);
  }
}

(async()=>{
  await load('terms', 'seed/sample-terms.json');
  await load('faculty', 'seed/sample-faculty.json');
  await load('departments', 'seed/sample-departments.json');
  console.log('تم التحميل.');
})();
