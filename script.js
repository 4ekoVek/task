const API_BASE = 'https://swapi.dev/api';
const heroesList = document.getElementById('heroes-list');
const modal = document.getElementById('modal');
const vehicleDetails = document.getElementById('vehicle-details');
const closeModal = document.getElementById('close-modal');

// Fetch heroes from API and render list
async function fetchHeroes() {
    try {
        const response = await fetch(`${API_BASE}/people/`);
        const data = await response.json();
        renderHeroes(data.results);
    } catch (error) {
        console.error('Error fetching heroes:', error);
    }
}

// Render heroes list
function renderHeroes(heroes) {
    heroes.forEach((hero) => {
        const li = document.createElement('li');
        li.innerHTML = `
      <strong>${hero.name}</strong><br>
      Height: ${hero.height}<br>
      Eye Color: ${hero.eye_color}<br>
      Birth Year: ${hero.birth_year}
    `;
        li.addEventListener('click', () => fetchVehicles(hero));
        heroesList.appendChild(li);
    });
}

// Fetch vehicles of a hero and display in modal
async function fetchVehicles(hero) {
    vehicleDetails.innerHTML = '<li>Loading...</li>';
    modal.classList.remove('hidden');

    if (!hero.vehicles.length) {
        vehicleDetails.innerHTML = '<li>No vehicles available.</li>';
        return;
    }

    try {
        const vehicles = await Promise.all(
            hero.vehicles.map((url) => fetch(url).then((res) => res.json()))
        );
        renderVehicles(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        vehicleDetails.innerHTML = '<li>Error loading vehicles.</li>';
    }
}

// Render vehicles in modal
function renderVehicles(vehicles) {
    vehicleDetails.innerHTML = vehicles
        .map(
            (vehicle) => `
      <li>
        <strong>${vehicle.name}</strong><br>
        Model: ${vehicle.model}<br>
        Crew: ${vehicle.crew}<br>
        Max Speed: ${vehicle.max_atmosphering_speed} km/h
      </li>
    `
        )
        .join('');
}

// Close modal
closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

// Initialize app
fetchHeroes();