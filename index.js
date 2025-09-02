document.getElementById("find-restaurants").addEventListener('click', () => {
    const location = document.getElementById("search-input").value.trim();
    if (location) {
        fetchLocationCoordinates(location);
    }
    else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showRestuarantByPosition, showError);
    }
    else {
        alert('Geolocation is not supported by the browser!')
    }
})

const fetchLocationCoordinates = (location) => {
    const nominatimEndpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
    fetch(nominatimEndpoint)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                fetchRestaurants(lat, lon);
            }
            else {
                alert('location not found!');
            }
        })
        .catch(Error => {
            console.log("Error fecting location from Nominatim", error)
        })
}

const showRestuarantByPosition = (position) => {
    const {latitude, longitude} = position.coords;
    fetchRestaurants(latitude, longitude)
}

const fetchRestaurants = (latitude, longitude) => {
    const overpassEndpoint = `http://overpass-api.de/api/interpreter?data=[out:json];node[amenity=restaurants](around:5000,${latitude},${longitude});out;`;
    fetch(overpassEndpoint)
        .then(response => response.json())
    .then(data => {
            const restaurants = data.elements;
            const restaurantsContainer = document.getElementById("restaurants");
            restaurantsContainer.innerHTML = "";

            if (restaurants.length === 0) {
                restaurantsContainer.innerHTML = '<p>No restaurants found nearby.</p>';
                return;
            }
        })

restaurants.forEach(restaurant => {
    const card = document.createElement("div")
    card.className = 'restaurant-card'

    // create the card
    card.innerHTML = `
        <a href="https://www.openstreetmap.org/mlat=${restaurant.lon}" target="_blank" rel="noopener noreferrer">
        <h2>$(restuarant.tags.name || 'unnamed Restaurant')</h2>
        </a>
        <p>$(rastaurant.tags.cuisine || "Cuisine not spesified") </p>
        <p>lat: $(restaurant.lat), lon: $(restaurant.lon)</p>
        `;

    // append the card to the container
    restaurantsContainer.appendChild(card);
})
    .catch(error => {
        console.log("Error fetching from Overpass API", error)
    })
    
}

const showError = (error) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("user denied the request for Geolocation!");
            break;
        case error.PERMISSION_UNAVAILABLE:
            alert("Location information is unavailable!");
            break;
        case error.TIMEOUT:
            alert("THE REQUEST TO GET THE USER LOCATION TIMED OUT!");
            break;
        case error.UNKNOWN_ERROR:
            alert("an unkown errror occured!");
            break;

    }
}

