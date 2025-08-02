/**
 * Location Manager - Handles geolocation permissions and distance calculations
 */

class LocationManager {
    constructor() {
        this.currentTime = Date.now();
        this.twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        this.init();
    }

    init() {
        if (!("geolocation" in navigator)) {
            console.log("Geolocation is not supported by this browser.");
            this.setIndeterminateDistance();
            return;
        }

        console.log("Geolocation is supported");
        this.checkLocationStatus();
    }

    checkLocationStatus() {
        const locationPermission = localStorage.getItem("locationPermission");
        const lastLocationRequest = localStorage.getItem("lastLocationRequest");
        const bannerDismissed = localStorage.getItem("locationBannerDismissed");

        console.log("Stored location permission:", locationPermission);
        console.log("Last location request:", lastLocationRequest);
        console.log("Banner dismissed:", bannerDismissed);
        console.log("Browser:", navigator.userAgent.includes('Vivaldi') ? 'Vivaldi' : 'Other');

        const shouldShowBanner = !bannerDismissed || 
            (this.currentTime - parseInt(bannerDismissed) > this.twentyFourHours);

        if (locationPermission === "denied" || !shouldShowBanner) {
            console.log("Not showing banner - either denied or recently dismissed");
            this.setIndeterminateDistance();
        } else {
            console.log("Showing banner for location request");
            this.showLocationBanner();
            this.setIndeterminateDistance();
        }
    }

    requestLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => this.onLocationSuccess(position),
            (error) => this.onLocationError(error),
            {
                timeout: 10000,
                enableHighAccuracy: false,
                maximumAge: 300000 // 5 minutes
            }
        );
    }

    onLocationSuccess(position) {
        console.log("User's location obtained successfully");
        localStorage.setItem("locationPermission", "granted");
        localStorage.setItem("lastLocationRequest", Date.now().toString());
        
        this.hideLocationBanner();
        
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        
        this.calculateDistances(userLat, userLon);
    }

    onLocationError(error) {
        console.error("Error getting user's location:", error);
        localStorage.setItem("locationPermission", "denied");
        localStorage.setItem("lastLocationRequest", Date.now().toString());
        
        this.showLocationBanner();
        this.setIndeterminateDistance();
    }

    calculateDistances(userLat, userLon) {
        console.log("Calculating distances...");
        const distanceElements = document.querySelectorAll(".distance");
        
        distanceElements.forEach((element) => {
            const lat = parseFloat(element.getAttribute("data-lat"));
            const lon = parseFloat(element.getAttribute("data-lon"));

            if (!isNaN(lat) && !isNaN(lon)) {
                const distance = this.calculateDistance(lat, lon, userLat, userLon);
                element.textContent = distance + " km";
            } else {
                element.textContent = "";
                element.nextElementSibling?.classList.remove("d-none");
            }
        });
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const earthRadius = 6371; // Earth's radius in kilometers
        const lat1Rad = this.toRadians(lat1);
        const lat2Rad = this.toRadians(lat2);
        const deltaLat = this.toRadians(lat2 - lat1);
        const deltaLon = this.toRadians(lon2 - lon1);

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        return distance.toFixed(2);
    }

    toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    setIndeterminateDistance() {
        console.log("Setting indeterminate distances");
        const distanceElements = document.querySelectorAll(".distance");
        distanceElements.forEach((element) => {
            element.textContent = "\u26A0"; // Unicode for '⚠' sign
        });
    }

    showLocationBanner() {
        const banner = document.getElementById('locationBanner');
        if (banner) {
            banner.classList.remove('d-none');
        }
    }

    hideLocationBanner() {
        const banner = document.getElementById('locationBanner');
        if (banner) {
            banner.classList.add('d-none');
        }
    }

    setupBannerEventListeners() {
        const requestBtn = document.getElementById('requestLocationBtn');
        const closeBtn = document.getElementById('closeBannerBtn');

        if (requestBtn) {
            requestBtn.addEventListener('click', () => {
                localStorage.removeItem("locationPermission");
                localStorage.removeItem("locationBannerDismissed");
                this.requestLocation();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                localStorage.setItem("locationBannerDismissed", Date.now().toString());
                console.log("Banner dismissed by user");
            });
        }
    }
}

// Export for use in main.js
window.LocationManager = LocationManager;
