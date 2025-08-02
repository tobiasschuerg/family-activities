/**
 * Main Application Entry Point
 */
document.addEventListener("DOMContentLoaded", function () {
    console.log("Document loaded");
    
    // Initialize UI components
    const uiManager = new UIManager();
    
    // Initialize location management
    const locationManager = new LocationManager();
    
    // Setup banner event listeners after DOM is ready
    locationManager.setupBannerEventListeners();
});
