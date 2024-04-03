document.addEventListener("DOMContentLoaded", function () {
    let userLocation = []

    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                userLocation = [position.coords.latitude, position.coords.longitude];
                updateMap(userLocation);
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

    document.getElementById('businessType').addEventListener('change', function () {
        var selectedType = this.value;
        console.log("Selected Business Type:", selectedType);
    });

    getUserLocation();
});
