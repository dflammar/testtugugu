// Admin Panel JavaScript

let currentSection = 'dashboard';

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    loadRecentBookings();
});

// Navigation functions
function showDashboard() {
    hideAllSections();
    document.getElementById('dashboard-content').style.display = 'block';
    currentSection = 'dashboard';
    loadDashboardStats();
    loadRecentBookings();
    updateActiveNav();
}

function showBookings() {
    hideAllSections();
    document.getElementById('bookings-content').style.display = 'block';
    currentSection = 'bookings';
    loadBookings();
    updateActiveNav();
}

function showContacts() {
    hideAllSections();
    document.getElementById('contacts-content').style.display = 'block';
    currentSection = 'contacts';
    loadContacts();
    updateActiveNav();
}

function showServices() {
    hideAllSections();
    document.getElementById('services-content').style.display = 'block';
    currentSection = 'services';
    loadServices();
    updateActiveNav();
}

function showDoctors() {
    hideAllSections();
    document.getElementById('doctors-content').style.display = 'block';
    currentSection = 'doctors';
    loadDoctors();
    updateActiveNav();
}

function showBlog() {
    hideAllSections();
    document.getElementById('blog-content').style.display = 'block';
    currentSection = 'blog';
    loadBlog();
    updateActiveNav();
}

function hideAllSections() {
    const sections = ['dashboard-content', 'bookings-content', 'contacts-content', 'services-content', 'doctors-content', 'blog-content'];
    sections.forEach(section => {
        document.getElementById(section).style.display = 'none';
    });
}

function updateActiveNav() {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current nav link
    const currentNavLink = document.querySelector(`[onclick="show${currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}()"]`);
    if (currentNavLink) {
        currentNavLink.classList.add('active');
    }
}

// Dashboard functions
async function loadDashboardStats() {
    try {
        const [bookingsResponse, contactsResponse, servicesResponse] = await Promise.all([
            fetch('/api/bookings'),
            fetch('/api/contacts'),
            fetch('/api/services')
        ]);
        
        const bookings = await bookingsResponse.json();
        const contacts = await contactsResponse.json();
        const services = await servicesResponse.json();
        
        // Update statistics
        document.getElementById('total-bookings').textContent = bookings.length;
        document.getElementById('total-contacts').textContent = contacts.length;
        document.getElementById('total-services').textContent = services.length;
        
        // Calculate new bookings (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const newBookings = bookings.filter(booking => new Date(booking.created_at) > oneWeekAgo);
        document.getElementById('new-bookings').textContent = newBookings.length;
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        showAlert('حدث خطأ في تحميل الإحصائيات', 'danger');
    }
}

