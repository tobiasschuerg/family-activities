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
        console.log("LocationManager initializing...");
        
        if (!("geolocation" in navigator)) {
            console.log("Geolocation is not supported by this browser.");
            this.setIndeterminateDistance();
            return;
        }

        console.log("Geolocation is supported");
        setTimeout(() => {
            this.checkLocationStatus();
        }, 100);
    }

    checkLocationStatus() {
        console.log("Checking location status...");
        const locationPermission = localStorage.getItem("locationPermission");
        const lastLocationRequest = localStorage.getItem("lastLocationRequest");
        const bannerDismissed = localStorage.getItem("locationBannerDismissed");
        const cachedLocation = localStorage.getItem("cachedLocation");

        console.log("Stored location permission:", locationPermission);
        console.log("Last location request:", lastLocationRequest);
        console.log("Banner dismissed:", bannerDismissed);
        console.log("Cached location:", cachedLocation);

        const banner = document.getElementById('locationBanner');
        console.log("Banner element found:", !!banner);
        
        // Check if we have recent successful location grant
        const hasRecentLocationGrant = locationPermission === "granted" && lastLocationRequest && 
            (this.currentTime - parseInt(lastLocationRequest) < this.twentyFourHours);
        
        // Check if banner was recently dismissed
        const bannerRecentlyDismissed = bannerDismissed && 
            (this.currentTime - parseInt(bannerDismissed) < this.twentyFourHours);

        console.log("Has recent location grant:", hasRecentLocationGrant);
        console.log("Banner recently dismissed:", bannerRecentlyDismissed);

        if (locationPermission === "denied" || bannerRecentlyDismissed) {
            console.log("Not showing banner - denied or recently dismissed");
            this.setIndeterminateDistance();
        } else if (hasRecentLocationGrant && cachedLocation) {
            console.log("Using cached location - no need to request again");
            const location = JSON.parse(cachedLocation);
            this.calculateDistances(location.lat, location.lon);
        } else if (hasRecentLocationGrant) {
            console.log("Using recent location grant - requesting location");
            this.requestLocation();
        } else {
            console.log("Showing banner for location request");
            this.showLocationBanner();
            this.setIndeterminateDistance();
        }
    }

    requestLocation() {
        console.log("Requesting location...");
        this.setLoadingDistance();
        
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
        
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        
        // Cache the location for future use
        const locationData = {
            lat: userLat,
            lon: userLon,
            timestamp: Date.now()
        };
        localStorage.setItem("cachedLocation", JSON.stringify(locationData));
        console.log("Location cached for future use");
        
        this.hideLocationBanner();
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
        console.log("Found distance elements:", distanceElements.length);
        distanceElements.forEach((element, index) => {
            console.log(`Setting warning for element ${index}`);
            element.textContent = "\u26A0"; // Unicode for '⚠' sign
        });
    }

    setLoadingDistance() {
        console.log("Setting loading spinners");
        const distanceElements = document.querySelectorAll(".distance");
        distanceElements.forEach((element) => {
            element.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-label="Loading"></span>';
        });
    }

    showLocationBanner() {
        console.log("Attempting to show location banner");
        const banner = document.getElementById('locationBanner');
        if (banner) {
            console.log("Banner found, removing d-none class");
            banner.classList.remove('d-none');
        } else {
            console.error("Banner element not found!");
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
