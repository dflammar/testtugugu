// Admin Panel JavaScript Functions

// Global variables
let currentSection = 'dashboard';
let bookingsData = [];
let contactsData = [];
let servicesData = [];
let doctorsData = [];
let blogData = [];

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    showDashboard();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Refresh button
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-action="refresh"]')) {
            refreshCurrentSection();
        }
    });
}

// Navigation functions
function showDashboard() {
    hideAllSections();
    document.getElementById('dashboard-content').style.display = 'block';
    updateActiveNav('dashboard');
    loadDashboardData();
}

function showBookings() {
    hideAllSections();
    document.getElementById('bookings-content').style.display = 'block';
    updateActiveNav('bookings');
    loadBookings();
}

function showContacts() {
    hideAllSections();
    document.getElementById('contacts-content').style.display = 'block';
    updateActiveNav('contacts');
    loadContacts();
}

function showServices() {
    hideAllSections();
    document.getElementById('services-content').style.display = 'block';
    updateActiveNav('services');
    loadServices();
}

function showDoctors() {
    hideAllSections();
    document.getElementById('doctors-content').style.display = 'block';
    updateActiveNav('doctors');
    loadDoctors();
}

function showBlog() {
    hideAllSections();
    document.getElementById('blog-content').style.display = 'block';
    updateActiveNav('blog');
    loadBlogPosts();
}

function hideAllSections() {
    const sections = [
        'dashboard-content', 
        'bookings-content', 
        'contacts-content', 
        'services-content', 
        'doctors-content', 
        'blog-content'
    ];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = 'none';
        }
    });
}

function updateActiveNav(section) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current section
    const navLinks = document.querySelectorAll('.nav-link');
    const sectionIndex = ['dashboard', 'bookings', 'contacts', 'services', 'doctors', 'blog'].indexOf(section);
    if (sectionIndex >= 0 && navLinks[sectionIndex]) {
        navLinks[sectionIndex].classList.add('active');
    }
}

// Dashboard functions
function loadDashboardData() {
    showLoading('dashboard-content');
    
    Promise.all([
        fetch('/api/stats').then(response => response.json()),
        fetch('/api/bookings?limit=5').then(response => response.json())
    ])
    .then(([stats, recentBookings]) => {
        updateDashboardStats(stats);
        updateRecentBookings(recentBookings);
        hideLoading('dashboard-content');
    })
    .catch(error => {
        console.error('Error loading dashboard data:', error);
        hideLoading('dashboard-content');
        showError('حدث خطأ أثناء تحميل البيانات');
    });
}

function updateDashboardStats(stats) {
    document.getElementById('total-bookings').textContent = stats.total_bookings || 0;
    document.getElementById('new-bookings').textContent = stats.new_bookings || 0;
    document.getElementById('total-contacts').textContent = stats.total_contacts || 0;
    document.getElementById('total-services').textContent = stats.total_services || 0;
}

function updateRecentBookings(bookings) {
    const table = document.getElementById('recent-bookings-table');
    if (!table) return;
    
    table.innerHTML = '';
    
    if (bookings.length === 0) {
        table.innerHTML = '<tr><td colspan="6" class="text-center text-muted">لا توجد حجوزات حديثة</td></tr>';
        return;
    }
    
    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(booking.name)}</td>
            <td>${escapeHtml(booking.phone)}</td>
            <td>${escapeHtml(booking.service)}</td>
            <td>${formatDate(booking.date)}</td>
            <td><span class="status-badge status-${booking.status}">${getStatusText(booking.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewBooking(${booking.id})" title="عرض التفاصيل">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        table.appendChild(row);
    });
}

// Bookings functions
function loadBookings() {
    if (!requireAdmin()) return;
    showLoading('bookings-content');
    
    fetch('/api/bookings')
        .then(response => response.json())
        .then(data => {
            bookingsData = data;
            updateBookingsTable(data);
            hideLoading('bookings-content');
        })
        .catch(error => {
            console.error('Error loading bookings:', error);
            hideLoading('bookings-content');
            showError('حدث خطأ أثناء تحميل الحجوزات');
        });
}

