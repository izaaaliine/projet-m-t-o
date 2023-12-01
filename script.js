let map = L.map('maCarte', {
  center: [46.6031, 1.7369],
  zoom: 6,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© contributeurs OpenStreetMap',
}).addTo(map);

map.on('click', function (event) {
  const latitude = event.latlng.lat;
  const longitude = event.latlng.lng;

  const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  fetch(reverseGeocodingUrl)
    .then((response) => response.json())
    .then((geoData) => {
      const cityName = geoData.address
        ? geoData.address.city ||
          geoData.address.town ||
          geoData.address.village ||
          geoData.address.hamlet
        : 'Ville inconnue';

      console.log(
        `Latitude: ${latitude}, Longitude: ${longitude}, Ville: ${cityName}`
      );

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const temperature = data.current.temperature_2m;
          const contenu = `Ville : ${cityName}<br>Température : ${temperature} °C`;

          // Supprimer le popup existant s'il y en a un
          if (marqueur) {
            map.removeLayer(marqueur);
          }

          // Ajouter un nouveau marqueur à la position cliquée avec le contenu du popup
          marqueur = L.marker([latitude, longitude]).addTo(map);
          marqueur.bindPopup(contenu);
          marqueur.openPopup();
        });
    });
});

let marqueur; // Déclarer la variable marqueur à l'extérieur de la fonction map.on('click', ...)
