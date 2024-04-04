document.addEventListener("DOMContentLoaded", async function () {
    let userLocation = []

    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                userLocation = [position.coords.latitude, position.coords.longitude];
                updateMap(userLocation);
                getBusinesses(userLocation);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    let myMap = L.map('map').setView([0, 0], 13);

    function buildMap(location) {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(myMap);

        L.marker(location).addTo(myMap)
            .bindPopup('Your Location').openPopup();

        myMap.on('click', function (e) {
            L.popup()
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(myMap);
        });
    }

    function updateMap(location) {
        myMap.setView(location, 13);
        buildMap(location);
    }

    async function getBusinesses(location) {
        const clientId = "SKXQC5XX0SWVYQFEMUEGMHL3CQALTHPCF5OLAYCL1YLQ1YT0";
        const clientSecret = "Y025CFIASFVY5UAEU5AGZBNCVBMYVOQ552SYFNWPCNSWBZEN";
        const apiUrl = 'https://api.foursquare.com/v2/venues/search';
        const query = document.getElementById('businessType').value;
        const url = `${apiUrl}?ll=${location[0]},${location[1]}&query=${query}&limit=5&client_id=${clientId}&client_secret=${clientSecret}&v=YYYYMMDD`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const venues = data.response.venues;
            venues.forEach(venue => {
                L.marker([venue.location.lat, venue.location.lng])
                    .addTo(myMap)
                    .bindPopup(venue.name)
                    .openPopup();
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    document.getElementById('businessType').addEventListener('change', function () {
        var selectedType = this.value;
        console.log("Selected Business Type:", selectedType);
        getBusinesses(userLocation); // Call getBusinesses when business type changes
    });

    getUserLocation();
});