function updateBookingsTable(bookings) {
    const table = document.getElementById('bookings-table');
    if (!table) return;
    
    table.innerHTML = '';
    
    if (bookings.length === 0) {
        table.innerHTML = '<tr><td colspan="8" class="text-center text-muted">لا توجد حجوزات</td></tr>';
        return;
    }
    
    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(booking.name)}</td>
            <td>${escapeHtml(booking.phone)}</td>
            <td>${escapeHtml(booking.service)}</td>
            <td>${escapeHtml(booking.doctor || '-')}</td>
            <td>${formatDate(booking.date)}</td>
            <td>${escapeHtml(booking.time)}</td>
            <td><span class="status-badge status-${booking.status}">${getStatusText(booking.status)}</span></td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewBooking(${booking.id})" title="عرض التفاصيل">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="updateBookingStatus(${booking.id}, 'confirmed')" title="تأكيد الحجز">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="updateBookingStatus(${booking.id}, 'completed')" title="إكمال الحجز">
                        <i class="fas fa-flag-checkered"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteBooking(${booking.id})" title="حذف الحجز">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        table.appendChild(row);
    });
}

// Contacts functions
function loadContacts() {
    showLoading('contacts-content');
    
    fetch('/api/contacts')
        .then(response => response.json())
        .then(data => {
            contactsData = data;
            updateContactsTable(data);
            hideLoading('contacts-content');
        })
        .catch(error => {
            console.error('Error loading contacts:', error);
            hideLoading('contacts-content');
            showError('حدث خطأ أثناء تحميل رسائل التواصل');
        });
}

function updateContactsTable(contacts) {
    const table = document.getElementById('contacts-table');
    if (!table) return;
    
    table.innerHTML = '';
    
    if (contacts.length === 0) {
        table.innerHTML = '<tr><td colspan="6" class="text-center text-muted">لا توجد رسائل</td></tr>';
        return;
    }
    
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(contact.name)}</td>
            <td>${escapeHtml(contact.email)}</td>
            <td>${escapeHtml(contact.phone)}</td>
            <td>${escapeHtml(contact.subject)}</td>
            <td>${formatDate(contact.date)}</td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewContact(${contact.id})" title="عرض الرسالة">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteContact(${contact.id})" title="حذف الرسالة">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        table.appendChild(row);
    });
}

// Services functions
function loadServices() {
    showLoading('services-content');
    
    fetch('/api/services')
        .then(response => response.json())
        .then(data => {
            servicesData = data;
            updateServicesTable(data);
            hideLoading('services-content');
        })
        .catch(error => {
            console.error('Error loading services:', error);
            hideLoading('services-content');
            showError('حدث خطأ أثناء تحميل الخدمات');
        });
}

function updateServicesTable(services) {
    const table = document.getElementById('services-table');
    if (!table) return;
    
    table.innerHTML = '';
    
    if (services.length === 0) {
        table.innerHTML = '<tr><td colspan="5" class="text-center text-muted">لا توجد خدمات</td></tr>';
        return;
    }
    
    services.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${service.image || 'assets/images/placeholder.jpg'}" alt="${service.name}" 
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"
                     onerror="this.src='assets/images/placeholder.jpg'">
            </td>
            <td>${escapeHtml(service.name)}</td>
            <td>${escapeHtml(service.description.substring(0, 100))}${service.description.length > 100 ? '...' : ''}</td>
            <td>${service.price} ريال</td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary" onclick="editService(${service.id})" title="تعديل الخدمة">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteService(${service.id})" title="حذف الخدمة">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        table.appendChild(row);
    });
}

// Doctors functions
function loadDoctors() {
    showLoading('doctors-content');
    
    fetch('/api/doctors')
        .then(response => response.json())
        .then(data => {
            doctorsData = data;
            updateDoctorsTable(data);
            hideLoading('doctors-content');
        })
        .catch(error => {
            console.error('Error loading doctors:', error);
            hideLoading('doctors-content');
            showError('حدث خطأ أثناء تحميل الأطباء');
        });
}

function updateDoctorsTable(doctors) {
    const table = document.getElementById('doctors-table');
    if (!table) return;
    
    table.innerHTML = '';
    
    if (doctors.length === 0) {
        table.innerHTML = '<tr><td colspan="5" class="text-center text-muted">لا يوجد أطباء</td></tr>';
        return;
    }
    
    doctors.forEach(doctor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${doctor.image || 'assets/images/placeholder.jpg'}" alt="${doctor.name}" 
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"
                     onerror="this.src='assets/images/placeholder.jpg'">
            </td>
            <td>${escapeHtml(doctor.name)}</td>
            <td>${escapeHtml(doctor.specialization)}</td>
            <td>${doctor.experience} سنوات</td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary" onclick="editDoctor(${doctor.id})" title="تعديل الطبيب">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteDoctor(${doctor.id})" title="حذف الطبيب">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        table.appendChild(row);
    });
}

