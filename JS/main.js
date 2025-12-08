// ============================================
// Register Page Elements
// ============================================
const nameInput = document.getElementById('name');
const studentIdInput = document.getElementById('student-id');
const universityEmailInput = document.getElementById('university-email');
const passwordInput = document.getElementById('password');
const registerButton = document.getElementById('register-button');
const actionButtons = document.querySelector('.action-buttons');

// ============================================
// Check In Page Elements
// ============================================
const checkInForm = document.querySelector('.check-in-form');
const classCodeInput = document.querySelector('.class-code input');
const classSecurityInput = document.querySelector('.class-security input');
const checkInButton = document.querySelector('.check-in-button');
const checkInMessage = document.querySelector('.check-in-message');

// ============================================
// History Page Elements
// ============================================
const attendanceRecords = document.querySelector('.attendance-records');

// ============================================
// تخزين البيانات فى ال Local Storage
// ============================================
let users = JSON.parse(localStorage.getItem('users')) || [];

// ============================================
// التحقق من صحة البيانات
// ============================================

function validateName(name) {
    if (!name || name.trim().length < 3) {
        alert("Please enter a valid name (at least 3 characters)");
        return false;
    }
    return true;
}


function validateStudentId(studentId) {
    const studentIdRegex = /^[0-9]{9}$/;
    if (!studentIdRegex.test(studentId)) {
        alert("Please enter a valid student ID (9 digits)");
        return false;
    }
    return true;
}


function validateUniversityEmail(email) {
    const universityEmailRegex = /^[a-zA-Z0-9._%+-]+@nmu\.edu\.eg$/;
    if (!universityEmailRegex.test(email)) {
        alert("Please enter a valid NMU university email (example@nmu.edu.eg)");
        return false;
    }
    return true;
}


function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        alert("Password must contain:\n- At least 8 characters\n- One uppercase letter\n- One lowercase letter\n- One number\n- One special character (@$!%*?&)");
        return false;
    }
    return true;
}


function checkDuplicateStudentId(studentId) {
    if (users.find(user => user.studentId === studentId)) {
        alert("This Student ID is already registered!");
        return false;
    }
    return true;
}


function checkDuplicateEmail(email) {
    if (users.find(user => user.universityEmail === email)) {
        alert("This email is already registered!");
        return false;
    }
    return true;
}

// ============================================
// User Management Functions
// ============================================

/**
 * حفظ المستخدمين في Local Storage
 */
function saveUsersToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(users));
}

function createNewUser(name, studentId, email, password) {
    return {
        id: Date.now(),
        name: name.trim(),
        studentId: studentId.trim(),
        universityEmail: email.trim().toLowerCase(),
        password: password,
        attendance: [],
        registeredAt: new Date().toISOString()
    };
}

/**
 * مسح حقول الإدخال
 */
function clearInputFields() {
    nameInput.value = "";
    studentIdInput.value = "";
    universityEmailInput.value = "";
    passwordInput.value = "";
}

/**
 * التوجيه للصفحة الرئيسية
 */
function redirectToHomePage() {
    setTimeout(() => {
        window.location.href = "index.html";
    }, 500);
}

// ============================================
// Main Registration Handler
// ============================================

function handleRegister(event) {
    event.preventDefault();

    // الحصول على القيم من الحقول
    const name = nameInput.value;
    const studentId = studentIdInput.value;
    const universityEmail = universityEmailInput.value;
    const password = passwordInput.value;

    // التحقق من جميع الحقول
    if (!validateName(name)) return;
    if (!validateStudentId(studentId)) return;
    if (!validateUniversityEmail(universityEmail)) return;
    if (!validatePassword(password)) return;
    if (!checkDuplicateStudentId(studentId)) return;
    if (!checkDuplicateEmail(universityEmail)) return;

    // إنشاء المستخدم الجديد
    const newUser = createNewUser(name, studentId, universityEmail, password);

    // إضافة المستخدم للقائمة
    users.push(newUser);

    // حفظ البيانات في Local Storage
    saveUsersToLocalStorage();

    // حفظ المستخدم الحالي
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // إظهار رسالة نجاح
    alert("Registration successful! Welcome to the system.");

    // مسح الحقول
    clearInputFields();

    // التوجيه للصفحة الرئيسية
    redirectToHomePage();
}


//  التحقق من وجود مستخدم مسجل دخول وعرض اسمه

