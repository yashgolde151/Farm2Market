// Yield Predictor System
class YieldPredictor {
    constructor() {
        this.cropData = {
            wheat: { baseYield: 15, minRainfall: 50, maxRainfall: 200, optimalTemp: 22 },
            rice: { baseYield: 18, minRainfall: 100, maxRainfall: 300, optimalTemp: 28 },
            cotton: { baseYield: 12, minRainfall: 60, maxRainfall: 180, optimalTemp: 30 },
            sugarcane: { baseYield: 80, minRainfall: 150, maxRainfall: 400, optimalTemp: 32 },
            soybean: { baseYield: 10, minRainfall: 70, maxRainfall: 220, optimalTemp: 25 }
        };
        this.init();
    }

    init() {
        this.setupYieldPredictor();
    }

    setupYieldPredictor() {
        const predictButton = document.querySelector('.yield-predictor button');
        const cropSelect = document.querySelector('.yield-predictor select');
        const rainfallSlider = document.querySelector('.yield-predictor input[type="range"]');
        const resultDisplay = document.querySelector('.result-display-green');

        if (predictButton) {
            predictButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.calculateYield();
            });
        }

        if (rainfallSlider) {
            rainfallSlider.addEventListener('input', (e) => {
                const sliderValue = document.querySelector('.slider-value');
                if (sliderValue) {
                    sliderValue.textContent = `${e.target.value} mm`;
                }
            });
        }
    }

    calculateYield() {
        try {
            const cropSelect = document.querySelector('.yield-predictor select');
            const rainfallSlider = document.querySelector('.yield-predictor input[type="range"]');
            const resultDisplay = document.querySelector('.result-display-green');

            if (!cropSelect || !rainfallSlider || !resultDisplay) {
                this.showError('Yield predictor components not found');
                return;
            }

            const selectedCrop = cropSelect.value.toLowerCase();
            const rainfall = parseInt(rainfallSlider.value);

            // Validate inputs
            if (!selectedCrop || !this.cropData[selectedCrop]) {
                this.showError('Please select a valid crop');
                return;
            }

            if (isNaN(rainfall) || rainfall < 0 || rainfall > 500) {
                this.showError('Please enter valid rainfall data (0-500mm)');
                return;
            }

            // Calculate yield
            const cropInfo = this.cropData[selectedCrop];
            let predictedYield = cropInfo.baseYield;

            // Rainfall factor
            if (rainfall < cropInfo.minRainfall) {
                predictedYield *= (0.5 + (rainfall / cropInfo.minRainfall) * 0.4);
            } else if (rainfall > cropInfo.maxRainfall) {
                predictedYield *= (1.0 - ((rainfall - cropInfo.maxRainfall) / 100) * 0.1);
            } else {
                predictedYield *= (0.9 + ((rainfall - cropInfo.minRainfall) / (cropInfo.maxRainfall - cropInfo.minRainfall)) * 0.2);
            }

            // Add some randomness for realistic prediction
            predictedYield *= (0.9 + Math.random() * 0.2);
            predictedYield = Math.max(0, predictedYield);

            // Display result
            resultDisplay.innerHTML = `
                <h2>${predictedYield.toFixed(1)} <span>Quintals</span></h2>
                <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.8;">
                    Based on ${rainfall}mm rainfall for ${selectedCrop}
                </div>
            `;
            resultDisplay.style.display = 'block';

            this.showSuccess(`Yield predicted successfully for ${selectedCrop}`);

        } catch (error) {
            this.showError('Error calculating yield: ' + error.message);
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.yield-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `yield-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;

        if (type === 'error') {
            notification.style.background = '#f44336';
        } else if (type === 'success') {
            notification.style.background = '#4CAF50';
        } else {
            notification.style.background = '#2196F3';
        }

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Initialize yield predictor
document.addEventListener('DOMContentLoaded', () => {
    new YieldPredictor();
});

// Add CSS animations
const style = document.createElement('style');
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