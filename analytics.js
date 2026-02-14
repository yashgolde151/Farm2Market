// Analytics Dashboard Logic

document.addEventListener('DOMContentLoaded', function () {
    initializeTrendChart();
    initializeDemandGrid();
    initializeMarketDemandChart();
    initializeHistoricalChart();
    setupInteractivity();
});

// ===== NEW ANALYTICS FUNCTIONS =====

function initializeDemandGrid() {
    const grid = document.getElementById('demandGrid');
    if (!grid) return;

    // Color coding for demand heatmap
    const demandData = [
        { value: 18, color: '#2e7d32', crop: 'Wheat' },
        { value: 20, color: '#2e7d32', crop: 'Wheat' },
        { value: 22, color: '#2e7d32', crop: 'Wheat' },
        { value: 22, color: '#2e7d32', crop: 'Wheat' },
        { value: 22, color: '#f9a825', crop: 'Rice' },
        { value: 22, color: '#f9a825', crop: 'Rice' },
        { value: 24, color: '#f9a825', crop: 'Rice' },
        { value: 22, color: '#f9a825', crop: 'Rice' },
        { value: 22, color: '#f9a825', crop: 'Rice' },
        { value: 22, color: '#d32f2f', crop: 'Soybean' },
        { value: 24, color: '#d32f2f', crop: 'Soybean' },
        { value: 22, color: '#d32f2f', crop: 'Soybean' },
        { value: 16, color: '#4CAF50', crop: 'Maize' },
        { value: 16, color: '#4CAF50', crop: 'Maize' },
        { value: 14, color: '#4CAF50', crop: 'Maize' },
        { value: 16, color: '#4CAF50', crop: 'Maize' }
    ];

    grid.innerHTML = '';
    demandData.forEach((item, index) => {
        const cell = document.createElement('div');
        cell.className = 'demand-cell';
        cell.textContent = item.value;
        cell.style.backgroundColor = item.color;
        cell.title = `${item.crop}: ${item.value}`;
        grid.appendChild(cell);
    });
}

function initializeMarketDemandChart() {
    const canvas = document.getElementById('marketDemandChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const crops = ['Wheat', 'Rice', 'Cotton', 'Soybean', 'Maize'];
    const demands = [32, 21, 17, 16, 14];
    const colors = ['#d32f2f', '#2e7d32', '#f9a825', '#9c27b0', '#2196f3'];

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const barWidth = canvasWidth / crops.length;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw bars and labels
    demands.forEach((demand, index) => {
        const x = index * barWidth + barWidth * 0.1;
        const barHeight = (demand / 32) * (canvasHeight * 0.8);
        const y = canvasHeight - barHeight - 30;

        // Draw bar
        ctx.fillStyle = colors[index];
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);

        // Draw percentage text
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(demand + '%', x + barWidth * 0.4, y - 10);

        // Draw crop name
        ctx.fillStyle = '#666';
        ctx.font = '12px Inter';
        ctx.fillText(crops[index], x + barWidth * 0.4, canvasHeight - 5);
    });
}

function initializeHistoricalChart() {
    const canvas = document.getElementById('historicalChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = [2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2550, 2600, 2650];

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const spacing = canvasWidth / (data.length + 1);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvasHeight; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasWidth, i);
        ctx.stroke();
    }

    // Calculate points
    const minPrice = Math.min(...data);
    const maxPrice = Math.max(...data);
    const priceRange = maxPrice - minPrice || 1;
    const pointHeight = canvasHeight * 0.8;

    const points = data.map((price, i) => ({
        x: spacing * (i + 1),
        y: canvasHeight - 30 - ((price - minPrice) / priceRange) * pointHeight
    }));

    // Draw line
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#1565C0';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#666';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    months.forEach((month, i) => {
        ctx.fillText(month, points[i].x, canvasHeight - 5);
    });
}

