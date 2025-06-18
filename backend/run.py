#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
ملف تشغيل الباك إند
"""

from app import app, init_db
from sample_data import init_sample_data
import os

if __name__ == '__main__':
    # إنشاء قاعدة البيانات
    init_db()
    
    # إضافة بيانات تجريبية (اختياري)
    if not os.path.exists('panorama.db') or os.path.getsize('panorama.db') == 0:
        print("إضافة بيانات تجريبية...")
        init_sample_data()
    
    print("تشغيل الباك إند...")
    print("الرابط: http://localhost:5000")
    print("لوحة التحكم: http://localhost:5000/admin")
    print("اضغط Ctrl+C لإيقاف الخادم")
    
    # تشغيل التطبيق
    app.run(debug=True, host='0.0.0.0', port=5000) 