// ⚠️ هذا الملف يحتاج تعديل - اتبع التعليمات أدناه
const firebaseConfig = {
  apiKey: "AIzaSyCXUfVZgac28hxezDCc6l4h7sC5au7zctA",
  authDomain: "faculty-data-f2ceb.firebaseapp.com",
  projectId: "faculty-data-f2ceb",
  storageBucket: "faculty-data-f2ceb.firebasestorage.app",
  messagingSenderId: "1045696055217",
  appId: "1:1045696055217:web:8c45657364b3cb99ff1f90",
  measurementId: "G-FB38DKBV8Q"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// الحصول على مرجع قاعدة البيانات
const database = firebase.database();
