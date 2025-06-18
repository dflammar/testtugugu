from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import sqlite3
import json
import os
from datetime import datetime
import csv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests

app = Flask(__name__)
CORS(app)

BOOKINGS_FILE = 'bookings.csv'

# Database setup
def init_db():
    conn = sqlite3.connect('panorama.db')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL,
            category TEXT,
            image TEXT,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            specialization TEXT,
            qualification TEXT,
            experience TEXT,
            image TEXT,
            bio TEXT,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            service_id INTEGER,
            doctor_id INTEGER,
            appointment_date TEXT NOT NULL,
            appointment_time TEXT NOT NULL,
            notes TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (service_id) REFERENCES services (id),
            FOREIGN KEY (doctor_id) REFERENCES doctors (id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            subject TEXT,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS blog (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author TEXT,
            image TEXT,
            is_published BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Insert sample data
    insert_sample_data(cursor)
    
    conn.commit()
    conn.close()

def insert_sample_data(cursor):
    # Sample services
    services = [
        ('أشعة رنين مغناطيسي', 'فحص الرنين المغناطيسي للدماغ والعمود الفقري والمفاصل', 800.0, 'أشعة متقدمة', 'assets/images/services/mri.jpg'),
        ('أشعة مقطعية', 'فحص الأشعة المقطعية للصدر والبطن والحوض', 600.0, 'أشعة متقدمة', 'assets/images/services/ct.jpg'),
        ('أشعة سينية', 'أشعة سينية للصدر والعظام والمفاصل', 150.0, 'أشعة أساسية', 'assets/images/services/xray.jpg'),
        ('أشعة إيكو', 'فحص القلب والأوعية الدموية', 300.0, 'أشعة أساسية', 'assets/images/services/echo.jpg'),
        ('أشعة بانوراما أسنان', 'أشعة بانوراما للأسنان والفكين', 200.0, 'أشعة أسنان', 'assets/images/services/panorama.jpg'),
        ('تحاليل طبية', 'تحاليل الدم والبول والبراز', 100.0, 'تحاليل', 'assets/images/services/lab.jpg')
    ]
    
    cursor.executemany('''
        INSERT OR IGNORE INTO services (name, description, price, category, image)
        VALUES (?, ?, ?, ?, ?)
    ''', services)
    
    # Sample doctors
    doctors = [
        ('د. أحمد محمد', 'أخصائي أشعة تشخيصية', 'دكتوراه في الأشعة التشخيصية', '15 سنة', 'assets/images/doctors/doctor1.jpg', 'خبرة 15 سنة في مجال الأشعة التشخيصية'),
        ('د. فاطمة علي', 'أخصائية أشعة نساء', 'ماجستير في الأشعة النسائية', '10 سنوات', 'assets/images/doctors/doctor2.jpg', 'متخصصة في أشعة النساء والتوليد'),
        ('د. محمد حسن', 'أخصائي أشعة عظام', 'دكتوراه في أشعة العظام', '12 سنة', 'assets/images/doctors/doctor3.jpg', 'متخصص في أشعة العظام والمفاصل')
    ]
    
    cursor.executemany('''
        INSERT OR IGNORE INTO doctors (name, specialization, qualification, experience, image, bio)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', doctors)
    
    # Sample blog posts
    blog_posts = [
        ('أهمية الفحص الدوري بالأشعة', 'الفحص الدوري بالأشعة يساعد في الكشف المبكر عن الأمراض وعلاجها قبل تفاقمها. ينصح بإجراء فحوصات دورية للأشخاص فوق سن الأربعين.', 'د. أحمد محمد', 'assets/images/blog/blog1.jpg'),
        ('متى تحتاج لأشعة رنين مغناطيسي؟', 'الرنين المغناطيسي ضروري في حالات معينة مثل فحص الدماغ والعمود الفقري والمفاصل. يساعد في تشخيص العديد من الأمراض بدقة عالية.', 'د. فاطمة علي', 'assets/images/blog/blog2.jpg'),
        ('نصائح قبل إجراء الأشعة', 'هناك بعض النصائح المهمة التي يجب اتباعها قبل إجراء الأشعة مثل الصيام لفترة معينة وتجنب بعض الأدوية.', 'د. محمد حسن', 'assets/images/blog/blog3.jpg')
    ]
    
    cursor.executemany('''
        INSERT OR IGNORE INTO blog (title, content, author, image)
        VALUES (?, ?, ?, ?)
    ''', blog_posts)

# API Routes
@app.route('/api/services')
def get_services():
    conn = sqlite3.connect('panorama.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM services WHERE is_active = 1')
    services = cursor.fetchall()
    conn.close()
    
    services_list = []
    for service in services:
        services_list.append({
            'id': service[0],
            'name': service[1],
            'description': service[2],
            'price': service[3],
            'category': service[4],
            'image': service[5]
        })
    
    return jsonify(services_list)

@app.route('/api/doctors')
def get_doctors():
    conn = sqlite3.connect('panorama.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM doctors WHERE is_active = 1')
    doctors = cursor.fetchall()
    conn.close()
    
    doctors_list = []
    for doctor in doctors:
        doctors_list.append({
            'id': doctor[0],
            'name': doctor[1],
            'specialization': doctor[2],
            'qualification': doctor[3],
            'experience': doctor[4],
            'image': doctor[5],
            'bio': doctor[6]
        })
    
    return jsonify(doctors_list)

@app.route('/api/blog')
def get_blog():
    conn = sqlite3.connect('panorama.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM blog WHERE is_published = 1 ORDER BY created_at DESC')
    posts = cursor.fetchall()
    conn.close()
    
    posts_list = []
    for post in posts:
        posts_list.append({
            'id': post[0],
            'title': post[1],
            'content': post[2],
            'author': post[3],
            'image': post[4],
            'created_at': post[6]
        })
    
    return jsonify(posts_list)

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.json
    
    conn = sqlite3.connect('panorama.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO bookings (name, phone, service_id, doctor_id, appointment_date, appointment_time, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['name'],
        data['phone'],
        data.get('service_id'),
        data.get('doctor_id'),
        data['appointment_date'],
        data['appointment_time'],
        data.get('notes', '')
    ))
    
    booking_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    # Save to CSV for backup
    save_booking_to_csv(data)
    
    return jsonify({'success': True, 'booking_id': booking_id})

@app.route('/api/contact', methods=['POST'])
def create_contact():
    data = request.json
    
    conn = sqlite3.connect('panorama.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO contacts (name, email, phone, subject, message)
        VALUES (?, ?, ?, ?, ?)
    ''', (
        data['name'],
        data['email'],
        data.get('phone', ''),
        data.get('subject', ''),
        data['message']
    ))
    
    contact_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'contact_id': contact_id})

