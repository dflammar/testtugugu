#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
ملف الوظائف المساعدة
"""

import re
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

def validate_email(email: str) -> bool:
    """التحقق من صحة البريد الإلكتروني"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    """التحقق من صحة رقم الهاتف المصري"""
    # إزالة المسافات والرموز
    phone = re.sub(r'[\s\-\(\)]', '', phone)
    
    # التحقق من التنسيق المصري
    patterns = [
        r'^01[0125][0-9]{8}$',  # 01xxxxxxxxx
        r'^\+201[0125][0-9]{8}$',  # +201xxxxxxxxx
        r'^201[0125][0-9]{8}$',  # 201xxxxxxxxx
    ]
    
    return any(re.match(pattern, phone) for pattern in patterns)

def format_phone(phone: str) -> str:
    """تنسيق رقم الهاتف"""
    phone = re.sub(r'[\s\-\(\)]', '', phone)
    
    if phone.startswith('+20'):
        phone = phone[3:]
    elif phone.startswith('20'):
        phone = phone[2:]
    
    if phone.startswith('0'):
        phone = phone[1:]
    
    return f"+20{phone}"

def validate_date(date_str: str) -> bool:
    """التحقق من صحة التاريخ"""
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d')
        return date >= datetime.now().date()
    except ValueError:
        return False

def validate_time(time_str: str) -> bool:
    """التحقق من صحة الوقت"""
    try:
        datetime.strptime(time_str, '%H:%M')
        return True
    except ValueError:
        return False

def is_working_hours(date: str, time: str) -> bool:
    """التحقق من ساعات العمل"""
    try:
        appointment_date = datetime.strptime(date, '%Y-%m-%d')
        appointment_time = datetime.strptime(time, '%H:%M')
        
        # التحقق من اليوم
        weekday = appointment_date.strftime('%A').lower()
        if weekday == 'friday' or weekday == 'saturday':
            # الجمعة والسبت: 9:00 - 23:00
            start_time = datetime.strptime('09:00', '%H:%M')
            end_time = datetime.strptime('23:00', '%H:%M')
        else:
            # باقي الأيام: 8:00 - 22:00
            start_time = datetime.strptime('08:00', '%H:%M')
            end_time = datetime.strptime('22:00', '%H:%M')
        
        return start_time <= appointment_time <= end_time
    except ValueError:
        return False

def is_available_slot(date: str, time: str, db_connection) -> bool:
    """التحقق من توفر الموعد"""
    try:
        cursor = db_connection.cursor()
        cursor.execute('''
            SELECT COUNT(*) FROM bookings 
            WHERE appointment_date = ? AND appointment_time = ? AND status != 'cancelled'
        ''', (date, time))
        
        count = cursor.fetchone()[0]
        return count < 3  # حد أقصى 3 حجوزات في نفس الوقت
    except Exception:
        return False

def format_currency(amount: float) -> str:
    """تنسيق العملة"""
    return f"{amount:,.2f} ج.م"

def format_date_arabic(date_str: str) -> str:
    """تنسيق التاريخ باللغة العربية"""
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d')
        months = {
            1: 'يناير', 2: 'فبراير', 3: 'مارس', 4: 'أبريل',
            5: 'مايو', 6: 'يونيو', 7: 'يوليو', 8: 'أغسطس',
            9: 'سبتمبر', 10: 'أكتوبر', 11: 'نوفمبر', 12: 'ديسمبر'
        }
        return f"{date.day} {months[date.month]} {date.year}"
    except ValueError:
        return date_str

def format_time_arabic(time_str: str) -> str:
    """تنسيق الوقت باللغة العربية"""
    try:
        time = datetime.strptime(time_str, '%H:%M')
        hour = time.hour
        minute = time.minute
        
        if hour < 12:
            period = 'صباحاً'
        else:
            period = 'مساءً'
            if hour > 12:
                hour -= 12
        
        return f"{hour}:{minute:02d} {period}"
    except ValueError:
        return time_str

def generate_booking_number() -> str:
    """إنشاء رقم حجز فريد"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    return f"PAN{timestamp}"

def sanitize_input(text: str) -> str:
    """تنظيف النص المدخل"""
    if not text:
        return ""
    
    # إزالة الأحرف الخطرة
    text = re.sub(r'[<>"\']', '', text)
    return text.strip()