async function loadRecentBookings() {
    try {
        const response = await fetch('/api/bookings');
        const bookings = await response.json();
        
        const recentBookings = bookings.slice(0, 5); // Show only 5 recent bookings
        
        const tableBody = document.getElementById('recent-bookings-table');
        tableBody.innerHTML = recentBookings.map(booking => `
            <tr>
                <td>${booking.name}</td>
                <td>${booking.phone}</td>
                <td>${booking.service_name || 'غير محدد'}</td>
                <td>${formatDate(booking.appointment_date)}</td>
                <td>
                    <span class="badge bg-${getStatusBadgeColor(booking.status)}">
                        ${getStatusText(booking.status)}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewBooking(${booking.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading recent bookings:', error);
    }
}

// Bookings functions
async function loadBookings() {
    try {
        const response = await fetch('/api/bookings');
        const bookings = await response.json();
        
        const tableBody = document.getElementById('bookings-table');
        tableBody.innerHTML = bookings.map(booking => `
            <tr>
                <td>${booking.name}</td>
                <td>${booking.phone}</td>
                <td>${booking.service_name || 'غير محدد'}</td>
                <td>${booking.doctor_name || 'غير محدد'}</td>
                <td>${booking.appointment_date}</td>
                <td>${booking.appointment_time}</td>
                <td>
                    <select class="form-select form-select-sm" onchange="updateBookingStatus(${booking.id}, this.value)">
                        <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>في الانتظار</option>
                        <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>مؤكد</option>
                        <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>ملغي</option>
                        <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>مكتمل</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewBooking(${booking.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteBooking(${booking.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading bookings:', error);
        showAlert('حدث خطأ في تحميل الحجوزات', 'danger');
    }
}

async function updateBookingStatus(bookingId, status) {
    try {
        const response = await fetch(`/api/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            showAlert('تم تحديث حالة الحجز بنجاح', 'success');
        } else {
            showAlert('حدث خطأ في تحديث حالة الحجز', 'danger');
        }
    } catch (error) {
        console.error('Error updating booking status:', error);
        showAlert('حدث خطأ في تحديث حالة الحجز', 'danger');
    }
}

async function deleteBooking(bookingId) {
    if (confirm('هل أنت متأكد من حذف هذا الحجز؟')) {
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showAlert('تم حذف الحجز بنجاح', 'success');
                loadBookings();
            } else {
                showAlert('حدث خطأ في حذف الحجز', 'danger');
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
            showAlert('حدث خطأ في حذف الحجز', 'danger');
        }
    }
}

// Contacts functions
async function loadContacts() {
    try {
        const response = await fetch('/api/contacts');
        const contacts = await response.json();
        
        const tableBody = document.getElementById('contacts-table');
        tableBody.innerHTML = contacts.map(contact => `
            <tr class="${contact.is_read ? '' : 'table-warning'}">
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.phone || 'غير محدد'}</td>
                <td>${contact.subject || 'غير محدد'}</td>
                <td>${formatDate(contact.created_at)}</td>
                <td>
                    <span class="badge bg-${contact.is_read ? 'success' : 'warning'}">
                        ${contact.is_read ? 'مقروءة' : 'جديدة'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewContact(${contact.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteContact(${contact.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading contacts:', error);
        showAlert('حدث خطأ في تحميل رسائل التواصل', 'danger');
    }
}

async function deleteContact(contactId) {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
        try {
            const response = await fetch(`/api/contacts/${contactId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showAlert('تم حذف الرسالة بنجاح', 'success');
                loadContacts();
            } else {
                showAlert('حدث خطأ في حذف الرسالة', 'danger');
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            showAlert('حدث خطأ في حذف الرسالة', 'danger');
        }
    }
}

// Services functions
async function loadServices() {
    try {
        const response = await fetch('/api/services');
        const services = await response.json();
        
        const tableBody = document.getElementById('services-table');
        tableBody.innerHTML = services.map(service => `
            <tr>
                <td>${service.name}</td>
                <td>${service.description.substring(0, 50)}...</td>
                <td>${service.price} جنيه</td>
                <td>${service.category}</td>
                <td>
                    <span class="badge bg-success">متاح</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editService(${service.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteService(${service.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading services:', error);
        showAlert('حدث خطأ في تحميل الخدمات', 'danger');
    }
}

// Doctors functions
async function loadDoctors() {
    try {
        const response = await fetch('/api/doctors');
        const doctors = await response.json();
        
        const tableBody = document.getElementById('doctors-table');
        tableBody.innerHTML = doctors.map(doctor => `
            <tr>
                <td>${doctor.name}</td>
                <td>${doctor.specialization}</td>
                <td>${doctor.qualification}</td>
                <td>${doctor.experience}</td>
                <td>
                    <span class="badge bg-success">متاح</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editDoctor(${doctor.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteDoctor(${doctor.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading doctors:', error);
        showAlert('حدث خطأ في تحميل الأطباء', 'danger');
    }
}

// Blog functions
async function loadBlog() {
    try {
        const response = await fetch('/api/blog');
        const posts = await response.json();
        
        const tableBody = document.getElementById('blog-table');
        tableBody.innerHTML = posts.map(post => `
            <tr>
                <td>${post.title}</td>
                <td>${post.author}</td>
                <td>${formatDate(post.created_at)}</td>
                <td>
                    <span class="badge bg-success">منشور</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editBlog(${post.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteBlog(${post.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        showAlert('حدث خطأ في تحميل المقالات', 'danger');
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getStatusBadgeColor(status) {
    switch (status) {
        case 'pending': return 'warning';
        case 'confirmed': return 'success';
        case 'cancelled': return 'danger';
        case 'completed': return 'info';
        default: return 'secondary';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'pending': return 'في الانتظار';
        case 'confirmed': return 'مؤكد';
        case 'cancelled': return 'ملغي';
        case 'completed': return 'مكتمل';
        default: return 'غير محدد';
    }
}

function showAlert(message, type = 'info') {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertContainer.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertContainer);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertContainer.parentNode) {
            alertContainer.remove();
        }
    }, 5000);
}

function refreshStats() {
    loadDashboardStats();
    showAlert('تم تحديث الإحصائيات', 'success');
}

function exportBookings() {
    // Create CSV content
    const csvContent = "data:text/csv;charset=utf-8," + 
        "الاسم,الهاتف,الخدمة,الطبيب,التاريخ,الوقت,الحالة\n" +
        // Add booking data here
        "";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('تم تصدير الحجوزات بنجاح', 'success');
}

// Modal functions (to be implemented)
function showAddServiceModal() {
    showAlert('سيتم إضافة هذه الميزة قريباً', 'info');
}

function showAddDoctorModal() {
    showAlert('سيتم إضافة هذه الميزة قريباً', 'info');
}

function showAddBlogModal() {
    showAlert('سيتم إضافة هذه الميزة قريباً', 'info');
}

function viewBooking(id) {
    showAlert(`عرض تفاصيل الحجز رقم ${id}`, 'info');
}

function viewContact(id) {
    showAlert(`عرض تفاصيل الرسالة رقم ${id}`, 'info');
}

function editService(id) {
    showAlert(`تعديل الخدمة رقم ${id}`, 'info');
}

function editDoctor(id) {
    showAlert(`تعديل الطبيب رقم ${id}`, 'info');
}

function editBlog(id) {
    showAlert(`تعديل المقال رقم ${id}`, 'info');
}

function deleteService(id) {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
        showAlert('تم حذف الخدمة بنجاح', 'success');
    }
}

function deleteDoctor(id) {
    if (confirm('هل أنت متأكد من حذف هذا الطبيب؟')) {
        showAlert('تم حذف الطبيب بنجاح', 'success');
    }
}

function deleteBlog(id) {
    if (confirm('هل أنت متأكد من حذف هذا المقال؟')) {
        showAlert('تم حذف المقال بنجاح', 'success');
    }
} 