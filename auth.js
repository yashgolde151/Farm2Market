function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Check if user exists in registered users
    const users = JSON.parse(localStorage.getItem('farm2market_users') || '[]');

    // DEMO LOGIN LOGIC
    let user = null;
    if (username === 'farmer@gmail.com' && password === 'farmer') {
        user = {
            name: 'Demo Farmer',
            email: 'farmer@gmail.com',
            mobile: '9876543210',
            role: 'farmer',
            password: 'farmer'
        };
    } else if (username === 'buyer@gmail.com' && password === 'buyer') {
        user = {
            name: 'Demo Buyer',
            email: 'buyer@gmail.com',
            mobile: '9876543211',
            role: 'buyer',
            password: 'buyer'
        };
    } else {
        // Normal check
        user = users.find(u => (u.email === username || u.mobile === username) && u.password === password);
    }

    if (user) {
        const rememberMe = document.getElementById('remember').checked;
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem('userLoggedIn', 'true');
        storage.setItem('userEmail', user.email);
        storage.setItem('userName', user.name);
        storage.setItem('userRole', user.role);
        storage.setItem('userProfile', JSON.stringify(user)); // Needed for auth-guard navigation

        // Also ensure the other storage is clear to avoid conflicts
        const otherStorage = rememberMe ? sessionStorage : localStorage;
        otherStorage.removeItem('userLoggedIn');
        otherStorage.removeItem('userRole');
        otherStorage.removeItem('userProfile');

        showNotification(`Welcome back, ${user.name}!`, 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        // FIX: do not login unregistered users
        showNotification('Invalid email or password', 'error');
        return;
    }
}

// User Type Selection
function selectUserType(type) {
    document.getElementById('farmerCard').classList.remove('selected');
    document.getElementById('buyerCard').classList.remove('selected');

    if (type === 'farmer') {
        document.getElementById('farmerCard').classList.add('selected');
        document.querySelector('input[value="farmer"]').checked = true;
    } else if (type === 'buyer') {
        document.getElementById('buyerCard').classList.add('selected');
        document.querySelector('input[value="buyer"]').checked = true;
    }
}

function handleRegister(e) {
    e.preventDefault();

    const selectedRole = document.querySelector('input[name="userRole"]:checked');
    const errorDiv = document.getElementById('userTypeError');

    if (!selectedRole) {
        if (errorDiv) errorDiv.style.display = 'block';
        showNotification('Please select your role (Farmer or Buyer)', 'error');
        return;
    }

    if (errorDiv) errorDiv.style.display = 'none';

    const name = document.getElementById('fullName').value;
    const mobile = document.getElementById('mobile').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('passwordReg').value;
    const userRole = selectedRole.value;

    if (!name || !mobile || !email || !password) {
        showNotification('Please fill all required fields', 'error');
        return;
    }

    if (mobile.length !== 10 || !/^[0-9]+$/.test(mobile)) {
        showNotification('Please enter a valid 10-digit mobile number', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return;
    }

    // FIX: password added
    const userProfile = {
        name: name,
        email: email,
        mobile: mobile,
        role: userRole,
        password: password,
        registrationDate: new Date().toISOString()
    };

    fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile)
    })
        .then(response => response.json())
        .then(data => {
            showNotification(`Registration successful for ${name}! Redirecting to login...`, 'success');

            localStorage.setItem('newUserProfile', JSON.stringify(userProfile));
            const existingUsers = JSON.parse(localStorage.getItem('farm2market_users') || '[]');

            // password now saved
            const newUser = { id: data.id, ...userProfile };
            existingUsers.push(newUser);
            localStorage.setItem('farm2market_users', JSON.stringify(existingUsers));

            localStorage.setItem('registrationEmail', email);
            localStorage.setItem('registrationPassword', password);

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        })
        .catch(error => {
            console.error('Registration error:', error);

            localStorage.setItem('newUserProfile', JSON.stringify(userProfile));
            const existingUsers = JSON.parse(localStorage.getItem('farm2market_users') || '[]');

            // password now saved
            const newUser = { id: Date.now(), ...userProfile };
            existingUsers.push(newUser);
            localStorage.setItem('farm2market_users', JSON.stringify(existingUsers));

            localStorage.setItem('registrationEmail', email);
            localStorage.setItem('registrationPassword', password);


            // Also ensure the other storage is clear to avoid conflicts
            showNotification(`Registration successful for ${name}! Redirecting to login...`, 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Language Switcher Logic
function changeLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);

    // Use the global translator instance if available
    if (window.translator) {
        window.translator.setLanguage(lang);
    } else if (window.i18n) {
        window.i18n.setLanguage(lang);
    } else {
        location.reload();
    }
}

// Initialize selector value on load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    const selector = document.querySelector('.auth-language-selector select');
    if (selector) {
        selector.value = savedLang;
    }
});
