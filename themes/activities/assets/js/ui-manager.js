/**
 * UI Manager - Handles UI initialization and interactions
 */

class UIManager {
    constructor() {
        this.init();
    }

    init() {
        this.initializeTooltips();
    }

    initializeTooltips() {
        const warningSigns = document.querySelectorAll(".warning-sign");
        warningSigns.forEach((sign) => {
            sign.setAttribute("data-bs-toggle", "tooltip");
            sign.setAttribute("data-bs-placement", "top");
            sign.setAttribute("title", "Latitude or longitude not set");
            
            // Initialize Bootstrap tooltip if available
            if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
                new bootstrap.Tooltip(sign);
            }
        });
    }
}

// Export for use in main.js
window.UIManager = UIManager;
