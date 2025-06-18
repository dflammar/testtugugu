مركز بانوراما للأشعة - النسخة المبسطة
=====================================

هذا المشروع هو نسخة مبسطة من موقع مركز بانوراما للأشعة، تم تحويله من Django إلى Frontend Static مع Backend بسيط.

المميزات:
---------
✅ تصميم متجاوب باللغة العربية
✅ صفحات متعددة (الرئيسية، الخدمات، الأطباء، المدونة، التواصل، الحجز، العروض)
✅ نظام حجز مواعيد تفاعلي
✅ لوحة تحكم بسيطة
✅ Backend باستخدام Flask
✅ قاعدة بيانات SQLite

كيفية التشغيل:
--------------

1. تشغيل Frontend فقط:
   - افتح Terminal في مجلد static_site
   - اكتب: python -m http.server 8080
   - افتح المتصفح على: http://localhost:8080

2. تشغيل Backend مع Frontend:
   - افتح Terminal في مجلد static_site/backend
   - اكتب: pip install -r requirements.txt
   - اكتب: python app.py
   - افتح المتصفح على: http://localhost:5000

3. تشغيل لوحة التحكم:
   - بعد تشغيل Backend، افتح: http://localhost:5000/admin.html

ملفات مهمة:
------------
- index.html - الصفحة الرئيسية
- booking.html - صفحة الحجز
- services.html - صفحة الخدمات
- team.html - صفحة الأطباء
- blog.html - صفحة المدونة
- contact.html - صفحة التواصل
- offers.html - صفحة العروض
- admin.html - لوحة التحكم
- backend/app.py - التطبيق الرئيسي
- assets/css/custom.css - التصميم
- assets/js/custom.js - الوظائف التفاعلية

للنشر على الاستضافة:
---------------------
1. ارفع ملفات Frontend إلى مجلد public_html
2. ارفع ملفات Backend إلى مجلد منفصل
3. اضبط إعدادات Python في لوحة التحكم

للمساعدة والدعم:
-----------------
البريد الإلكتروني: info@panorama.com
الهاتف: 040-1234567

جميع الحقوق محفوظة لمركز بانوراما للأشعة - قطور، الغربية، مصر 