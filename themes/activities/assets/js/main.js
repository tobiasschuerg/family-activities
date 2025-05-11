document.addEventListener("DOMContentLoaded", function () {
    console.log("Document loaded");
    
    // Initialize tooltips for warning signs
    const warningSigns = document.querySelectorAll(".warning-sign");
    warningSigns.forEach(function (sign) {
        sign.setAttribute("data-bs-toggle", "tooltip");
        sign.setAttribute("data-bs-placement", "top");
        sign.setAttribute("title", "Latitude or longitude not set");
        new bootstrap.Tooltip(sign);
    });

    // Create location permission banner if needed
    createLocationBannerIfNeeded();
    
    // Check if geolocation is supported by the browser
    if ("geolocation" in navigator) {
        console.log("Geolocation is supported");
        
        // Check if we've already asked for permission
        const locationPermission = localStorage.getItem("locationPermission");
        
        if (locationPermission === "granted") {
            // Permission was previously granted, request location
            requestLocation();
        } else if (locationPermission === "denied") {
            // Permission was previously denied, show banner
            showLocationBanner();
            setIndeterminateDistance();
        } else {
            // First time asking for permission
            requestLocation();
        }
    } else {
        console.log("Geolocation is not supported by this browser.");
        // Set distances to a unicode sign if geolocation is not supported
        setIndeterminateDistance();
    }
});

// Function to request location
function requestLocation() {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            console.log("User's location obtained successfully");
            // Store that permission was granted
            localStorage.setItem("locationPermission", "granted");
            
            // Hide banner if it exists
            hideLocationBanner();
            
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            // Call the function to calculate distances
            calculateDistances(userLat, userLon);
        },
        function (error) {
            // Error handling
            console.error("Error getting user's location:", error);
            
            // Store that permission was denied
            localStorage.setItem("locationPermission", "denied");
            
            // Show the banner
            showLocationBanner();
            
            // Set distances to a unicode sign in case of error
            setIndeterminateDistance();
        }
    );
}

// Function to create location permission banner
function createLocationBannerIfNeeded() {
    if (!document.getElementById('locationBanner')) {
        const banner = document.createElement('div');
        banner.id = 'locationBanner';
        banner.className = 'alert alert-warning alert-dismissible fade show d-none';
        banner.setAttribute('role', 'alert');
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.right = '0';
        banner.style.zIndex = '1050';
        
        banner.innerHTML = `
            <strong>Standort nicht verfügbar</strong> - Für die Berechnung der Entfernungen wird dein Standort benötigt.
            <button type="button" class="btn btn-sm btn-primary ms-2" id="requestLocationBtn">Standort freigeben</button>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.prepend(banner);
        
        // Add event listener to the request location button
        document.getElementById('requestLocationBtn').addEventListener('click', function() {
            // Clear the stored permission
            localStorage.removeItem("locationPermission");
            // Request location again
            requestLocation();
        });
    }
}

function calculateDistances(userLat, userLon) {
    console.log("Calculating distances...");
    const distanceElements = document.querySelectorAll(".distance");
    distanceElements.forEach(function (element) {
        const lat = parseFloat(element.getAttribute("data-lat"));
        const lon = parseFloat(element.getAttribute("data-lon"));

        if (!isNaN(lat) && !isNaN(lon)) {
            const distance = calculateDistance(lat, lon, userLat, userLon);
            element.textContent = distance + " km";
        } else {
            // Hide the distance element and show the warning sign
            element.textContent = "";
            element.nextElementSibling.classList.remove("d-none");
        }
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Earth's radius in kilometers
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    const deltaLat = toRadians(lat2 - lat1);
    const deltaLon = toRadians(lon2 - lon1);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance.toFixed(2); // Rounded to 2 decimal places
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function setIndeterminateDistance() {
    console.log("Setting indeterminate distances");
    const distanceElements = document.querySelectorAll(".distance");
    distanceElements.forEach(function (element) {
        element.textContent = "\u26A0"; // Unicode for '⚠' sign
    });
}

// Function to show location banner
function showLocationBanner() {
    const banner = document.getElementById('locationBanner');
    if (banner) {
        banner.classList.remove('d-none');
    }
}

// Function to hide location banner
function hideLocationBanner() {
    const banner = document.getElementById('locationBanner');
    if (banner) {
        banner.classList.add('d-none');
    }
}
