# مركز بانوراما للأشعة - النسخة المبسطة

هذا المشروع هو نسخة مبسطة من موقع مركز بانوراما للأشعة، تم تحويله من Django إلى Frontend Static مع Backend بسيط باستخدام Flask.

## المميزات

### Frontend (HTML/CSS/JS)
- ✅ تصميم متجاوب (Responsive Design)
- ✅ واجهة مستخدم عربية احترافية
- ✅ صفحات متعددة (الرئيسية، الخدمات، الأطباء، المدونة، التواصل، الحجز)
- ✅ نظام بحث وتصفية للخدمات
- ✅ نموذج حجز مواعيد تفاعلي
- ✅ نموذج تواصل مع المركز

### Backend (Flask)
- ✅ API بسيط لمعالجة البيانات
- ✅ قاعدة بيانات SQLite
- ✅ معالجة نماذج الحجز والتواصل
- ✅ حفظ البيانات في CSV كنسخة احتياطية
- ✅ إمكانية إرسال إشعارات عبر البريد الإلكتروني أو تيليجرام

### لوحة التحكم (Admin Panel)
- ✅ لوحة تحكم باللغة العربية
- ✅ إدارة الحجوزات (عرض، تحديث، حذف)
- ✅ إدارة رسائل التواصل
- ✅ إدارة الخدمات والأطباء والمقالات
- ✅ إحصائيات الموقع
- ✅ تصدير البيانات

## هيكل المشروع

```
static_site/
├── index.html              # الصفحة الرئيسية
├── about.html              # صفحة من نحن
├── services.html           # صفحة الخدمات
├── team.html               # صفحة الأطباء
├── blog.html               # صفحة المدونة
├── contact.html            # صفحة التواصل
├── booking.html            # صفحة حجز موعد
├── admin.html              # لوحة التحكم
├── assets/
│   ├── css/
│   │   ├── custom.css      # التصميم المخصص
│   │   └── andalusia.css   # تصميم أندلسي
│   ├── js/
│   │   ├── custom.js       # JavaScript الرئيسي
│   │   └── admin.js        # JavaScript لوحة التحكم
│   └── images/
│       ├── equipment/      # صور الأجهزة
│       ├── services/       # صور الخدمات
│       ├── doctors/        # صور الأطباء
│       └── blog/           # صور المدونة
└── backend/
    ├── app.py              # تطبيق Flask
    ├── config.py           # إعدادات التطبيق
    ├── requirements.txt    # متطلبات Python
    └── panorama.db         # قاعدة البيانات
```

## متطلبات التشغيل

### للـ Frontend
- متصفح ويب حديث
- خادم ويب بسيط (مثل Python HTTP Server)

### للـ Backend
- Python 3.7+
- Flask
- Flask-CORS

## كيفية التشغيل

### 1. تشغيل Frontend فقط (بدون Backend)

```bash
# في مجلد static_site
python -m http.server 8080
```

ثم افتح المتصفح على: `http://localhost:8080`

### 2. تشغيل Backend مع Frontend

```bash
# في مجلد static_site/backend
pip install -r requirements.txt
python app.py
```

ثم افتح المتصفح على: `http://localhost:5000`

### 3. تشغيل لوحة التحكم

بعد تشغيل Backend، افتح: `http://localhost:5000/admin.html`

## إعدادات إضافية

### إعداد البريد الإلكتروني (اختياري)

أضف متغيرات البيئة التالية:

```bash
export MAIL_SERVER=smtp.gmail.com
export MAIL_PORT=587
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
```

### إعداد تيليجرام (اختياري)

أضف متغيرات البيئة التالية:

```bash
export TELEGRAM_BOT_TOKEN=your-bot-token
export TELEGRAM_CHAT_ID=your-chat-id
```

## النشر على الاستضافة

### Render
1. ارفع الملفات إلى GitHub
2. اربط المستودع بـ Render
3. اختر Python Environment
4. اضبط Build Command: `pip install -r backend/requirements.txt`
5. اضبط Start Command: `cd backend && python app.py`

### Vercel
1. ارفع الملفات إلى GitHub
2. اربط المستودع بـ Vercel
3. اختر Static Site
4. اضبط Build Command: `echo "Static site"`
5. اضبط Output Directory: `.`

### Hostinger
1. ارفع ملفات Frontend إلى مجلد public_html
2. ارفع ملفات Backend إلى مجلد منفصل
3. اضبط إعدادات Python في لوحة التحكم

## الملفات المهمة

### Frontend
- `index.html` - الصفحة الرئيسية
- `assets/css/custom.css` - التصميم المخصص
- `assets/js/custom.js` - الوظائف التفاعلية
- `admin.html` - لوحة التحكم
- `assets/js/admin.js` - وظائف لوحة التحكم

### Backend
- `backend/app.py` - التطبيق الرئيسي
- `backend/config.py` - الإعدادات
- `backend/requirements.txt` - المتطلبات

## قاعدة البيانات

يتم إنشاء قاعدة البيانات تلقائياً عند تشغيل التطبيق لأول مرة. تحتوي على الجداول التالية:

- `services` - الخدمات
- `doctors` - الأطباء
- `bookings` - الحجوزات
- `contacts` - رسائل التواصل
- `blog` - مقالات المدونة

## النسخ الاحتياطي

يتم حفظ الحجوزات تلقائياً في ملف `bookings_backup.csv` كنسخة احتياطية.

## الدعم والمساعدة

لأي استفسارات أو مشاكل، يرجى التواصل عبر:
- البريد الإلكتروني: info@panorama.com
- الهاتف: 040-1234567

## الترخيص

هذا المشروع مملوك لمركز بانوراما للأشعة - قطور، الغربية، مصر. #   t e s t t u g u g u  
 #   m y 5 6  
 