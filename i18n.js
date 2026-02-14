// Internationalization (i18n) system for Farm2Market
class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
        this.translations = window.translations || {};
        this.init();
    }

    init() {
        this.translatePage();
        this.setupLanguageSelector();
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('selectedLanguage', lang);
            this.translatePage();
            this.updateLanguageSelector();
        }
    }

    translate(key) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                // Fallback to English if translation not found
                translation = this.translations['en'];
                for (const fallbackKey of keys) {
                    if (translation && translation[fallbackKey]) {
                        document.title = translation.title || "Farm2Market";
                    } else {
                        return key; // Return key if no translation found
                    }
                }
                break;
            }
        }

        return translation || key;
    }

    translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);

            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email' || element.type === 'password' || element.type === 'tel')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
    }

    setupLanguageSelector() {
        // Create language selector if it doesn't exist
        if (!document.getElementById('languageSelector')) {
            this.createLanguageSelector();
        }
        this.updateLanguageSelector();
    }

    // Disabled dynamic injection to avoid duplicate selector with manual implementation
    createLanguageSelector() {
        // Selector is now manually added in HTML
        /*
        const selector = document.createElement('select');
        selector.id = 'languageSelector';
        selector.style.cssText = `
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            background: white;
            font-size: 0.9rem;
        `;

        const languages = [
            { code: 'en', name: 'English' },
            { code: 'hi', name: 'हिंदी' },
            { code: 'gu', name: 'ગુજરાતી' },
            { code: 'mr', name: 'मराठी' }
        ];

        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            selector.appendChild(option);
        });

        selector.addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });

        // Try to find a suitable place to insert the selector
        const navbar = document.querySelector('.nav-menu');
        if (navbar) {
            const li = document.createElement('li');
            li.appendChild(selector);
            navbar.appendChild(li);
        }
        */
    }

    updateLanguageSelector() {
        const selector = document.getElementById('languageSelector');
        if (selector) {
            selector.value = this.currentLanguage;
        }
    }

    // Method to get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Method to get available languages
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }
}

// Initialize i18n when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    if (window.translations) {
        window.i18n = new I18n();
    }
});

// Global function for language change (backward compatibility)
function changeLanguage(lang) {
    if (window.i18n) {
        window.i18n.setLanguage(lang);
    } else {
        localStorage.setItem('selectedLanguage', lang);
        location.reload();
    }
}

// Global function to show language options
function showLanguageOptions() {
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'हिंदी' },
        { code: 'gu', name: 'ગુજરાતી' },
        { code: 'mr', name: 'मराठी' }
    ];

    let options = 'Select Language:\n';
    languages.forEach((lang, index) => {
        options += `${index + 1}. ${lang.name}\n`;
    });

    const choice = prompt(options + 'Enter number (1-4):');
    if (choice && choice >= 1 && choice <= 4) {
        const selectedLang = languages[choice - 1];
        changeLanguage(selectedLang.code);
        showNotification(`Language changed to ${selectedLang.name}`, 'success');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
} else {
    window.I18n = I18n;
}