// Blog functions
function loadBlogPosts() {
    showLoading('blog-content');
    
    fetch('/api/blog')
        .then(response => response.json())
        .then(data => {
            blogData = data;
            updateBlogTable(data);
            hideLoading('blog-content');
        })
        .catch(error => {
            console.error('Error loading blog posts:', error);
            hideLoading('blog-content');
            showError('حدث خطأ أثناء تحميل المقالات');
        });
}

function updateBlogTable(posts) {
    const table = document.getElementById('blog-table');
    if (!table) return;
    
    table.innerHTML = '';
    
    if (posts.length === 0) {
        table.innerHTML = '<tr><td colspan="5" class="text-center text-muted">لا توجد مقالات</td></tr>';
        return;
    }
    
    posts.forEach(post => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${post.image || 'assets/images/placeholder.jpg'}" alt="${post.title}" 
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"
                     onerror="this.src='assets/images/placeholder.jpg'">
            </td>
            <td>${escapeHtml(post.title)}</td>
            <td>${escapeHtml(post.author)}</td>
            <td>${formatDate(post.date)}</td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary" onclick="editBlogPost(${post.id})" title="تعديل المقال">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteBlogPost(${post.id})" title="حذف المقال">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        table.appendChild(row);
    });
}

// Utility functions
function getStatusText(status) {
    const statusMap = {
        'new': 'جديد',
        'confirmed': 'مؤكد',
        'completed': 'مكتمل',
        'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="loading"></div>
                <p class="mt-3 text-muted">جاري التحميل...</p>
            </div>
        `;
    }
}

function hideLoading(containerId) {
    // Loading will be hidden when content is loaded
}

function showError(message) {
    // Create error alert
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at the top of the main content
    const mainContent = document.querySelector('.admin-content');
    if (mainContent) {
        mainContent.insertBefore(alert, mainContent.firstChild);
    }
}

function showSuccess(message) {
    // Create success alert
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at the top of the main content
    const mainContent = document.querySelector('.admin-content');
    if (mainContent) {
        mainContent.insertBefore(alert, mainContent.firstChild);
    }
}

function refreshCurrentSection() {
    switch (currentSection) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'contacts':
            loadContacts();
            break;
        case 'services':
            loadServices();
            break;
        case 'doctors':
            loadDoctors();
            break;
        case 'blog':
            loadBlogPosts();
            break;
    }
}

// CRUD Operations
function viewBooking(id) {
    const booking = bookingsData.find(b => b.id === id);
    if (booking) {
        showBookingModal(booking);
    }
}

function updateBookingStatus(id, status) {
    if (!confirm('هل أنت متأكد من تغيير حالة الحجز؟')) return;
    
    fetch(`/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess('تم تحديث حالة الحجز بنجاح');
            loadBookings();
            if (currentSection === 'dashboard') {
                loadDashboardData();
            }
        } else {
            showError('حدث خطأ أثناء تحديث حالة الحجز');
        }
    })
    .catch(error => {
        console.error('Error updating booking status:', error);
        showError('حدث خطأ أثناء تحديث حالة الحجز');
    });
}

function deleteBooking(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الحجز؟')) return;
    
    fetch(`/api/bookings/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess('تم حذف الحجز بنجاح');
            loadBookings();
            if (currentSection === 'dashboard') {
                loadDashboardData();
            }
        } else {
            showError('حدث خطأ أثناء حذف الحجز');
        }
    })
    .catch(error => {
        console.error('Error deleting booking:', error);
        showError('حدث خطأ أثناء حذف الحجز');
    });
}

function viewContact(id) {
    const contact = contactsData.find(c => c.id === id);
    if (contact) {
        showContactModal(contact);
    }
}

function deleteContact(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    
    fetch(`/api/contacts/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccess('تم حذف الرسالة بنجاح');
            loadContacts();
        } else {
            showError('حدث خطأ أثناء حذف الرسالة');
        }
    })
    .catch(error => {
        console.error('Error deleting contact:', error);
        showError('حدث خطأ أثناء حذف الرسالة');
    });
}

