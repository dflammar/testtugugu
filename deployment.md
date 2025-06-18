# دليل النشر - مركز بانوراما للأشعة

## النشر على Vercel (مجاني)

1. ارفع الملفات إلى GitHub
2. اربط المستودع بـ Vercel
3. اختر Static Site
4. اضبط Build Command: `echo "Static site"`
5. اضبط Output Directory: `.`
6. انقر على Deploy

## النشر على Render (مجاني)

1. ارفع الملفات إلى GitHub
2. اربط المستودع بـ Render
3. اختر Python Environment
4. اضبط Build Command: `pip install -r backend/requirements.txt`
5. اضبط Start Command: `cd backend && python app.py`
6. انقر على Create Web Service

## النشر على Hostinger

### للـ Frontend فقط:
1. ارفع ملفات Frontend إلى مجلد public_html
2. الموقع سيعمل مباشرة

### للـ Backend مع Frontend:
1. ارفع ملفات Frontend إلى مجلد public_html
2. ارفع ملفات Backend إلى مجلد منفصل
3. اضبط إعدادات Python في لوحة التحكم
4. اضبط Domain للـ Backend

## النشر على Netlify (مجاني)

1. ارفع الملفات إلى GitHub
2. اربط المستودع بـ Netlify
3. اختر Static Site
4. اضبط Build Command: `echo "Static site"`
5. اضبط Publish Directory: `.`
6. انقر على Deploy site

## النشر على GitHub Pages (مجاني)

1. ارفع الملفات إلى GitHub
2. اذهب إلى Settings > Pages
3. اختر Source: Deploy from a branch
4. اختر Branch: main
5. اضبط Folder: / (root)
6. انقر على Save

## إعدادات مهمة

### متغيرات البيئة (للـ Backend):
```bash
SECRET_KEY=your-secret-key-here
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

### إعدادات قاعدة البيانات:
- قاعدة البيانات SQLite ستُنشأ تلقائياً
- للاستخدام في الإنتاج، يُنصح باستخدام PostgreSQL أو MySQL

### إعدادات الأمان:
- غيّر SECRET_KEY
- فعّل HTTPS
- اضبط CORS settings
- استخدم Environment Variables

## استكشاف الأخطاء

### مشاكل شائعة:
1. **خطأ 404**: تأكد من صحة مسارات الملفات
2. **خطأ في قاعدة البيانات**: تأكد من صلاحيات الكتابة
3. **مشاكل في CORS**: اضبط إعدادات CORS في Backend
4. **مشاكل في الصور**: تأكد من وجود مجلد assets/images

### للدعم:
- البريد الإلكتروني: info@panorama.com
- الهاتف: 040-1234567 