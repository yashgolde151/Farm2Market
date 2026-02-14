// Translator.js - Backward compatibility wrapper for i18n system
// This file provides backward compatibility for any existing translator functionality

class Translator {
    constructor() {
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
        this.translations = window.translations || {};
    }

    // Translate a key to current language
    translate(key, params = {}) {
        if (window.i18n) {
            return window.i18n.translate(key);
        }

        // Fallback translation logic
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                return key;
            }
        }

        // Simple parameter replacement
        if (typeof translation === 'string' && Object.keys(params).length > 0) {
            Object.keys(params).forEach(param => {
                translation = translation.replace(`{${param}}`, params[param]);
            });
        }

        return translation || key;
    }

    // Set language
    setLanguage(lang) {
        if (window.i18n) {
            window.i18n.setLanguage(lang);
        } else {
            this.currentLanguage = lang;
            localStorage.setItem('selectedLanguage', lang);
            this.translatePage();
        }
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Translate entire page
    translatePage() {
        if (window.i18n) {
            window.i18n.translatePage();
        } else {
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
    }

    // Get available languages
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    // Format number based on locale
    formatNumber(number, options = {}) {
        const locale = this.getLocaleCode();
        return new Intl.NumberFormat(locale, options).format(number);
    }

    // Format currency
    formatCurrency(amount, currency = 'INR') {
        const locale = this.getLocaleCode();
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // Format date
    formatDate(date, options = {}) {
        const locale = this.getLocaleCode();
        return new Intl.DateTimeFormat(locale, options).format(date);
    }

    // Get locale code for Intl formatting
    getLocaleCode() {
        const localeMap = {
            'en': 'en-IN',
            'hi': 'hi-IN',
            'gu': 'gu-IN',
            'mr': 'mr-IN'
        };
        return localeMap[this.currentLanguage] || 'en-IN';
    }

    // Check if RTL language
    isRTL() {
        const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        return rtlLanguages.includes(this.currentLanguage);
    }

    // Get text direction
    getTextDirection() {
        return this.isRTL() ? 'rtl' : 'ltr';
    }
}

// Initialize translator
(function () {
    if (!window.translator) {
        window.translator = new Translator();
    }
    // Auto-translate on load
    document.addEventListener('DOMContentLoaded', function () {
        if (window.translator) {
            window.translator.translatePage();
        }
    });
})();

// Global functions for backward compatibility
function translateText(key, params = {}) {
    if (window.translator) {
        return window.translator.translate(key, params);
    }
    return key;
}

function setLanguage(lang) {
    if (window.translator) {
        window.translator.setLanguage(lang);
    } else if (window.i18n) {
        window.i18n.setLanguage(lang);
    }
}

function getCurrentLanguage() {
    if (window.translator) {
        return window.translator.getCurrentLanguage();
    } else if (window.i18n) {
        return window.i18n.getCurrentLanguage();
    }
    return 'en';
}

function formatCurrency(amount, currency = 'INR') {
    if (window.translator) {
        return window.translator.formatCurrency(amount, currency);
    }
    return `₹${amount.toLocaleString('en-IN')}`;
}

function formatNumber(number, options = {}) {
    if (window.translator) {
        return window.translator.formatNumber(number, options);
    }
    return number.toLocaleString('en-IN', options);
}

function formatDate(date, options = {}) {
    if (window.translator) {
        return window.translator.formatDate(date, options);
    }
    return new Date(date).toLocaleDateString('en-IN', options);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Translator;
} else {
    window.Translator = Translator;
}