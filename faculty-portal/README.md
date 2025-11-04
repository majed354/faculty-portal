# بوابة بيانات أعضاء هيئة التدريس

قالب جاهز لبوابة بيانات أعضاء هيئة التدريس (Next.js + Tailwind + Firebase) مع تقارير قابلة للطباعة وفلترة متعددة وتعيين فصل التقرير.

## الميزات
- إدارة بيانات الأعضاء، النشاطات، الأعمال العلمية، والمقررات.
- تقارير بطباعة نظيفة (CSS print) مع اختيار الحقول، التجميع، والفرز.
- فلترة حسب القسم/الفرع/الرتبة/الجنسية/الفصل.
- **asOfTerm**: قراءة الحالة كما كانت في فصل محدد (الرتبة/القسم حينها).
- لوحة تحكم تعرض الإحصاءات وآخر التحديثات.

## المتطلبات
- Node 18+
- حساب Firebase (Firestore + Auth اختيارياً)
- حساب Netlify للنشر

## الإعداد المحلي
1. انسخ الملف `.env.example` إلى `.env.local` واملأ القيم.
2. `npm i`
3. `npm run dev`

## النشر على Netlify
- أضف المستودع إلى GitHub
- اربط Netlify بالمستودع
- متغيرات البيئة: انسخ `.env.local` إلى إعدادات Netlify
- Build command: `npm run build`
- Publish directory: `.next`
- (اختياري) فعّل Netlify Next Runtime

## إعداد Firebase
1. أنشئ مشروع Firebase، فعّل Firestore.
2. من الإعدادات > General انسخ مفاتيح Web App إلى `.env.local`.
3. ارفع قواعد `firestore.rules` و`firestore.indexes.json`.
4. لتجارب أولية: استورد `seed/*.json`.
