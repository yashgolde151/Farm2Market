// Verification Role Detection and Control
document.addEventListener('DOMContentLoaded', function() {
    // Check user role and setup verification
    const userRole = localStorage.getItem('userRole');
    const newUserRole = localStorage.getItem('newUserRole');
    const userType = localStorage.getItem('userType');
    
    const role = userRole || newUserRole || userType || 'guest';
    
    // If user is not logged in, show alert
    if (role === 'guest') {
        showNotLoggedInMessage();
        return;
    }
    
    // Setup verification based on role
    setupVerificationByRole(role.toLowerCase());
    
    // Handle tab switching
    setupTabSwitching();
});

// Show appropriate message if not logged in
function showNotLoggedInMessage() {
    const formSection = document.querySelector('.verification-forms-section');
    if (formSection) {
        formSection.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; background: white; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <i class="fas fa-lock" style="font-size: 3rem; color: #f44336; margin-bottom: 1rem; display: block;"></i>
                <h2 style="color: #333; margin-bottom: 1rem;">Login Required</h2>
                <p style="color: #666; margin-bottom: 2rem; font-size: 1.1rem;">
                    Please login or register to access the verification process.
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <a href="login.html" class="btn" style="background: #2E7D32; color: white; padding: 0.8rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </a>
                    <a href="register.html" class="btn" style="background: #4CAF50; color: white; padding: 0.8rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        <i class="fas fa-user-plus"></i> Register
                    </a>
                </div>
            </div>
        `;
    }
}

// Setup verification based on user role
function setupVerificationByRole(role) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    let targetTab = 'farmer'; // Default
    let displayText = 'Farmer';
    
    // Determine which tab to show
    if (role === 'buyer') {
        targetTab = 'buyer';
        displayText = 'Buyer';
    } else if (role === 'farmer') {
        targetTab = 'farmer';
        displayText = 'Farmer';
    }
    
    // Hide all tabs
    tabContents.forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show appropriate tab
    const targetContent = document.getElementById(`${targetTab}-tab`);
    const targetBtn = document.querySelector(`[data-tab="${targetTab}"]`);
    
    if (targetContent) {
        targetContent.style.display = 'block';
        targetContent.classList.add('active');
    }
    
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    // Add header text showing user type
    addVerificationHeader(displayText, role);
}

// Add header showing verification type
function addVerificationHeader(displayText, role) {
    const header = document.querySelector('.verification-header');
    if (header) {
        const userIndicator = document.createElement('div');
        userIndicator.style.cssText = `
            background: ${role === 'buyer' ? '#2196F3' : '#2E7D32'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            margin-top: 1rem;
            display: inline-block;
            font-weight: 600;
        `;
        userIndicator.innerHTML = `<i class="fas fa-${role === 'buyer' ? 'shopping-bag' : 'tractor'}"></i> 
                                   ${displayText} Verification Process`;
        header.appendChild(userIndicator);
    }
}

// Setup tab switching
function setupTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Hide all tabs
            tabContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });
            
            // Remove active class from all buttons
            tabBtns.forEach(b => {
                b.classList.remove('active');
            });
            
            // Show selected tab
            const selectedContent = document.getElementById(`${tabName}-tab`);
            if (selectedContent) {
                selectedContent.style.display = 'block';
                selectedContent.classList.add('active');
                this.classList.add('active');
            }
        });
    });
}

// Update navbar based on login status
function updateNavigation() {
    const userRole = localStorage.getItem('userRole') || localStorage.getItem('newUserRole') || localStorage.getItem('userType');
    const authButton = document.getElementById('authButton');
    const authContent = document.getElementById('authContent');
    const verificationLink = document.getElementById('verificationLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (userRole) {
        // User is logged in
        if (authButton) {
            authButton.innerHTML = `<i class="fas fa-user-circle"></i> ${userRole.charAt(0).toUpperCase() + userRole.slice(1)} <i class="fas fa-chevron-down"></i>`;
        }
        
        if (verificationLink) {
            verificationLink.style.display = 'block';
        }
        if (logoutLink) {
            logoutLink.style.display = 'block';
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('newUserRole');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    alert('Logged out successfully');
    window.location.href = 'index.html';
}

// Initialize on page load
updateNavigation();
