// Language Selector UI Logic

function showLanguageOptions() {
    // Create modal if it doesn't exist
    if (!document.getElementById('languageModal')) {
        createLanguageModal();
    }

    // Show modal
    document.getElementById('languageModal').style.display = 'flex';
}

function createLanguageModal() {
    const modal = document.createElement('div');
    modal.id = 'languageModal';
    modal.className = 'language-modal';

    // Languages from translations.js (assuming it's loaded)
    const languages = [
        { code: 'en', name: 'English', native: 'English' },
        { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
        { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
        { code: 'mr', name: 'Marathi', native: 'मराठी' },
        { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
        { code: 'te', name: 'Telugu', native: 'తెలుగు' },
        { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
        { code: 'ml', name: 'Malayalam', native: 'മലയാളം' }
    ];

    const currentLang = localStorage.getItem('selectedLanguage') || 'en';

    modal.innerHTML = `
        <div class="language-modal-content">
            <div class="language-modal-header">
                <h3>Select Language / भाषा चुनें</h3>
                <button onclick="closeLanguageModal()" class="close-btn">&times;</button>
            </div>
            <div class="language-grid">
                ${languages.map(lang => `
                    <div class="language-option ${currentLang === lang.code ? 'active' : ''}" 
                         onclick="selectLanguage('${lang.code}')">
                        <span class="lang-native">${lang.native}</span>
                        <span class="lang-name">${lang.name}</span>
                        ${currentLang === lang.code ? '<i class="fas fa-check-circle"></i>' : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeLanguageModal();
    });
}

function closeLanguageModal() {
    const modal = document.getElementById('languageModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function selectLanguage(langCode) {
    // Use the global translator instance if available
    if (window.translator) {
        window.translator.setLanguage(langCode);
    } else if (window.i18n) {
        // Fallback to i18n if translator wrapper isn't there
        window.i18n.setLanguage(langCode);
    } else {
        // Manual fallback
        localStorage.setItem('selectedLanguage', langCode);
        location.reload();
    }

    closeLanguageModal();

    // Update active state in modal if it persists
    // But typically we reload or re-render, so this might be redundant if page reloads
    // translator.js setLanguage might reload or just update DOM. 
    // Let's assume translator handles the UI update.

    // Force UI update for the modal itself just in case
    updateModalSelection(langCode);
}

function updateModalSelection(langCode) {
    const options = document.querySelectorAll('.language-option');
    options.forEach(opt => {
        opt.classList.remove('active');
        if (opt.getAttribute('onclick').includes(langCode)) {
            opt.classList.add('active');
        }
    });
}

// Add CSS for modal dynamically
const style = document.createElement('style');
style.textContent = `
    .language-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(5px);
        z-index: 10001;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    }
    
    .language-modal-content {
        background: white;
        border-radius: 20px;
        padding: 2rem;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease;
    }
    
    .language-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 1rem;
    }
    
    .language-modal-header h3 {
        margin: 0;
        color: #1B5E20;
        font-size: 1.5rem;
    }
    
    .close-btn {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
        padding: 0;
        line-height: 1;
    }
    
    .language-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
    
    .language-option {
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        padding: 1.5rem;
        cursor: pointer;
        text-align: center;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        gap: 5px;
        position: relative;
    }
    
    .language-option:hover {
        border-color: #4CAF50;
        background: #F1F8E9;
        transform: translateY(-3px);
    }
    
    .language-option.active {
        border-color: #4CAF50;
        background: #E8F5E9;
        box-shadow: 0 4px 10px rgba(76, 175, 80, 0.2);
    }
    
    .language-option.active i {
        position: absolute;
        top: 10px;
        right: 10px;
        color: #4CAF50;
    }
    
    .lang-native {
        font-size: 1.4rem;
        font-weight: 700;
        color: #2c3e50;
    }
    
    .lang-name {
        font-size: 0.9rem;
        color: #7f8c8d;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);


// Expose changeLanguage globally for select elements
window.changeLanguage = function (langCode) {
    selectLanguage(langCode);
};

// Initialize selector value on load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';

    // Update any language select elements
    const selectors = document.querySelectorAll('.nav-language-selector select, .auth-language-selector select');
    selectors.forEach(selector => {
        selector.value = savedLang;
    });
});
