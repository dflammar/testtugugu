@echo off
echo ========================================
echo    مركز بانوراما للأشعة - النسخة المبسطة
echo ========================================
echo.

echo اختر نوع التشغيل:
echo 1. تشغيل Frontend فقط (بدون Backend)
echo 2. تشغيل Backend مع Frontend
echo 3. تشغيل لوحة التحكم
echo.

set /p choice="أدخل رقم الخيار (1-3): "

if "%choice%"=="1" (
    echo.
    echo تشغيل Frontend فقط...
    echo افتح المتصفح على: http://localhost:8080
    echo.
    python -m http.server 8080
) else if "%choice%"=="2" (
    echo.
    echo تشغيل Backend مع Frontend...
    echo افتح المتصفح على: http://localhost:5000
    echo.
    cd backend
    python app.py
) else if "%choice%"=="3" (
    echo.
    echo تشغيل لوحة التحكم...
    echo افتح المتصفح على: http://localhost:5000/admin.html
    echo.
    cd backend
    python app.py
) else (
    echo.
    echo خيار غير صحيح!
    pause
) 