function initializeTrendChart() {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const data = [2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2550];
    const canvasWidth = canvas.width || 600;
    const canvasHeight = canvas.height || 300;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvasHeight; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasWidth, i);
        ctx.stroke();
    }

    const spacing = canvasWidth / (data.length + 1);
    const minPrice = 2000;
    const maxPrice = 2700;
    const priceRange = maxPrice - minPrice;
    const pointHeight = canvasHeight * 0.8;

    const points = data.map((price, i) => ({
        x: spacing * (i + 1),
        y: canvasHeight - 40 - ((price - minPrice) / priceRange) * pointHeight
    }));

    // Draw gradient
    const gradient = ctx.createLinearGradient(0, points[0].y, 0, canvasHeight);
    gradient.addColorStop(0, 'rgba(76, 175, 80, 0.3)');
    gradient.addColorStop(1, 'rgba(76, 175, 80, 0)');

    // Draw line
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Fill area
    ctx.lineTo(points[points.length - 1].x, canvasHeight - 20);
    ctx.lineTo(points[0].x, canvasHeight - 20);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw points
    ctx.fillStyle = '#2e7d32';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2e7d32';
    });

    // Draw labels
    ctx.fillStyle = '#666';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    const days = ['0', '500', '1000', '1500', '1700', '1800', '1900', '2050', '2100', '2200'];
    days.forEach((day, i) => {
        ctx.fillText(day, points[i].x, canvasHeight - 10);
    });
}

function setupInteractivity() {
    // ROI Calculator
    const roiBtn = document.querySelector('.btn-primary-full');
    if (roiBtn && roiBtn.textContent.includes('Calculate')) {
        roiBtn.addEventListener('click', calculateROI);
    }

    // Yield Predictor
    const yieldBtn = document.querySelectorAll('.btn-primary-full')[1];
    if (yieldBtn) {
        yieldBtn.addEventListener('click', predictYield);
    }

    // Simulator
    const simBtn = document.querySelector('.btn-orange-full');
    if (simBtn) {
        simBtn.addEventListener('click', simulateOutcome);
    }

    // Toggle group
    const toggleButtons = document.querySelectorAll('.toggle-group button');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function calculateROI() {
    const costInput = document.querySelector('input.modern-input');
    if (!costInput) return;

    const cost = 40000;
    const price = 2350;
    const yield_ = 15;

    const revenue = price * yield_;
    const profit = revenue - cost;
    const roi = ((profit / cost) * 100).toFixed(1);

    console.log(`ROI: ₹${profit}, ${roi}%`);
}

function predictYield() {
    console.log('Yield predicted: 14.5 Quintals');
}

function simulateOutcome() {
    console.log('Simulation: ₹2,450 Price/Qt');
}

// --- Existing Analytics Features ---

function initializePriceHeatmap() {
    const heatmap = document.getElementById('priceHeatmap');
    if (!heatmap) return;

    // Data provided by user
    const highDemand = ['UP', 'PB', 'HR', 'MH', 'MP'];
    const mediumDemand = ['RJ', 'GJ', 'KA', 'AP', 'TG'];
    const lowDemand = ['AS', 'JH', 'CG', 'HP', 'TR'];

    const allStates = [...highDemand, ...mediumDemand, ...lowDemand];

    heatmap.innerHTML = ''; // Clear existing

    allStates.forEach(state => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        cell.textContent = state;

        let color, category;

        if (highDemand.includes(state)) {
            color = '#2e7d32'; // Dark Green (High Demand = Good)
            category = 'High Demand';
        } else if (mediumDemand.includes(state)) {
            color = '#f9a825'; // Yellow/Orange
            category = 'Medium Demand';
        } else {
            color = '#e57373'; // Red (Low Demand)
            category = 'Low Demand';
        }

        cell.style.background = color;
        cell.title = `${category}: ${state}`;

        cell.addEventListener('click', function () {
            alert(`Market Insight for ${state}:\nCategory: ${category}\nTrend: ${highDemand.includes(state) ? 'Strong Buying Pressure' : 'Moderate/Low Activity'}`);
        });

        heatmap.appendChild(cell);
    });
}
        const barHeight = (demands[index] / 100) * 150;
        const x = 50 + index * 70;
        const y = 180 - barHeight;

        ctx.fillStyle = colors[index];

        // Rounded corners for bars
        ctx.beginPath();
        ctx.roundRect(x, y, 40, barHeight, [5, 5, 0, 0]);
        ctx.fill();

        // Add labels
        ctx.fillStyle = '#555';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(crop, x + 20, 200);
        ctx.fillText(demands[index] + '%', x + 20, y - 10);
    });
}

function initializeReplayChart() {
    // Auto-start the replay with default values (Wheat 2023)
    // Small delay to ensure canvas is ready if needed, though strictly not necessary with DOMContentLoaded
    setTimeout(() => {
        startReplay();
    }, 100);
}

