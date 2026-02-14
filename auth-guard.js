// Authentication Guard System
class AuthGuard {
    constructor() {
        this.protectedPages = ['trade.html', 'profile.html'];
        this.init();
    }

    init() {
        this.checkPageAccess();
        this.updateNavigation();
    }

    checkPageAccess() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isLoggedIn = this.isUserLoggedIn();

        if (this.protectedPages.includes(currentPage) && !isLoggedIn) {
            this.redirectToLogin();
            return;
        }
    }

    isUserLoggedIn() {
        // Check both local and session storage
        return localStorage.getItem('userLoggedIn') === 'true' ||
            sessionStorage.getItem('userLoggedIn') === 'true';
    }

    redirectToLogin() {
        window.location.href = 'login.html';
    }

    updateNavigation() {
        // Check both storages for user data
        const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
        const userProfileStr = localStorage.getItem('userProfile') || sessionStorage.getItem('userProfile');
        const userProfile = JSON.parse(userProfileStr || '{}');
        const authButton = document.getElementById('authButton');
        const authContent = document.getElementById('authContent');
        const navProfile = document.getElementById('navProfile');

        // Toggle Profile Link independent of dropdown
        if (navProfile) {
            // Use empty string to revert to default CSS (likely list-item or block), or explicit 'block' if hidden by inline style
            navProfile.style.display = userRole ? 'block' : 'none';
        }

        if (authButton && authContent) {
            if (userRole) {
                const userName = userProfile.name || userRole.charAt(0).toUpperCase() + userRole.slice(1);
                authButton.innerHTML = `<i class="fas fa-user-circle"></i> ${userName} <i class="fas fa-chevron-down"></i>`;
                authContent.innerHTML = `
                    <a href="profile.html"><i class="fas fa-user"></i> <span data-i18n="nav.profile">My Profile</span></a>
                    <a href="verification.html"><i class="fas fa-shield-alt"></i> <span data-i18n="nav.verification">Verification</span></a>
                    <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> <span data-i18n="nav.logout">Logout</span></a>
                `;
            } else {
                authButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span data-i18n="nav.login">Login</span> <i class="fas fa-chevron-down"></i>';
                authContent.innerHTML = `
                    <a href="login.html"><i class="fas fa-sign-in-alt"></i> <span data-i18n="nav.login">Login</span></a>
                    <a href="register.html"><i class="fas fa-user-plus"></i> <span data-i18n="nav.register">Register</span></a>
                `;
            }

            // Trigger translation update if translator is available
            if (window.translator) {
                setTimeout(() => window.translator.translatePage(), 0);
            }
        }
    }

    logout() {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userEmail');

        sessionStorage.removeItem('userLoggedIn');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('userProfile');
        sessionStorage.removeItem('userEmail');

        window.location.href = 'index.html';
    }
}

// Initialize auth guard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthGuard();
});

// Global logout function
function logout() {
    new AuthGuard().logout();
}