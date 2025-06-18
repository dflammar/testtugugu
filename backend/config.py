#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
ملف إعدادات التطبيق
"""

import os

class Config:
    """إعدادات التطبيق الأساسية"""
    
    # إعدادات قاعدة البيانات
    DATABASE = 'panorama.db'
    
    # إعدادات البريد الإلكتروني
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    
    # إعدادات التليجرام
    TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
    TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID')
    
    # إعدادات التطبيق
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
    
    # إعدادات الملفات
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    
    # إعدادات الأمان
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # إعدادات الإشعارات
    ENABLE_EMAIL_NOTIFICATIONS = os.environ.get('ENABLE_EMAIL_NOTIFICATIONS', 'True').lower() == 'true'
    ENABLE_TELEGRAM_NOTIFICATIONS = os.environ.get('ENABLE_TELEGRAM_NOTIFICATIONS', 'True').lower() == 'true'
    
    # إعدادات الحجوزات
    MAX_BOOKINGS_PER_DAY = int(os.environ.get('MAX_BOOKINGS_PER_DAY', 50))
    BOOKING_TIME_SLOTS = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
        '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
    ]
    
    # إعدادات العمل
    WORKING_HOURS = {
        'sunday': {'start': '08:00', 'end': '22:00'},
        'monday': {'start': '08:00', 'end': '22:00'},
        'tuesday': {'start': '08:00', 'end': '22:00'},
        'wednesday': {'start': '08:00', 'end': '22:00'},
        'thursday': {'start': '08:00', 'end': '22:00'},
        'friday': {'start': '09:00', 'end': '23:00'},
        'saturday': {'start': '09:00', 'end': '23:00'}
    }
    
    # إعدادات الموقع
    SITE_NAME = 'مركز بانوراما للأشعة'
    SITE_DESCRIPTION = 'مركز متخصص في جميع أنواع الأشعة التشخيصية والتحاليل الطبية'
    SITE_ADDRESS = 'قطور، الغربية، مصر'
    SITE_PHONE = '040-1234567'
    SITE_MOBILE = '01234567890'
    SITE_EMAIL = 'info@panorama.com'
    
    # روابط التواصل الاجتماعي
    SOCIAL_LINKS = {
        'facebook': 'https://facebook.com/panorama',
        'instagram': 'https://instagram.com/panorama',
        'whatsapp': 'https://wa.me/201234567890',
        'youtube': 'https://youtube.com/panorama'
    }

class DevelopmentConfig(Config):
    """إعدادات التطوير"""
    DEBUG = True
    DATABASE = 'panorama_dev.db'

class ProductionConfig(Config):
    """إعدادات الإنتاج"""
    DEBUG = False
    DATABASE = 'panorama_prod.db'

class TestingConfig(Config):
    """إعدادات الاختبار"""
    TESTING = True
    DATABASE = 'panorama_test.db'

# اختيار الإعدادات حسب البيئة
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """الحصول على الإعدادات المناسبة"""
    env = os.environ.get('FLASK_ENV', 'development')
    return config.get(env, config['default']) 