function runSimulation() {
    const crop = document.getElementById('simulatorCrop').value;
    const days = document.getElementById('waitDays').value;
    const result = document.getElementById('simulationResult');

    // Smarter simulation logic
    const currentPrice = 2150;
    const volatility = Math.random() * 0.1 - 0.05; // ±5%
    // Trend varies by crop
    let trend = 0.02;
    if (crop === 'cotton') trend = 0.05; // Higher volatility
    if (crop === 'rice') trend = -0.01; // Slight dip

    const predictedPrice = currentPrice * (1 + (trend * (days / 7)) + volatility);
    const change = ((predictedPrice - currentPrice) / currentPrice) * 100;

    let recommendation = '';
    let color = '';

    if (change > 3) {
        recommendation = 'Strong Buy Signal / Wait to Sell';
        color = '#2e7d32'; // Dark Green
    } else if (change > 0) {
        recommendation = 'Hold';
        color = '#4CAF50';
    } else if (change < -3) {
        recommendation = 'Sell Immediately';
        color = '#d32f2f'; // Red
    } else {
        recommendation = 'Market Neutral';
        color = '#f57c00'; // Orange
    }

    result.style.display = 'block';
    result.innerHTML = `
        <div style="border-left: 4px solid ${color}; padding-left: 1rem;">
            <strong>Analysis Result:</strong><br>
            Expected Price after ${days} days: <strong>₹${Math.round(predictedPrice)}</strong> 
            <span style="color: ${color}; font-weight: bold;">(${change > 0 ? '+' : ''}${change.toFixed(1)}%)</span><br>
            <span style="font-size: 0.9rem; color: #555;">Recommendation: ${recommendation}</span>
        </div>
    `;
}

function startReplay() {
    const year = document.getElementById('replayYear').value;
    const crop = document.getElementById('replayCrop').value;

    // Realistic monthly average data points (simulated for realism)
    const historyData = {
        '2023': {
            'wheat': [2200, 2150, 2100, 2250, 2300, 2350, 2400, 2450, 2420, 2480, 2500, 2550],
            'rice': [3000, 3050, 3100, 3080, 3060, 3040, 3020, 3000, 2980, 2950, 2920, 2900],
            'cotton': [6000, 6200, 6100, 6300, 6500, 6600, 6800, 6700, 6500, 6600, 6700, 6800],
            'sugarcane': [280, 285, 290, 295, 300, 305, 310, 315, 310, 305, 300, 295],
            'maize': [1800, 1850, 1900, 1950, 2000, 2050, 2100, 2050, 2000, 1950, 1900, 1850],
            'soybean': [4000, 4100, 4200, 4300, 4400, 4500, 4600, 4550, 4500, 4400, 4300, 4200],
            'mustard': [4500, 4600, 4700, 4800, 4900, 5000, 5100, 5000, 4900, 4800, 4700, 4600],
            'groundnut': [5000, 5100, 5200, 5300, 5400, 5500, 5600, 5550, 5500, 5400, 5300, 5200],
            'gram': [4800, 4900, 5000, 5100, 5200, 5300, 5400, 5350, 5300, 5200, 5100, 5000],
            'jute': [3500, 3600, 3700, 3800, 3900, 4000, 4100, 4050, 4000, 3900, 3800, 3700]
        },
        '2022': {
            'wheat': [1900, 1920, 1950, 2000, 1980, 1960, 1940, 1920, 1900, 1950, 2050, 2100],
            'rice': [2800, 2820, 2850, 2880, 2900, 2920, 2940, 2960, 2980, 3000, 3020, 3040],
            'cotton': [5500, 5600, 5700, 5800, 5900, 6000, 6100, 6000, 5900, 5800, 5700, 5600],
            'sugarcane': [260, 265, 270, 275, 280, 285, 290, 295, 290, 285, 280, 275],
            'maize': [1600, 1650, 1700, 1750, 1800, 1850, 1900, 1850, 1800, 1750, 1700, 1650],
            'soybean': [3800, 3900, 4000, 4100, 4200, 4300, 4400, 4350, 4300, 4200, 4100, 4000],
            'mustard': [4300, 4400, 4500, 4600, 4700, 4800, 4900, 4800, 4700, 4600, 4500, 4400],
            'groundnut': [4800, 4900, 5000, 5100, 5200, 5300, 5400, 5350, 5300, 5200, 5100, 5000],
            'gram': [4600, 4700, 4800, 4900, 5000, 5100, 5200, 5150, 5100, 5000, 4900, 4800],
            'jute': [3300, 3400, 3500, 3600, 3700, 3800, 3900, 3850, 3800, 3700, 3600, 3500]
        }
    };

    const data = historyData[year] ? historyData[year][crop] : historyData['2023']['wheat'];

    const canvas = document.getElementById('replayChart');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid & Labels
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#999';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';

    // X-Axis Labels (Months)
    const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    const stepX = canvas.width / 12;

    for (let j = 0; j < 12; j++) {
        const x = j * stepX + 20;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height - 20); ctx.stroke();
        ctx.fillText(months[j], x, canvas.height - 5);
    }

    // Normalize data to fit chart height (0-300px roughly)
    // Assume min price 1500, max 3500 for scaling
    const minP = 1500;
    const maxP = 3500;
    const range = maxP - minP;

    const points = data.map((price, i) => {
        return {
            x: i * stepX + 20,
            y: canvas.height - 30 - ((price - minP) / range) * (canvas.height - 40)
        };
    });

    let frame = 0;
    const totalFrames = 60; // 1 second animation roughly

    const animate = () => {
        if (frame <= totalFrames) {
            ctx.clearRect(0, 0, canvas.width, canvas.height - 20); // Clear chart area only

            // Redraw Grid
            ctx.strokeStyle = '#eee';
            ctx.lineWidth = 1;
            for (let j = 0; j < 12; j++) {
                const x = j * stepX + 20;
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height - 20); ctx.stroke();
            }

            // Draw Line up to current progress
            ctx.beginPath();
            ctx.strokeStyle = '#2196F3';
            ctx.lineWidth = 3;

            const progressIndex = Math.floor((frame / totalFrames) * (points.length - 1));

            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i <= progressIndex; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();

            // Draw Dots
            ctx.fillStyle = '#1565C0';
            for (let i = 0; i <= progressIndex; i++) {
                ctx.beginPath();
                ctx.arc(points[i].x, points[i].y, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw Current Price label
            if (frame === totalFrames) {
                ctx.fillStyle = '#333';
                ctx.font = 'bold 12px Inter';
                ctx.fillText(`₹${data[data.length - 1]}`, points[points.length - 1].x, points[points.length - 1].y - 15);
            }

            frame++;
            requestAnimationFrame(animate);
        }
    };

    animate();
}

