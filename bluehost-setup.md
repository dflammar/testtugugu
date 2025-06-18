# دليل النشر على Bluehost - مركز بانوراما للأشعة

## الخطوة 1: شراء استضافة Bluehost

1. اذهب إلى [bluehost.com](https://bluehost.com)
2. اختر خطة الاستضافة المناسبة (Basic أو Plus)
3. اختر اسم النطاق
4. أكمل عملية الشراء

## الخطوة 2: إعداد cPanel

1. سجل دخول إلى لوحة التحكم cPanel
2. اذهب إلى "File Manager"
3. انتقل إلى مجلد `public_html`

## الخطوة 3: رفع الملفات

### الطريقة الأولى: رفع مباشر
1. في File Manager، ارفع جميع ملفات مجلد `static_site` إلى `public_html`
2. تأكد من رفع الملفات التالية:
   - `index.html`
   - `about.html`
   - `services.html`
   - `team.html`
   - `blog.html`
   - `contact.html`
   - `booking.html`
   - `offers.html`
   - `admin.html`
   - مجلد `assets/`
   - مجلد `backend/`
   - `.htaccess`

### الطريقة الثانية: رفع عبر FTP
1. استخدم برنامج FileZilla أو أي برنامج FTP
2. اربط بالخادم باستخدام بيانات FTP من cPanel
3. ارفع جميع الملفات إلى مجلد `public_html`

## الخطوة 4: إعداد Python (للـ Backend)

### في cPanel:
1. اذهب إلى "Python Selector"
2. اختر Python 3.9 أو أحدث
3. أنشئ تطبيق Python جديد
4. اضبط مسار التطبيق: `/home/username/public_html/backend`
5. اضبط ملف التشغيل: `app.py`

### إعداد متغيرات البيئة:
1. في Python Selector، اضبط Environment Variables:
```
SECRET_KEY=your-secret-key-here
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## الخطوة 5: تثبيت المتطلبات

### في cPanel Terminal أو SSH:
```bash
cd public_html/backend
pip install -r requirements.txt
```

## الخطوة 6: إعداد قاعدة البيانات

### للاستخدام البسيط (SQLite):
- قاعدة البيانات ستُنشئ تلقائياً
- تأكد من صلاحيات الكتابة على المجلد

### للاستخدام المتقدم (MySQL):
1. اذهب إلى "MySQL Databases" في cPanel
2. أنشئ قاعدة بيانات جديدة
3. أنشئ مستخدم جديد
4. اربط المستخدم بقاعدة البيانات
5. عدّل ملف `config.py` لاستخدام MySQL

## الخطوة 7: اختبار الموقع

1. افتح موقعك: `https://yourdomain.com`
2. اختبر جميع الصفحات
3. اختبر نموذج الحجز
4. اختبر لوحة التحكم: `https://yourdomain.com/admin.html`

## الخطوة 8: إعدادات إضافية

### إعداد SSL:
1. في cPanel، اذهب إلى "SSL/TLS"
2. فعّل SSL Certificate
3. اضبط إعادة التوجيه من HTTP إلى HTTPS

### إعداد البريد الإلكتروني:
1. في cPanel، اذهب إلى "Email Accounts"
2. أنشئ حساب بريد إلكتروني للموقع
3. اضبط إعدادات SMTP في `config.py`

## استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ 500 Internal Server Error**:
   - تحقق من ملف `.htaccess`
   - تحقق من صلاحيات الملفات
   - تحقق من سجلات الأخطاء في cPanel

2. **مشاكل في قاعدة البيانات**:
   - تأكد من تثبيت المتطلبات
   - تحقق من صلاحيات الكتابة
   - تحقق من إعدادات قاعدة البيانات

3. **مشاكل في الصور**:
   - تأكد من وجود مجلد `assets/images/`
   - تحقق من مسارات الصور في HTML

4. **مشاكل في Backend**:
   - تحقق من إعدادات Python
   - تحقق من متغيرات البيئة
   - تحقق من سجلات الأخطاء

## معلومات مهمة

### تكلفة Bluehost:
- Basic Plan: $2.95/شهر
- Plus Plan: $5.45/شهر
- Choice Plus: $5.45/شهر

### المميزات:
- ✅ دعم فني 24/7
- ✅ SSL مجاني
- ✅ نطاق مجاني
- ✅ بريد إلكتروني مجاني
- ✅ دعم Python
- ✅ قاعدة بيانات MySQL

### للدعم:
- الدعم الفني: [bluehost.com/support](https://bluehost.com/support)
- الدردشة المباشرة: متاحة 24/7
- الهاتف: متاح باللغة الإنجليزية

## ملاحظات مهمة

1. **النسخ الاحتياطي**: قم بعمل نسخة احتياطية دورية
2. **التحديثات**: حافظ على تحديث الملفات
3. **الأمان**: غيّر كلمات المرور بانتظام
4. **الأداء**: راقب استخدام الموارد

**الموقع جاهز للاستخدام على Bluehost! 🎉** 