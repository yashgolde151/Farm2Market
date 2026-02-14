// Global variables
let currentLanguage = 'en';
let userProfile = {
    name: 'Rajesh Kumar',
    role: 'farmer',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765 43210',
    farmSize: 25,
    crops: ['Wheat', 'Rice', 'Cotton'],
    totalTrades: 47,
    totalRevenue: 240000,
    rating: 4.8,
    successRate: 98
};
let marketData = {
    wheat: { price: 2150, change: 2.3, volume: 1247 },
    rice: { price: 1890, change: -1.2, volume: 892 },
    cotton: { price: 5670, change: 4.1, volume: 634 },
    sugarcane: { price: 3200, change: 1.8, volume: 445 },
    soybean: { price: 4350, change: -0.5, volume: 723 }
};

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const appName = "Farm2Market";
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

// Add CSS animations if not already present
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

// Initialize based on current page
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    try {
        switch (currentPage) {
            case 'index.html':
            case '':
                initializeHomePage();
                startRealTimeUpdates();
                break;
            case 'market.html':
                initializeMarketPage();
                startRealTimeUpdates();
                break;
            case 'trade.html':
                initializeTradePage();
                break;
            case 'verification.html':
                initializeVerificationPage();
                break;
            case 'profile.html':
                initializeProfilePage();
                break;
        }
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});



function initializeHomePage() {
    updatePriceTicker();
}

function initializeMarketPage() {
    initializePriceChart();
    updateMarketData();
    populateCropsTable();
}

function initializeTradePage() {
    populateAvailableCrops();
    setupEventListeners();

    // Check for auto-login from demo account
    const role = localStorage.getItem('userRole');
    if (role) {
        showDashboard(role);

        // Hide the selector buttons since we know the role
        const selector = document.getElementById('dashboardSelector');
        if (selector) selector.style.display = 'none';

        // Update page title/header to be specific
        const pageTitle = document.querySelector('h1');
        if (pageTitle) {
            pageTitle.textContent = role === 'farmer' ? 'Farmer Trading Dashboard' : 'Buyer Procurement Dashboard';
        }

        // Update generic subtitle
        const pageSubtitle = document.querySelector('p');
        if (pageSubtitle && pageSubtitle.textContent.includes('Connect farmers')) {
            pageSubtitle.style.display = 'none';
        }
    }
}



// Profile page functions
function initializeProfilePage() {
    loadUserProfile();
    setupProfileEventListeners();
}

function loadUserProfile() {
    // Load user profile data from localStorage or API
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        try {
            userProfile = JSON.parse(savedProfile);
        } catch (error) {
            console.error('Error parsing user profile:', error);
            // Use default profile if parsing fails
        }
    }

    // Update profile display
    updateProfileDisplay();
}

function updateProfileDisplay() {
    const nameEl = document.getElementById('profileName');
    const roleEl = document.getElementById('profileRole');

    if (nameEl) nameEl.textContent = userProfile.name;
    if (roleEl) roleEl.textContent = `Verified ${userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}`;

    // Update form fields if they exist
    updateFormField('input[value="Rajesh Kumar"]', userProfile.name);
    updateFormField('input[value="rajesh.kumar@example.com"]', userProfile.email);
    updateFormField('input[value="+91 98765 43210"]', userProfile.phone);
    updateFormField('input[value="25"]', userProfile.farmSize);

    // Update statistics
    updateStatCard(0, userProfile.totalTrades);
    updateStatCard(1, `₹${(userProfile.totalRevenue / 100000).toFixed(1)}L`);
    updateStatCard(2, userProfile.rating);
    updateStatCard(3, `${userProfile.successRate}%`);
}

function updateFormField(selector, value) {
    const field = document.querySelector(selector);
    if (field) field.value = value;
}

function updateStatCard(index, value) {
    const statCards = document.querySelectorAll('.stat-value');
    if (statCards[index]) statCards[index].textContent = value;
}

function setupProfileEventListeners() {
    // Add event listeners for profile forms
    const profileForms = document.querySelectorAll('.profile-form');
    profileForms.forEach(form => {
        form.addEventListener('submit', handleProfileUpdate);
    });
}

function handleProfileUpdate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Update userProfile object with form data
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const farmSize = formData.get('farmSize');

    if (name) userProfile.name = name;
    if (email) userProfile.email = email;
    if (phone) userProfile.phone = phone;
    if (farmSize) userProfile.farmSize = farmSize;

    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(userProfile));

    // Show success message
    showNotification('Profile updated successfully!', 'success');
}

// Language handling is now managed by js/language-selector.js
// function showLanguageOptions() { ... } - Removed
// function changeLanguage(lang) { ... } - Removed

function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remove active class from all tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));

    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) selectedTab.classList.add('active');

    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }
}





