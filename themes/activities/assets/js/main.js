/**
 * Main Application Entry Point
 */
document.addEventListener("DOMContentLoaded", function () {
    console.log("Document loaded");
    initializeApp();
});

function initializeApp() {
    try {
        // Check if classes are available
        if (typeof UIManager === 'undefined') {
            console.error("UIManager class not available");
            return;
        }
        if (typeof LocationManager === 'undefined') {
            console.error("LocationManager class not available");
            return;
        }
        
        // Initialize UI components
        console.log("Initializing UI Manager...");
        const uiManager = new UIManager();
        
        // Initialize location management
        console.log("Initializing Location Manager...");
        const locationManager = new LocationManager();
        
        // Setup banner event listeners after DOM is ready
        console.log("Setting up banner event listeners...");
        locationManager.setupBannerEventListeners();
        
        console.log("Initialization complete");
    } catch (error) {
        console.error("Error during initialization:", error);
        // Fallback: at least show warning signs
        const distanceElements = document.querySelectorAll(".distance");
        distanceElements.forEach((element) => {
            element.textContent = "\u26A0";
        });
    }
}