@app.route('/api/bookings')
def get_bookings():
    conn = sqlite3.connect('panorama.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT b.*, s.name as service_name, d.name as doctor_name 
        FROM bookings b 
        LEFT JOIN services s ON b.service_id = s.id 
        LEFT JOIN doctors d ON b.doctor_id = d.id 
        ORDER BY b.created_at DESC
    ''')
    bookings = cursor.fetchall()
    conn.close()
    
    bookings_list = []
    for booking in bookings:
        bookings_list.append({
            'id': booking[0],
            'name': booking[1],
            'phone': booking[2],
            'service_name': booking[8],
            'doctor_name': booking[9],
            'appointment_date': booking[5],
            'appointment_time': booking[6],
            'notes': booking[7],
            'status': booking[8],
            'created_at': booking[9]
        })
    
    return jsonify(bookings_list)

@app.route('/api/contacts')
def get_contacts():
    conn = sqlite3.connect('panorama.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM contacts ORDER BY created_at DESC')
    contacts = cursor.fetchall()
    conn.close()
    
    contacts_list = []
    for contact in contacts:
        contacts_list.append({
            'id': contact[0],
            'name': contact[1],
            'email': contact[2],
            'phone': contact[3],
            'subject': contact[4],
            'message': contact[5],
            'is_read': contact[6],
            'created_at': contact[7]
        })
    
    return jsonify(contacts_list)

def save_booking_to_csv(data):
    csv_file = 'bookings_backup.csv'
    file_exists = os.path.isfile(csv_file)
    
    with open(csv_file, 'a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        
        if not file_exists:
            writer.writerow(['Name', 'Phone', 'Service ID', 'Doctor ID', 'Date', 'Time', 'Notes', 'Created At'])
        
        writer.writerow([
            data['name'],
            data['phone'],
            data.get('service_id', ''),
            data.get('doctor_id', ''),
            data['appointment_date'],
            data['appointment_time'],
            data.get('notes', ''),
            datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ])

# Admin routes
@app.route('/admin')
def admin_panel():
    return render_template('admin/index.html')

@app.route('/admin/bookings')
def admin_bookings():
    return render_template('admin/bookings.html')

@app.route('/admin/contacts')
def admin_contacts():
    return render_template('admin/contacts.html')

@app.route('/admin/services')
def admin_services():
    return render_template('admin/services.html')

@app.route('/admin/doctors')
def admin_doctors():
    return render_template('admin/doctors.html')

@app.route('/admin/blog')
def admin_blog():
    return render_template('admin/blog.html')

# Serve static files
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000) 