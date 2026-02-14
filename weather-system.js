// Enhanced Weather System for India
class WeatherSystem {
    constructor() {
        this.indianStates = {
            'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati'],
            'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tezpur', 'Bomdila'],
            'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia'],
            'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga'],
            'Chhattisgarh': ['Raipur', 'Bhilai', 'Korba', 'Bilaspur', 'Durg', 'Rajnandgaon'],
            'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
            'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar'],
            'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar'],
            'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Manali'],
            'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh'],
            'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davangere'],
            'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad'],
            'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas'],
            'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur'],
            'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur'],
            'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongpoh'],
            'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai'],
            'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang'],
            'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri'],
            'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'],
            'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara'],
            'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan'],
            'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
            'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar'],
            'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailashahar'],
            'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad'],
            'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Kashipur'],
            'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda'],
            'Delhi': ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi']
        };
        
        this.weatherData = this.generateWeatherData();
        this.init();
    }

    init() {
        this.setupLocationSearch();
        this.setupWeatherDisplay();
        this.loadDefaultWeather();
    }

    generateWeatherData() {
        const data = {};
        Object.keys(this.indianStates).forEach(state => {
            data[state] = {};
            this.indianStates[state].forEach(city => {
                data[state][city] = this.generateCityWeather(city, state);
            });
        });
        return data;
    }

    generateCityWeather(city, state) {
        // Generate realistic weather data based on Indian climate patterns
        const baseTemp = this.getBaseTemperature(state);
        const season = this.getCurrentSeason();
        
        return {
            current: {
                temperature: baseTemp + (Math.random() * 10 - 5),
                condition: this.getWeatherCondition(season, state),
                humidity: 60 + Math.random() * 30,
                windSpeed: 5 + Math.random() * 15,
                pressure: 1010 + Math.random() * 20,
                visibility: 8 + Math.random() * 7
            },
            forecast: this.generateForecast(baseTemp, season),
            alerts: this.generateAlerts(season, state),
            recommendations: this.generateRecommendations(season, state)
        };
    }

    getBaseTemperature(state) {
        const tempMap = {
            'Rajasthan': 35, 'Gujarat': 32, 'Maharashtra': 30,
            'Tamil Nadu': 28, 'Karnataka': 26, 'Kerala': 27,
            'Himachal Pradesh': 15, 'Uttarakhand': 18, 'Kashmir': 12,
            'Punjab': 25, 'Haryana': 26, 'Uttar Pradesh': 28,
            'Bihar': 30, 'West Bengal': 29, 'Odisha': 31,
            'Assam': 26, 'Meghalaya': 22, 'Manipur': 24
        };
        return tempMap[state] || 28;
    }

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 5) return 'summer';
        if (month >= 6 && month <= 9) return 'monsoon';
        return 'winter';
    }

    getWeatherCondition(season, state) {
        const conditions = {
            summer: ['Sunny', 'Hot', 'Clear', 'Partly Cloudy'],
            monsoon: ['Rainy', 'Cloudy', 'Heavy Rain', 'Thunderstorm'],
            winter: ['Clear', 'Cool', 'Foggy', 'Pleasant']
        };
        
        const seasonConditions = conditions[season];
        return seasonConditions[Math.floor(Math.random() * seasonConditions.length)];
    }

    generateForecast(baseTemp, season) {
        const forecast = [];
        for (let i = 0; i < 7; i++) {
            forecast.push({
                day: this.getDayName(i),
                temperature: baseTemp + (Math.random() * 8 - 4),
                condition: this.getWeatherCondition(season),
                humidity: 50 + Math.random() * 40,
                rainChance: season === 'monsoon' ? 60 + Math.random() * 30 : Math.random() * 40
            });
        }
        return forecast;
    }

    generateAlerts(season, state) {
        const alerts = [];
        
        if (season === 'summer') {
            alerts.push({
                type: 'warning',
                title: 'Heat Wave Alert',
                message: 'High temperatures expected. Ensure adequate irrigation.',
                icon: 'fas fa-thermometer-full'
            });
        }
        
        if (season === 'monsoon') {
            alerts.push({
                type: 'info',
                title: 'Monsoon Update',
                message: 'Heavy rainfall expected in next 48 hours.',
                icon: 'fas fa-cloud-rain'
            });
        }
        
        return alerts;
    }

    generateRecommendations(season, state) {
        const recommendations = [];
        
        if (season === 'summer') {
            recommendations.push({
                type: 'irrigation',
                title: 'Increase Irrigation',
                items: ['Water crops early morning', 'Use drip irrigation', 'Mulch around plants']
            });
        }
        
        if (season === 'monsoon') {
            recommendations.push({
                type: 'drainage',
                title: 'Drainage Management',
                items: ['Clear drainage channels', 'Harvest rainwater', 'Prevent waterlogging']
            });
        }
        
        return recommendations;
    }

    setupLocationSearch() {
        const searchInput = document.getElementById('locationSearch');
        const stateSelect = document.getElementById('stateSelect');
        const citySelect = document.getElementById('citySelect');
        
        if (stateSelect) {
            // Populate state dropdown
            Object.keys(this.indianStates).forEach(state => {
                const option = document.createElement('option');
                option.value = state;
                option.textContent = state;
                stateSelect.appendChild(option);
            });
            
            stateSelect.addEventListener('change', (e) => {
                this.updateCityOptions(e.target.value);
            });
        }
        
        if (citySelect) {
            citySelect.addEventListener('change', (e) => {
                const state = stateSelect.value;
                const city = e.target.value;
                if (state && city) {
                    this.displayWeather(state, city);
                }
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    updateCityOptions(state) {
        const citySelect = document.getElementById('citySelect');
        if (!citySelect || !state) return;
        
        citySelect.innerHTML = '<option value="">Select City</option>';
        
        if (this.indianStates[state]) {
            this.indianStates[state].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
    }

    handleSearch(query) {
        if (query.length < 2) return;
        
        const results = [];
        Object.keys(this.indianStates).forEach(state => {
            this.indianStates[state].forEach(city => {
                if (city.toLowerCase().includes(query.toLowerCase()) || 
                    state.toLowerCase().includes(query.toLowerCase())) {
                    results.push({ state, city });
                }
            });
        });
        
        this.displaySearchResults(results.slice(0, 5));
    }

    displaySearchResults(results) {
        const container = document.getElementById('searchResults');
        if (!container) return;
        
        container.innerHTML = '';
        results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `${result.city}, ${result.state}`;
            item.addEventListener('click', () => {
                this.displayWeather(result.state, result.city);
                container.innerHTML = '';
            });
            container.appendChild(item);
        });
    }

    displayWeather(state, city) {
        const weatherData = this.weatherData[state]?.[city];
        if (!weatherData) {
            this.showError(`Weather data not available for ${city}, ${state}`);
            return;
        }
        
        this.updateCurrentWeather(weatherData.current, city, state);
        this.updateForecast(weatherData.forecast);
        this.updateAlerts(weatherData.alerts);
        this.updateRecommendations(weatherData.recommendations);
    }

    updateCurrentWeather(current, city, state) {
        const elements = {
            temperature: document.querySelector('.temperature h1'),
            condition: document.querySelector('.weather-condition'),
            location: document.querySelector('.location-info'),
            humidity: document.querySelector('[data-weather="humidity"]'),
            windSpeed: document.querySelector('[data-weather="wind"]'),
            pressure: document.querySelector('[data-weather="pressure"]'),
            visibility: document.querySelector('[data-weather="visibility"]')
        };
        
        if (elements.temperature) elements.temperature.textContent = `${Math.round(current.temperature)}°C`;
        if (elements.condition) elements.condition.textContent = current.condition;
        if (elements.location) elements.location.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${city}, ${state}`;
        if (elements.humidity) elements.humidity.innerHTML = `<span>${Math.round(current.humidity)}%</span><small>Humidity</small>`;
        if (elements.windSpeed) elements.windSpeed.innerHTML = `<span>${Math.round(current.windSpeed)} km/h</span><small>Wind Speed</small>`;
        if (elements.pressure) elements.pressure.innerHTML = `<span>${Math.round(current.pressure)} mb</span><small>Pressure</small>`;
        if (elements.visibility) elements.visibility.innerHTML = `<span>${Math.round(current.visibility)} km</span><small>Visibility</small>`;
    }

    updateForecast(forecast) {
        const container = document.querySelector('.forecast-grid');
        if (!container) return;
        
        container.innerHTML = '';
        forecast.slice(0, 6).forEach(day => {
            const item = document.createElement('div');
            item.className = 'forecast-item';
            item.innerHTML = `
                <span class="forecast-time">${day.day}</span>
                <i class="fas fa-${this.getWeatherIcon(day.condition)}"></i>
                <span class="forecast-temp">${Math.round(day.temperature)}°C</span>
            `;
            container.appendChild(item);
        });
    }

    updateAlerts(alerts) {
        const container = document.querySelector('.weather-alerts-column');
        if (!container) return;
        
        container.innerHTML = '';
        alerts.forEach(alert => {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert-card alert-${alert.type}`;
            alertDiv.innerHTML = `
                <div class="alert-header">
                    <i class="${alert.icon}"></i>
                    <h3>${alert.title}</h3>
                </div>
                <p>${alert.message}</p>
            `;
            container.appendChild(alertDiv);
        });
    }

    updateRecommendations(recommendations) {
        const container = document.querySelector('.recommendations-list');
        if (!container) return;
        
        container.innerHTML = '';
        recommendations.forEach(rec => {
            const recDiv = document.createElement('div');
            recDiv.className = `rec-item ${rec.type}`;
            recDiv.innerHTML = `
                <div class="rec-icon">
                    <i class="fas fa-${this.getRecommendationIcon(rec.type)}"></i>
                </div>
                <div class="rec-content">
                    <h4>${rec.title}</h4>
                    <ul>
                        ${rec.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
            container.appendChild(recDiv);
        });
    }

    getWeatherIcon(condition) {
        const iconMap = {
            'Sunny': 'sun',
            'Clear': 'sun',
            'Cloudy': 'cloud',
            'Rainy': 'cloud-rain',
            'Thunderstorm': 'bolt',
            'Foggy': 'smog',
            'Hot': 'thermometer-full'
        };
        return iconMap[condition] || 'cloud';
    }

    getRecommendationIcon(type) {
        const iconMap = {
            'irrigation': 'tint',
            'drainage': 'water',
            'pest': 'bug',
            'harvest': 'cut',
            'planting': 'seedling'
        };
        return iconMap[type] || 'leaf';
    }

    getDayName(offset) {
        const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
        return days[offset] || `Day ${offset + 1}`;
    }

    loadDefaultWeather() {
        // Load weather for Delhi by default
        this.displayWeather('Delhi', 'New Delhi');
    }

    setupWeatherDisplay() {
        const getDataBtn = document.querySelector('.btn-get-data');
        if (getDataBtn) {
            getDataBtn.addEventListener('click', () => {
                const state = document.getElementById('stateSelect')?.value;
                const city = document.getElementById('citySelect')?.value;
                
                if (state && city) {
                    this.displayWeather(state, city);
                } else {
                    this.showError('Please select both state and city');
                }
            });
        }
    }

    showError(message) {
        const notification = document.createElement('div');
        notification.className = 'weather-notification error';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Initialize weather system
document.addEventListener('DOMContentLoaded', () => {
    new WeatherSystem();
});