def validate_booking_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """التحقق من صحة بيانات الحجز"""
    errors = []
    
    # التحقق من الحقول المطلوبة
    required_fields = ['name', 'phone', 'service', 'appointment_date', 'appointment_time']
    for field in required_fields:
        if not data.get(field):
            errors.append(f'الحقل {field} مطلوب')
    
    # التحقق من صحة البيانات
    if data.get('name'):
        data['name'] = sanitize_input(data['name'])
        if len(data['name']) < 2:
            errors.append('الاسم يجب أن يكون أكثر من حرفين')
    
    if data.get('phone'):
        if not validate_phone(data['phone']):
            errors.append('رقم الهاتف غير صحيح')
        else:
            data['phone'] = format_phone(data['phone'])
    
    if data.get('email'):
        if not validate_email(data['email']):
            errors.append('البريد الإلكتروني غير صحيح')
    
    if data.get('appointment_date'):
        if not validate_date(data['appointment_date']):
            errors.append('التاريخ غير صحيح')
    
    if data.get('appointment_time'):
        if not validate_time(data['appointment_time']):
            errors.append('الوقت غير صحيح')
    
    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'data': data
    }

def validate_contact_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """التحقق من صحة بيانات التواصل"""
    errors = []
    
    # التحقق من الحقول المطلوبة
    required_fields = ['name', 'email', 'subject', 'message']
    for field in required_fields:
        if not data.get(field):
            errors.append(f'الحقل {field} مطلوب')
    
    # التحقق من صحة البيانات
    if data.get('name'):
        data['name'] = sanitize_input(data['name'])
        if len(data['name']) < 2:
            errors.append('الاسم يجب أن يكون أكثر من حرفين')
    
    if data.get('email'):
        if not validate_email(data['email']):
            errors.append('البريد الإلكتروني غير صحيح')
    
    if data.get('subject'):
        data['subject'] = sanitize_input(data['subject'])
        if len(data['subject']) < 3:
            errors.append('الموضوع يجب أن يكون أكثر من 3 أحرف')
    
    if data.get('message'):
        data['message'] = sanitize_input(data['message'])
        if len(data['message']) < 10:
            errors.append('الرسالة يجب أن تكون أكثر من 10 أحرف')
    
    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'data': data
    }

def get_statistics(db_connection) -> Dict[str, Any]:
    """الحصول على إحصائيات الموقع"""
    try:
        cursor = db_connection.cursor()
        
        # إحصائيات الحجوزات
        cursor.execute('SELECT COUNT(*) FROM bookings')
        total_bookings = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM bookings WHERE status = "confirmed"')
        confirmed_bookings = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM bookings WHERE status = "pending"')
        pending_bookings = cursor.fetchone()[0]
        
        # إحصائيات التواصل
        cursor.execute('SELECT COUNT(*) FROM contacts')
        total_contacts = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM contacts WHERE is_read = 0')
        unread_contacts = cursor.fetchone()[0]
        
        # إحصائيات الأطباء والخدمات
        cursor.execute('SELECT COUNT(*) FROM doctors WHERE is_active = 1')
        active_doctors = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM services WHERE is_active = 1')
        active_services = cursor.fetchone()[0]
        
        return {
            'total_bookings': total_bookings,
            'confirmed_bookings': confirmed_bookings,
            'pending_bookings': pending_bookings,
            'total_contacts': total_contacts,
            'unread_contacts': unread_contacts,
            'active_doctors': active_doctors,
            'active_services': active_services
        }
    except Exception as e:
        print(f"Error getting statistics: {e}")
        return {}

def export_to_csv(data: List[Dict[str, Any]], filename: str) -> bool:
    """تصدير البيانات إلى ملف CSV"""
    try:
        import csv
        
        if not data:
            return False
        
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = data[0].keys()
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            for row in data:
                writer.writerow(row)
        
        return True
    except Exception as e:
        print(f"Error exporting to CSV: {e}")
        return False

def log_activity(activity: str, user: str = 'system', details: Dict[str, Any] = None):
    """تسجيل الأنشطة"""
    try:
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'activity': activity,
            'user': user,
            'details': details or {}
        }
        
        with open('activity.log', 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')
    except Exception as e:
        print(f"Error logging activity: {e}") 