document.addEventListener('DOMContentLoaded', function() {
    let count = 1;
    document.getElementById("radio1").checked = true;

    setInterval(function() {
        nextImage();
    }, 5000);

    function nextImage() {
        count++;
        if (count > 4) {
            count = 1;
        }
        document.getElementById("radio" + count).checked = true;
    }

    // Exemplo de função para capturar a localização atual
    const locationButton = document.getElementById("current-location-btn");
    if (locationButton) {
        locationButton.addEventListener("click", () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const lat = position.coords.latitude;
                    const long = position.coords.longitude;
                    console.log("Latitude: ", lat, "Longitude: ", long);
                    // Aqui você pode integrar com a API de localização para converter em cidade
                });
            } else {
                alert("Geolocalização não suportada pelo navegador.");
            }
        });
    }

    // Função para alternar a visibilidade da seção de filtros avançados
    const toggleButton = document.querySelector('.toggle-filters-btn');
    const advancedSearchSection = document.querySelector('.advanced-search');

    if (toggleButton && advancedSearchSection) {
        toggleButton.addEventListener('click', function() {
            const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
            
            // Alterna a visibilidade da seção e o estado do botão
            advancedSearchSection.style.display = isExpanded ? 'none' : 'block';
            toggleButton.setAttribute('aria-expanded', !isExpanded);
        });
    }
});



// API DE GEOLOCALIZAÇÃO 
window.addEventListener('load', function() {
    // Verifica se a Geolocalização é suportada
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCityFromCoordinates, showError);
    } else {
        document.getElementById('user-location').textContent = "Geolocalização não é suportada pelo navegador.";
    }
});

function getCityFromCoordinates(position) {
    const userLat = position.coords.latitude;
    const userLong = position.coords.longitude;
    
    // URL para a API de geocodificação reversa (exemplo com OpenCage)
    const apiKey = 'c2dd026254364195acb9dc076fd21abb'; // Substitua com sua chave da API de geocodificação
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${userLat}+${userLong}&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const city = data.results[0].components.city || data.results[0].components.town || data.results[0].components.village;
            document.getElementById('user-location').textContent = `Acompanhantes próximas a ${city}`;
        })
        .catch(error => {
            console.error('Erro ao obter a cidade:', error);
            document.getElementById('user-location').textContent = "Erro ao obter a localização.";
        });
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('user-location').textContent = "Permissão de localização negada.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('user-location').textContent = "Informações de localização não disponíveis.";
            break;
        case error.TIMEOUT:
            document.getElementById('user-location').textContent = "Tempo esgotado para obter localização.";
            break;
        default:
            document.getElementById('user-location').textContent = "Erro desconhecido ao obter localização.";
            break;
    }
}