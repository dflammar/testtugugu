#!/bin/bash

echo "========================================"
echo "   مركز بانوراما للأشعة - النسخة المبسطة"
echo "========================================"
echo

echo "اختر نوع التشغيل:"
echo "1. تشغيل Frontend فقط (بدون Backend)"
echo "2. تشغيل Backend مع Frontend"
echo "3. تشغيل لوحة التحكم"
echo

read -p "أدخل رقم الخيار (1-3): " choice

case $choice in
    1)
        echo
        echo "تشغيل Frontend فقط..."
        echo "افتح المتصفح على: http://localhost:8080"
        echo
        python3 -m http.server 8080
        ;;
    2)
        echo
        echo "تشغيل Backend مع Frontend..."
        echo "افتح المتصفح على: http://localhost:5000"
        echo
        cd backend
        python3 app.py
        ;;
    3)
        echo
        echo "تشغيل لوحة التحكم..."
        echo "افتح المتصفح على: http://localhost:5000/admin.html"
        echo
        cd backend
        python3 app.py
        ;;
    *)
        echo
        echo "خيار غير صحيح!"
        read -p "اضغط Enter للخروج..."
        ;;
esac 