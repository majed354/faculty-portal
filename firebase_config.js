// ⚠️ هذا الملف يحتاج تعديل - اتبع التعليمات أدناه
const firebaseConfig = {
  apiKey: "AIzaSyBdNamS49AFq_U9nO95p5KvQhhmdng0c7I",
  authDomain: "my-netlify-app-9ce62.firebaseapp.com",
  databaseURL: "https://my-netlify-app-9ce62-default-rtdb.firebaseio.com",
  projectId: "my-netlify-app-9ce62",
  storageBucket: "my-netlify-app-9ce62.firebasestorage.app",
  messagingSenderId: "532298452257",
  appId: "1:532298452257:web:5a47b683ba357c4fbc8260"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// الحصول على مرجع قاعدة البيانات
const database = firebase.database();
