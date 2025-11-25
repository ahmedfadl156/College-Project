// ============================================
// Register Page Elements
// ============================================
const nameInput = document.getElementById('name');
const studentIdInput = document.getElementById('student-id');
const universityEmailInput = document.getElementById('university-email');
const passwordInput = document.getElementById('password');
const registerButton = document.getElementById('register-button');

// ============================================
// تخزين البيانات فى ال Local Storage
// ============================================
let users = JSON.parse(localStorage.getItem('users')) || [];

// ============================================
// التحقق من صحة البيانات
// ============================================

/**
 * التحقق من صحة الاسم
 * @param {string} name - الاسم المدخل
 * @returns {boolean} - true إذا كان الاسم صحيح
 */
function validateName(name) {
    if (!name || name.trim().length < 3) {
        alert("Please enter a valid name (at least 3 characters)");
        return false;
    }
    return true;
}

/**
 * التحقق من صحة الرقم الجامعي
 * @param {string} studentId - الرقم الجامعي
 * @returns {boolean} - true إذا كان الرقم صحيح
 */
function validateStudentId(studentId) {
    const studentIdRegex = /^[0-9]{9}$/;
    if (!studentIdRegex.test(studentId)) {
        alert("Please enter a valid student ID (9 digits)");
        return false;
    }
    return true;
}

/**
 * التحقق من صحة الإيميل الجامعي
 * @param {string} email - الإيميل المدخل
 * @returns {boolean} - true إذا كان الإيميل صحيح
 */
function validateUniversityEmail(email) {
    const universityEmailRegex = /^[a-zA-Z0-9._%+-]+@nmu\.edu\.eg$/;
    if (!universityEmailRegex.test(email)) {
        alert("Please enter a valid NMU university email (example@nmu.edu.eg)");
        return false;
    }
    return true;
}

/**
 * التحقق من قوة كلمة المرور
 * @param {string} password - كلمة المرور
 * @returns {boolean} - true إذا كانت كلمة المرور قوية
 */
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        alert("Password must contain:\n- At least 8 characters\n- One uppercase letter\n- One lowercase letter\n- One number\n- One special character (@$!%*?&)");
        return false;
    }
    return true;
}

/**
 * التحقق من عدم تكرار الرقم الجامعي
 * @param {string} studentId - الرقم الجامعي
 * @returns {boolean} - true إذا كان الرقم غير مكرر
 */
function checkDuplicateStudentId(studentId) {
    if (users.find(user => user.studentId === studentId)) {
        alert("This Student ID is already registered!");
        return false;
    }
    return true;
}

/**
 * التحقق من عدم تكرار الإيميل
 * @param {string} email - الإيميل
 * @returns {boolean} - true إذا كان الإيميل غير مكرر
 */
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

/**
 * إنشاء مستخدم جديد
 * @param {string} name - الاسم
 * @param {string} studentId - الرقم الجامعي
 * @param {string} email - الإيميل
 * @param {string} password - كلمة المرور
 * @returns {object} - بيانات المستخدم الجديد
 */
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

/**
 * الفانكشن الرئيسية لتسجيل مستخدم جديد
 * @param {Event} event - حدث النقر على الزر
 */
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

    // إظهار رسالة نجاح
    alert("✅ Registration successful! Welcome to the system.");

    // مسح الحقول
    clearInputFields();

    // التوجيه للصفحة الرئيسية
    redirectToHomePage();
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
