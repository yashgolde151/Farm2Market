// ===== Weather Page JavaScript =====

// Filter button functionality
document.querySelector('.btn-get-data').addEventListener('click', function() {
    alert('Fetching weather data for selected location...');
});

// Forecast tab switching
document.querySelectorAll('.forecast-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.forecast-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

// Satellite controls
document.querySelectorAll('.satellite-select').forEach(select => {
    select.addEventListener('change', function() {
        console.log('Satellite view updated: ' + this.value);
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Weather page loaded');
    
    // Add hover effects to cards
    document.querySelectorAll('.weather-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Alert card interactions
    document.querySelectorAll('.alert-card').forEach(alert => {
        alert.addEventListener('click', function() {
            console.log('Alert clicked');
        });
    });
});