function initializeVerificationPage() {
    const role = localStorage.getItem('userRole');
    const farmerCard = document.getElementById('farmerVerificationCard');
    const buyerCard = document.getElementById('buyerVerificationCard');

    if (farmerCard && buyerCard) {
        if (role === 'farmer') {
            farmerCard.style.display = 'block';
            buyerCard.style.display = 'none';
        } else if (role === 'buyer') {
            farmerCard.style.display = 'none';
            buyerCard.style.display = 'block';
        } else {
            // Show both if not logged in (or default behavior)
            farmerCard.style.display = 'block';
            buyerCard.style.display = 'block';
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    const cropForm = document.querySelector('.crop-form');
    if (cropForm) {
        cropForm.addEventListener('submit', handleCropListing);
    }

    const procurementForm = document.querySelector('.procurement-form');
    if (procurementForm) {
        procurementForm.addEventListener('submit', handleProcurementOrder);
    }

    const cropSelect = document.getElementById('cropSelect');
    if (cropSelect) {
        cropSelect.addEventListener('change', updatePriceWidget);
    }
}



// Dashboard functions for trade page
function showDashboard(type) {
    const farmerDashboard = document.getElementById('farmerDashboard');
    const buyerDashboard = document.getElementById('buyerDashboard');

    if (farmerDashboard && buyerDashboard) {
        if (type === 'farmer') {
            farmerDashboard.classList.remove('hidden');
            buyerDashboard.classList.add('hidden');
        } else {
            buyerDashboard.classList.remove('hidden');
            farmerDashboard.classList.add('hidden');
        }
    }
}

function closeDashboard() {
    const farmerDashboard = document.getElementById('farmerDashboard');
    const buyerDashboard = document.getElementById('buyerDashboard');
    if (farmerDashboard) farmerDashboard.classList.add('hidden');
    if (buyerDashboard) buyerDashboard.classList.add('hidden');
}

// Price chart initialization
// Price chart initialization
function initializePriceChart(timeframe = '1M') {
    const canvas = document.getElementById('priceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Unable to get canvas context');
        return;
    }

    // Generate data based on timeframe
    const labels = [];
    const wheatData = [];
    const riceData = [];
    const cottonData = [];

    let points = 30;
    let labelFormat = 'date'; // date or time

    switch (timeframe) {
        case '1D':
            points = 24; // Hourly
            labelFormat = 'time';
            break;
        case '7D':
            points = 7; // Daily
            break;
        case '1M':
            points = 30; // Daily
            break;
        case '3M':
            points = 90; // Daily
            break;
    }

    for (let i = points - 1; i >= 0; i--) {
        if (labelFormat === 'time') {
            // Generate time labels for 1D (e.g., 10:00, 11:00)
            const d = new Date();
            d.setHours(d.getHours() - i);
            d.setMinutes(0);
            labels.push(`${d.getHours()}:00`);
        } else {
            // Generate date labels
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
        }

        // Logic for Strong Trends and High Fluctuation
        // i goes from High (Oldest) to 0 (Recent)
        const progress = (points - 1 - i) / (points - 1); // 0 (start) to 1 (end/today)

        // Volatility Factors
        const volatility = timeframe === '1D' ? 50 : 300;
        const randomFluctuation = () => (Math.random() - 0.5) * volatility;

        // Dataset 1: Wheat - Strong Uptrend (approx 3000 -> 4000)
        // Base calculation: Start at 3000, end at 4000.
        // Formula: 3000 + (1000 * progress) + curve
        let wheatBase = 3000 + (progress * 1000);
        // Add curve: steepen at end
        wheatBase += (progress * progress) * 200;
        wheatData.push(Math.round(wheatBase + randomFluctuation()));

        // Dataset 2: Rice - Downtrend (2500 -> 1800)
        let riceBase = 2500 - (progress * 700);
        riceData.push(Math.round(riceBase + randomFluctuation()));

        // Dataset 3: Cotton - Highly Volatile Wave
        // Base around 5500 with massive swings
        let cottonBase = 5500 + Math.sin(progress * Math.PI * 4) * 500;
        cottonData.push(Math.round(cottonBase + (randomFluctuation() * 1.5)));
    }

    // Simple chart drawing
    drawChart(ctx, canvas, labels, [
        { label: 'Wheat', data: wheatData, color: '#4CAF50' },
        { label: 'Rice', data: riceData, color: '#2196F3' },
        { label: 'Cotton', data: cottonData, color: '#FF9800' }
    ]);
}

function changeTimeframe(timeframe, btn) {
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(b => b.classList.remove('active'));

    if (btn) {
        btn.classList.add('active');
    }

    initializePriceChart(timeframe);
}

function drawChart(ctx, canvas, labels, datasets) {
    const padding = 60;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Find min and max values
    let minValue = Infinity;
    let maxValue = -Infinity;

    datasets.forEach(dataset => {
        dataset.data.forEach(value => {
            minValue = Math.min(minValue, value);
            maxValue = Math.max(maxValue, value);
        });
    });

    const valueRange = maxValue - minValue || 1; // Prevent division by zero

    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
        const x = padding + (chartWidth / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + chartHeight);
        ctx.stroke();
    }

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
    }

    // Draw datasets
    datasets.forEach(dataset => {
        ctx.strokeStyle = dataset.color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        dataset.data.forEach((value, index) => {
            const x = padding + (chartWidth / (dataset.data.length - 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
    });

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
        const value = minValue + (valueRange / 5) * (5 - i);
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText('₹' + Math.round(value), padding - 30, y + 4);
    }
}

// Market data updates
function updateMarketData() {
    // Simulate real-time price changes
    Object.keys(marketData).forEach(crop => {
        const change = (Math.random() - 0.5) * 2; // -1% to +1%
        marketData[crop].price += marketData[crop].price * (change / 100);
        marketData[crop].change = change;
        marketData[crop].price = Math.round(marketData[crop].price);
    });

    updatePriceTicker();
    updateMarketCards();
}

function updatePriceTicker() {
    const tickerItems = document.querySelectorAll('.ticker-item');
    const crops = ['wheat', 'rice', 'cotton'];

    tickerItems.forEach((item, index) => {
        if (crops[index] && marketData[crops[index]]) {
            const data = marketData[crops[index]];
            const priceElement = item.querySelector('.price');
            const changeElement = item.querySelector('.change');

            if (priceElement && changeElement) {
                priceElement.textContent = `₹${data.price}`;
                changeElement.textContent = `${data.change > 0 ? '+' : ''}${data.change.toFixed(1)}%`;

                if (data.change > 0) {
                    priceElement.className = 'price up';
                    changeElement.style.background = 'rgba(76, 175, 80, 0.2)';
                    changeElement.style.color = '#4CAF50';
                } else {
                    priceElement.className = 'price down';
                    changeElement.style.background = 'rgba(244, 67, 54, 0.2)';
                    changeElement.style.color = '#f44336';
                }
            }
        }
    });
}

function updateMarketCards() {
    // Update Agri Index
    const indexElement = document.querySelector('.index-value');
    if (indexElement) {
        const avgChange = Object.values(marketData).reduce((sum, crop) => sum + crop.change, 0) / Object.keys(marketData).length;
        const indexValue = 2847.50 + (avgChange * 10);
        indexElement.innerHTML = `${indexValue.toFixed(2)} <span>${avgChange > 0 ? '+' : ''}${avgChange.toFixed(1)}%</span>`;
        indexElement.className = avgChange > 0 ? 'index-value up' : 'index-value down';
    }

    // Update volume
    const volumeElement = document.querySelector('.volume-value');
    if (volumeElement) {
        const totalVolume = Object.values(marketData).reduce((sum, crop) => sum + crop.volume, 0) / 100;
        volumeElement.textContent = `₹${totalVolume.toFixed(1)}`;
    }
}

function populateCropsTable() {
    const tbody = document.getElementById('cropsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    Object.entries(marketData).forEach(([crop, data]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${crop.charAt(0).toUpperCase() + crop.slice(1)}</td>
            <td>₹${data.price}</td>
            <td class="${data.change > 0 ? 'up' : 'down'}">${data.change > 0 ? '+' : ''}${data.change.toFixed(1)}%</td>
            <td>${data.volume}</td>
            <td><button class="btn-primary" onclick="tradeCrop('${crop}')">Trade</button></td>
        `;
        tbody.appendChild(row);
    });
}

function populateAvailableCrops() {
    const container = document.getElementById('availableCrops');
    if (!container) return;

    container.innerHTML = '';

    // Sample available crops from farmers
    const availableCrops = [
        { name: 'Wheat', farmer: 'Rajesh Kumar', quantity: 50, price: 2150, location: 'Punjab' },
        { name: 'Rice', farmer: 'Suresh Patel', quantity: 30, price: 1890, location: 'Haryana' },
        { name: 'Cotton', farmer: 'Mohan Singh', quantity: 25, price: 5670, location: 'Gujarat' },
        { name: 'Sugarcane', farmer: 'Ramesh Yadav', quantity: 100, price: 3200, location: 'UP' }
    ];

    availableCrops.forEach(crop => {
        const cropElement = document.createElement('div');
        cropElement.className = 'crop-item';
        cropElement.innerHTML = `
            <h4>${crop.name}</h4>
            <div class="crop-price">₹${crop.price}/quintal</div>
            <div class="crop-quantity">${crop.quantity} quintals available</div>
            <div class="crop-farmer">Farmer: ${crop.farmer}</div>
            <div class="crop-location">Location: ${crop.location}</div>
            <button onclick="contactFarmer('${crop.farmer}', '${crop.name}')">Contact Farmer</button>
        `;
        container.appendChild(cropElement);
    });
}

// Event handlers
function handleCropListing(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const location = formData.get('address') || 'Unknown';
    const pincode = formData.get('pincode') || 'N/A';
    const cropType = formData.get('cropType') || 'Unknown';
    const quantity = formData.get('quantity') || '0';

    // Show success message
    showNotification(`Crop listed successfully! ${cropType} (${quantity} quintals) for location: ${location} (${pincode}). You will be notified when buyers show interest.`, 'success');

    e.target.reset();
}

function handleProcurementOrder(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pincode = formData.get('pincode') || 'N/A';
    const cropType = formData.get('cropType') || 'Unknown';
    const quantity = formData.get('quantity') || '0';

    // Show success message
    showNotification(`Bulk order created for ${cropType} (${quantity} quintals) in Pincode: ${pincode}! Matching farmers in this area will be contacted.`, 'success');

    e.target.reset();
}

function updatePriceWidget() {
    const select = document.getElementById('cropSelect');
    if (!select) return;

    const selectedCrop = select.value;
    const data = marketData[selectedCrop];

    if (data) {
        const priceElement = document.querySelector('.current-price');
        const predictionElement = document.querySelector('.prediction-value');

        if (priceElement) {
            priceElement.textContent = `₹${data.price}/quintal`;
        }

        if (predictionElement) {
            const prediction = data.price * (1 + (Math.random() * 0.1 - 0.05)); // ±5% prediction
            const change = ((prediction - data.price) / data.price) * 100;
            predictionElement.innerHTML = `₹${Math.round(prediction)} (${change > 0 ? '+' : ''}${change.toFixed(1)}%)`;
            predictionElement.className = change > 0 ? 'prediction-value up' : 'prediction-value down';
        }
    }
}





function tradeCrop(crop) {
    // Show success message
    showNotification(`Opening trade interface for ${crop}. Redirecting to trade page...`, 'info');
    setTimeout(() => {
        window.location.href = 'trade.html';
    }, 2000);
}

function contactFarmer(farmer, crop) {
    // Show success message
    showNotification(`Connecting you with ${farmer} for ${crop}. Contact details will be shared via SMS.`, 'success');
}

// Real-time updates
function startRealTimeUpdates() {
    setInterval(() => {
        updateMarketData();
        if (document.getElementById('cropsTableBody')) {
            populateCropsTable();
        }
    }, 30000);

    setInterval(() => {
        updatePriceTicker();
    }, 5000);
}

// Export functions for global access
window.showDashboard = showDashboard;
window.closeDashboard = closeDashboard;
window.changeTimeframe = changeTimeframe;
window.tradeCrop = tradeCrop;
window.contactFarmer = contactFarmer;
window.showTab = showTab;
window.updateProfileDisplay = updateProfileDisplay;
window.handleProfileUpdate = handleProfileUpdate;
window.showLanguageOptions = showLanguageOptions;
window.changeLanguage = changeLanguage;

// Logout function
function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('selectedLanguage');
    window.location.href = 'login.html';
}

// Navigate to live market
function goToLiveMarket() {
    window.location.href = 'market.html';
}

window.logout = logout;
window.goToLiveMarket = goToLiveMarket;
// Rice-specific dashboard functions
function updateRiceData() {
    const riceSelect = document.getElementById('riceSelect');
    if (!riceSelect) return;

    const selectedRice = riceSelect.value;
    const riceData = {
        basmati: { price: 1890, change: 25, changePercent: 1.3 },
        'non-basmati': { price: 1650, change: -15, changePercent: -0.9 },
        'brown-rice': { price: 2100, change: 35, changePercent: 1.7 }
    };

    const data = riceData[selectedRice];
    if (data) {
        document.getElementById('currentRicePrice').textContent = `₹${data.price}`;
        document.getElementById('ricePriceChange').textContent = `${data.change > 0 ? '+' : ''}₹${Math.abs(data.change)} (${data.changePercent > 0 ? '+' : ''}${data.changePercent}%)`;
    }
}

function refreshRicePrices() {
    showNotification('Rice prices refreshed successfully!', 'success');
    updateRiceData();
}

function showRiceTrends() {
    showNotification('Opening rice market trends...', 'info');
}

function setRiceAlert() {
    showNotification('Rice price alert set successfully!', 'success');
}

function subscribeRiceAlerts() {
    showNotification('Subscribed to rice farming alerts!', 'success');
}

function viewRiceForecast() {
    showNotification('Opening detailed rice farming forecast...', 'info');
}

// Initialize rice dashboard
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('riceSelect')) {
        updateRiceData();
    }
});