function existingUserLogin() {
    const currentUser = localStorage.getItem('currentUser');
    const mobileActionButtons = document.querySelector('.mobile-action-buttons');
    
    if (currentUser && actionButtons) {
        const user = JSON.parse(currentUser);
        actionButtons.innerHTML = `
            <button class="user-name">${user.name}</button>
            <button class="logout-btn" onclick="handleLogout()">Logout</button>
        `;
    }
    
    // تحديث القائمة المتنقلة أيضاً
    if (currentUser && mobileActionButtons) {
        const user = JSON.parse(currentUser);
        mobileActionButtons.innerHTML = `
            <button class="user-name" style="margin-bottom: 10px;">${user.name}</button>
            <button class="logout-btn" onclick="handleLogout()">Logout</button>
        `;
    }
}

// تسجيل خروج المستخدم
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}


// ============================================
// Check In Page - Class Codes Database
// ============================================
const availableClasses = {
    'AIE111': {
        name: 'Artificial Intelligence',
        security: 'AIE2024',
        instructor: 'Dr. Sara'
    },
    'CS211': {
        name: 'Web Programming',
        security: 'WEB2024',
        instructor: 'Dr. Mokhtar'
    },
    'CS233': {
        name: 'Operating Systems',
        security: 'OS2024',
        instructor: 'Dr. Rasha'
    },
    'CS241': {
        name: 'Security of information systems',
        security: 'SEC2024',
        instructor: 'Dr. Fatma'
    },
    'CSE261': {
        name: 'Computer networks',
        security: 'NET2024',
        instructor: 'Dr. Ibrahim'
    }
};

// ============================================
// Check In Page Functions Logic
// ============================================

function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        return null;
    }
    return JSON.parse(currentUser);
}


function validateClassCode(classCode) {
    if (!availableClasses[classCode]) {
        showCheckInMessage('Invalid class code! Please check and try again.', 'error');
        return false;
    }
    return true;
}

function validateClassSecurity(classCode, security) {
    // إذا كانت فارغة، مسموح
    if (!security) {
        return true;
    }

    // إذا كانت مدخلة، يجب أن تكون صحيحة
    if (availableClasses[classCode].security !== security) {
        showCheckInMessage('Incorrect security code!', 'error');
        return false;
    }
    return true;
}

function checkDuplicateAttendance(user, classCode) {
    if (!user.attendance || user.attendance.length === 0) {
        return true;
    }

    const today = new Date().toDateString();

    const alreadyCheckedIn = user.attendance.some(record => {
        const recordDate = new Date(record.checkInTime).toDateString();
        return record.classCode === classCode && recordDate === today;
    });

    if (alreadyCheckedIn) {
        showCheckInMessage('You have already checked in to this class today!', 'error');
        return false;
    }

    return true;
}


function createAttendanceRecord(user, classCode, classSecurity) {
    return {
        id: Date.now(),
        userId: user.id,
        userName: user.name,
        studentId: user.studentId,
        classCode: classCode,
        className: availableClasses[classCode].name,
        instructor: availableClasses[classCode].instructor,
        classSecurity: classSecurity || 'N/A',
        checkInTime: new Date().toISOString(),
        checkInDate: new Date().toDateString(),
        status: 'Present'
    };
}


function saveAttendanceRecord(user, attendanceRecord) {
    // إضافة السجل لحضور المستخدم
    if (!user.attendance) {
        user.attendance = [];
    }
    user.attendance.push(attendanceRecord);

    // تحديث بيانات المستخدم في قائمة المستخدمين
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex] = user;
    }

    // حفظ في Local Storage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));
}


function showCheckInMessage(message, type) {
    if (!checkInMessage) return;

    checkInMessage.textContent = message;
    checkInMessage.className = 'check-in-message ' + type;

    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(() => {
        checkInMessage.className = 'check-in-message';
        checkInMessage.textContent = '';
    }, 5000);
}


function clearCheckInFields() {
    if (classCodeInput) classCodeInput.value = '';
    if (classSecurityInput) classSecurityInput.value = '';
}