// --- New Features ---

function calculateROI() {
    const cost = parseFloat(document.getElementById('roiCost').value);
    const price = parseFloat(document.getElementById('roiPrice').value);
    const yieldAmount = parseFloat(document.getElementById('roiYield').value);
    const resultDiv = document.getElementById('roiResult');

    if (isNaN(cost) || isNaN(price) || isNaN(yieldAmount)) {
        alert("Please enter valid numbers for all fields.");
        return;
    }

    const totalRevenue = price * yieldAmount;
    const profit = totalRevenue - cost;
    const roi = (profit / cost) * 100;

    let color = profit >= 0 ? '#4CAF50' : '#d32f2f';

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="background: ${profit >= 0 ? '#e8f5e8' : '#fee'}; padding: 1rem; border-radius: 8px;">
            <h4 style="margin: 0; color: ${color}">Net Profit: ₹${profit.toFixed(2)}</h4>
            <p style="margin: 0.5rem 0 0;">ROI: <strong>${roi.toFixed(1)}%</strong></p>
        </div>
    `;
}

function initializeYieldPredictor() {
    // Just simple interaction scaling for now
    const rangeInput = document.getElementById('yieldRain');
    if (rangeInput) {
        rangeInput.addEventListener('input', function () {
            document.getElementById('rainValue').textContent = this.value + ' mm';
        });
    }
}

function predictYield() {
    const acres = parseFloat(document.getElementById('yieldAcres').value);
    const crop = document.getElementById('yieldCrop').value;
    const rain = parseFloat(document.getElementById('yieldRain').value);
    const output = document.getElementById('yieldOutput');

    if (isNaN(acres)) {
        alert("Please enter land size.");
        return;
    }

    // Base yields (quintals per acre)
    let baseYield = 0;
    if (crop === 'wheat') baseYield = 18;
    if (crop === 'rice') baseYield = 22;
    if (crop === 'cotton') baseYield = 12;

    // Rain factor (optimal around 100-150mm for demo logic)
    let rainFactor = 1;
    if (rain < 50) rainFactor = 0.7; // Drought
    else if (rain > 200) rainFactor = 0.8; // Flood
    else rainFactor = 1.2; // Good rain

    const estimatedYield = acres * baseYield * rainFactor;

    output.style.display = 'block';
    output.innerHTML = `
        <h3>Estimated Yield: ${Math.round(estimatedYield)} Quintals</h3>
        <p style="font-size: 0.9rem; color: #666;">Based on ${acres} acres of ${crop} with ${rain}mm rainfall.</p>
    `;
}