// Modal functions
function showBookingModal(booking) {
    const modal = `
        <div class="modal fade" id="bookingModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">تفاصيل الحجز</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>الاسم:</strong> ${escapeHtml(booking.name)}</p>
                                <p><strong>الهاتف:</strong> ${escapeHtml(booking.phone)}</p>
                                <p><strong>البريد الإلكتروني:</strong> ${escapeHtml(booking.email || '-')}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>الخدمة:</strong> ${escapeHtml(booking.service)}</p>
                                <p><strong>الطبيب:</strong> ${escapeHtml(booking.doctor || '-')}</p>
                                <p><strong>التاريخ:</strong> ${formatDate(booking.date)}</p>
                                <p><strong>الوقت:</strong> ${escapeHtml(booking.time)}</p>
                            </div>
                        </div>
                        ${booking.notes ? `<p><strong>ملاحظات:</strong> ${escapeHtml(booking.notes)}</p>` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('bookingModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modal);
    
    // Show modal
    const modalElement = document.getElementById('bookingModal');
    const bootstrapModal = new bootstrap.Modal(modalElement);
    bootstrapModal.show();
}

function showContactModal(contact) {
    const modal = `
        <div class="modal fade" id="contactModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">تفاصيل الرسالة</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>الاسم:</strong> ${escapeHtml(contact.name)}</p>
                                <p><strong>البريد الإلكتروني:</strong> ${escapeHtml(contact.email)}</p>
                                <p><strong>الهاتف:</strong> ${escapeHtml(contact.phone)}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>الموضوع:</strong> ${escapeHtml(contact.subject)}</p>
                                <p><strong>التاريخ:</strong> ${formatDate(contact.date)}</p>
                            </div>
                        </div>
                        <div class="mt-3">
                            <strong>الرسالة:</strong>
                            <div class="border rounded p-3 mt-2 bg-light">
                                ${escapeHtml(contact.message)}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('contactModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modal);
    
    // Show modal
    const modalElement = document.getElementById('contactModal');
    const bootstrapModal = new bootstrap.Modal(modalElement);
    bootstrapModal.show();
}

// Export functions
function exportBookings() {
    fetch('/api/export/bookings')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error exporting bookings:', error);
            showError('حدث خطأ أثناء تصدير البيانات');
        });
}

function exportContacts() {
    fetch('/api/export/contacts')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error exporting contacts:', error);
            showError('حدث خطأ أثناء تصدير البيانات');
        });
}

// Placeholder functions for future implementation
function editService(id) {
    alert('سيتم إضافة ميزة تعديل الخدمات قريباً');
}

function deleteService(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    alert('سيتم إضافة ميزة حذف الخدمات قريباً');
}

function editDoctor(id) {
    alert('سيتم إضافة ميزة تعديل الأطباء قريباً');
}

function deleteDoctor(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الطبيب؟')) return;
    alert('سيتم إضافة ميزة حذف الأطباء قريباً');
}

function editBlogPost(id) {
    alert('سيتم إضافة ميزة تعديل المقالات قريباً');
}

function deleteBlogPost(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    alert('سيتم إضافة ميزة حذف المقالات قريباً');
}

function showAddServiceModal() {
    const modal = new bootstrap.Modal(document.getElementById('addServiceModal'));
    modal.show();
}

function showAddDoctorModal() {
    const modal = new bootstrap.Modal(document.getElementById('addDoctorModal'));
    modal.show();
}

function showAddBlogModal() {
    alert('سيتم إضافة ميزة إضافة المقالات قريباً');
}

function addService() {
    const form = document.getElementById('addServiceForm');
    const formData = new FormData(form);
    
    fetch('/api/services', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            bootstrap.Modal.getInstance(document.getElementById('addServiceModal')).hide();
            form.reset();
            loadServices();
            showSuccess('تم إضافة الخدمة بنجاح');
        } else {
            showError('حدث خطأ أثناء إضافة الخدمة');
        }
    })
    .catch(error => {
        console.error('Error adding service:', error);
        showError('حدث خطأ أثناء إضافة الخدمة');
    });
}

function addDoctor() {
    const form = document.getElementById('addDoctorForm');
    const formData = new FormData(form);
    
    fetch('/api/doctors', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            bootstrap.Modal.getInstance(document.getElementById('addDoctorModal')).hide();
            form.reset();
            loadDoctors();
            showSuccess('تم إضافة الطبيب بنجاح');
        } else {
            showError('حدث خطأ أثناء إضافة الطبيب');
        }
    })
    .catch(error => {
        console.error('Error adding doctor:', error);
        showError('حدث خطأ أثناء إضافة الطبيب');
    });
}

// حماية جميع الوظائف الإدارية
function requireAdmin() {
    if (localStorage.getItem('admin_logged_in') !== '1') {
        alert('يجب تسجيل الدخول كأدمن!');
        window.location.reload();
        return false;
    }
    return true;
} 