function handleCheckIn(e) {
    e.preventDefault();

    // 1. التحقق من وجود مستخدم مسجل دخول
    const user = getCurrentUser();
    if (!user) {
        alert('You must be logged in to check in!\nRedirecting to registration page...');
        setTimeout(() => {
            window.location.href = 'register.html';
        }, 1000);
        return;
    }

    // 2. الحصول على القيم المدخلة
    const classCode = classCodeInput.value.trim().toUpperCase();
    const classSecurity = classSecurityInput.value.trim();

    // 3. التحقق من إدخال كود المادة
    if (!classCode) {
        showCheckInMessage('Please enter a class code!', 'error');
        return;
    }

    // 4. التحقق من صحة كود المادة
    if (!validateClassCode(classCode)) {
        return;
    }

    // 5. التحقق من كلمة السر (إذا تم إدخالها)
    if (!validateClassSecurity(classCode, classSecurity)) {
        return;
    }

    // 6. التحقق من عدم التسجيل المكرر
    if (!checkDuplicateAttendance(user, classCode)) {
        return;
    }

    // 7. إنشاء سجل الحضور
    const attendanceRecord = createAttendanceRecord(user, classCode, classSecurity);

    // 8. حفظ السجل
    saveAttendanceRecord(user, attendanceRecord);

    // 9. عرض رسالة نجاح
    const className = availableClasses[classCode].name;
    showCheckInMessage(
        `Successfully checked in to ${className}!\nWelcome, ${user.name}!`,
        'success'
    );

    clearCheckInFields();

    // 11. التوجيه لصفحة History بعد 2 ثانية 
    setTimeout(() => {
        window.location.href = 'history.html';
    }, 2000);
}


// ============================================
// History Page Functions
// ============================================

function renderAttendanceRecords() {
    // 1. الحصول على المستخدم الحالي
    const currentUser = localStorage.getItem('currentUser');
    const user = JSON.parse(currentUser);
    attendanceRecords.innerHTML = '';
    // 2. عرض سجلات الحضور
    user.attendance.forEach(record => {
            const recordElement = document.createElement('div');
            recordElement.classList.add('attendance-record');
            recordElement.innerHTML = `
                <div class="class-info">
                    <p class="class-name">${record.className}</p>
                    <p class="class-code">${record.classCode}</p>
                </div>
                <div class="date-info">
                    <p>${record.checkInDate}</p>
                </div>
                <div class="status-info">
                    <div class="status-badge status-${record.status.toLowerCase()}">
                        <i class="fa-solid fa-${record.status === 'Present' ? 'check' : 'times-circle'}"></i> 
                        ${record.status}
                    </div>
                </div>
                <div class="details-info">
                    <button class="details-btn">
                            <span class="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
            `;
            attendanceRecords.appendChild(recordElement);
        });
}

// ============================================
// Event Listeners
// ============================================

// ربط زر التسجيل بالفانكشن
if (registerButton) {
    registerButton.addEventListener('click', handleRegister);
}

// منع إرسال الفورم عند الضغط على Enter
const registerForm = document.querySelector('.form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister(e);
    });
}

// ============================================
// Check In Page Event Listeners
// ============================================

// ربط فورم Check In بالفانكشن
if (checkInForm) {
    checkInForm.addEventListener('submit', handleCheckIn);
}

// ============================================
// التحقق من وجود مستخدم مسجل دخول عند تحميل الصفحة
// ============================================
existingUserLogin();
renderAttendanceRecords();

// ============================================
// Hamburger Menu Control
// ============================================
const hamburgerToggle = document.getElementById('hamburger-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburgerToggle && mobileMenu) {
    hamburgerToggle.addEventListener('change', function() {
        if (this.checked) {
            mobileMenu.classList.add('active');
            mobileMenu.style.display = 'block';
            mobileMenu.style.opacity = '1';
            mobileMenu.style.visibility = 'visible';
            mobileMenu.style.transform = 'translateY(0)';
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('active');
            mobileMenu.style.display = 'none';
            mobileMenu.style.opacity = '0';
            mobileMenu.style.visibility = 'hidden';
            mobileMenu.style.transform = 'translateY(-100%)';
            document.body.style.overflow = '';
        }
    });

    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburgerToggle.checked = false;
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    const mobileRegisterBtn = mobileMenu.querySelector('.register-btn');
    if (mobileRegisterBtn) {
        mobileRegisterBtn.addEventListener('click', function() {
            hamburgerToggle.checked = false;
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    document.addEventListener('click', function(event) {
        if (hamburgerToggle.checked && 
            !mobileMenu.contains(event.target) && 
            !hamburgerToggle.contains(event.target)) {
            hamburgerToggle.checked = false;
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

