// Demo Profile Setup - Simulates user login and profile initialization

// Sample user profiles for different roles
const demoProfiles = {
    farmer: {
        name: 'Rajesh Kumar',
        role: 'farmer',
        email: 'rajesh.kumar@example.com',
        phone: '+91 98765 43210',
        address: 'Village Rampur, Tehsil Kaithal, District Kaithal, Haryana - 136027',
        state: 'Haryana',
        farmSize: 25,
        crops: ['Wheat', 'Rice', 'Cotton'],
        experience: 15,
        irrigation: 'Tube Well',
        soilType: 'Alluvial',
        organic: 'No',
        totalTrades: 47,
        totalRevenue: 240000,
        rating: 4.8,
        successRate: 98,
        aadhar: '1234 5678 9012'
    },
    buyer: {
        name: 'Suresh Patel',
        role: 'buyer',
        email: 'suresh.patel@agroind.com',
        phone: '+91 98765 43211',
        address: 'Agro Industries Complex, Sector 15, Gurgaon, Haryana - 122001',
        state: 'Haryana',
        company: 'Agro Industries Ltd.',
        gst: 'GST123456789',
        businessType: 'Food Processing',
        totalTrades: 156,
        totalRevenue: 1250000,
        rating: 4.9,
        successRate: 99,
        establishedYear: 2010
    }
};

// Function to simulate login
function demoLogin(role = 'farmer') {
    const profile = demoProfiles[role];
    
    // Set user role in localStorage
    localStorage.setItem('userRole', role);
    
    // Set user profile in localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    // Show success message
    showNotification(`Demo login successful as ${role}: ${profile.name}`, 'success');
    
    // Redirect to appropriate page
    if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
        window.location.href = 'index.html';
    } else {
        // Refresh current page to load profile
        window.location.reload();
    }
}

// Function to clear demo data
function demoLogout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userProfile');
    showNotification('Demo logout successful', 'info');
    window.location.href = 'index.html';
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
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
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Auto-login for demo purposes (can be removed in production)
function autoLoginDemo() {
    const currentRole = localStorage.getItem('userRole');
    if (!currentRole && !window.location.pathname.includes('login.html')) {
        // Auto-login as farmer for demo
        demoLogin('farmer');
    }
}

// Initialize demo on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add demo login buttons to pages (for testing)
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        addDemoControls();
    }
    
    // Auto-login for demo (comment out for production)
    // autoLoginDemo();
});

function addDemoControls() {
    // Create demo control panel
    const demoPanel = document.createElement('div');
    demoPanel.id = 'demoControls';
    demoPanel.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 10000;
        font-size: 12px;
        display: none;
    `;
    
    demoPanel.innerHTML = `
        <div style="margin-bottom: 5px;"><strong>Demo Controls</strong></div>
        <button onclick="demoLogin('farmer')" style="margin: 2px; padding: 5px; font-size: 11px;">Login as Farmer</button>
        <button onclick="demoLogin('buyer')" style="margin: 2px; padding: 5px; font-size: 11px;">Login as Buyer</button>
        <button onclick="demoLogout()" style="margin: 2px; padding: 5px; font-size: 11px;">Logout</button>
        <button onclick="document.getElementById('demoControls').style.display='none'" style="margin: 2px; padding: 5px; font-size: 11px;">Hide</button>
    `;
    
    document.body.appendChild(demoPanel);
    
    // Add toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Demo';
    toggleBtn.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: #4CAF50;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        z-index: 10001;
        font-size: 11px;
    `;
    toggleBtn.onclick = () => {
        const panel = document.getElementById('demoControls');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };
    
    document.body.appendChild(toggleBtn);
}

// Export functions for global access
window.demoLogin = demoLogin;
window.demoLogout = demoLogout;
window.demoProfiles = demoProfiles;