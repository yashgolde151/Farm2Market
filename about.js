// About Section Functionality for Farm2Market
class AboutSection {
    constructor() {
        this.init();
    }

    init() {
        this.setupAnimations();
        this.setupCounters();
        this.setupTeamInteractions();
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe about cards
        const aboutCards = document.querySelectorAll('.about-card, .feature-item, .stat-card, .team-member');
        aboutCards.forEach(card => {
            observer.observe(card);
        });

        // Add CSS for animations
        this.addAnimationStyles();
    }

    setupCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => {
            counterObserver.observe(stat);
        });
    }

    animateCounter(element) {
        const target = element.textContent;
        const isRupee = target.includes('₹');
        const isCr = target.includes('Cr');
        const isL = target.includes('L');
        const isPercent = target.includes('%');
        const isPlus = target.includes('+');

        let numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
        let current = 0;
        const increment = numericValue / 50; // 50 steps

        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }

            let displayValue = Math.floor(current);
            if (numericValue % 1 !== 0) {
                displayValue = current.toFixed(1);
            }

            let formattedValue = displayValue;
            if (isRupee) formattedValue = '₹' + formattedValue;
            if (isCr) formattedValue += ' Cr';
            if (isL) formattedValue += 'L';
            if (isPercent) formattedValue += '%';
            if (isPlus) formattedValue += '+';

            element.textContent = formattedValue;
        }, 20);
    }

    setupTeamInteractions() {
        const teamMembers = document.querySelectorAll('.team-member');
        teamMembers.forEach(member => {
            member.addEventListener('mouseenter', () => {
                this.showMemberDetails(member);
            });

            member.addEventListener('mouseleave', () => {
                this.hideMemberDetails(member);
            });
        });
    }

    showMemberDetails(member) {
        const bio = member.querySelector('.member-bio');
        if (bio) {
            bio.style.maxHeight = bio.scrollHeight + 'px';
            bio.style.opacity = '1';
        }
    }

    hideMemberDetails(member) {
        const bio = member.querySelector('.member-bio');
        if (bio) {
            bio.style.maxHeight = '0';
            bio.style.opacity = '0';
        }
    }

    addAnimationStyles() {
        if (document.getElementById('about-animations')) return;

        const styles = document.createElement('style');
        styles.id = 'about-animations';
        styles.textContent = `
            .about-card,
            .feature-item,
            .stat-card,
            .team-member {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .about-card.animate-in,
            .feature-item.animate-in,
            .stat-card.animate-in,
            .team-member.animate-in {
                opacity: 1;
                transform: translateY(0);
            }

            .about-card:nth-child(1) { transition-delay: 0.1s; }
            .about-card:nth-child(2) { transition-delay: 0.2s; }
            .about-card:nth-child(3) { transition-delay: 0.3s; }

            .feature-item:nth-child(1) { transition-delay: 0.1s; }
            .feature-item:nth-child(2) { transition-delay: 0.2s; }
            .feature-item:nth-child(3) { transition-delay: 0.3s; }
            .feature-item:nth-child(4) { transition-delay: 0.4s; }
            .feature-item:nth-child(5) { transition-delay: 0.5s; }
            .feature-item:nth-child(6) { transition-delay: 0.6s; }

            .stat-card:nth-child(1) { transition-delay: 0.1s; }
            .stat-card:nth-child(2) { transition-delay: 0.2s; }
            .stat-card:nth-child(3) { transition-delay: 0.3s; }
            .stat-card:nth-child(4) { transition-delay: 0.4s; }

            .team-member:nth-child(1) { transition-delay: 0.1s; }
            .team-member:nth-child(2) { transition-delay: 0.2s; }
            .team-member:nth-child(3) { transition-delay: 0.3s; }
            .team-member:nth-child(4) { transition-delay: 0.4s; }

            .member-bio {
                max-height: 0;
                opacity: 0;
                overflow: hidden;
                transition: all 0.3s ease;
            }

            .about-icon,
            .feature-icon {
                transition: transform 0.3s ease;
            }

            .about-card:hover .about-icon,
            .feature-item:hover .feature-icon {
                transform: scale(1.1) rotate(5deg);
            }

            .stat-number {
                font-variant-numeric: tabular-nums;
            }

            @media (prefers-reduced-motion: reduce) {
                .about-card,
                .feature-item,
                .stat-card,
                .team-member {
                    opacity: 1;
                    transform: none;
                    transition: none;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    // Method to highlight specific features
    highlightFeature(featureIndex) {
        const features = document.querySelectorAll('.feature-item');
        features.forEach((feature, index) => {
            if (index === featureIndex) {
                feature.style.transform = 'scale(1.05)';
                feature.style.boxShadow = '0 8px 25px rgba(46, 125, 50, 0.2)';
            } else {
                feature.style.transform = 'scale(1)';
                feature.style.boxShadow = '';
            }
        });
    }

    // Method to reset feature highlights
    resetFeatureHighlights() {
        const features = document.querySelectorAll('.feature-item');
        features.forEach(feature => {
            feature.style.transform = 'scale(1)';
            feature.style.boxShadow = '';
        });
    }
}

// Initialize about section functionality
document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.about-section')) {
        window.aboutSection = new AboutSection();
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutSection;
} else {
    window.AboutSection = AboutSection;
}