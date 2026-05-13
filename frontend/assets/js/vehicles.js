const API_URL = "http://127.0.0.1:8000/api";

async function carregarVeiculos() {
    const container = document.getElementById("vehicles-container");

    if (!container) {
        console.error("Container vehicles-container não encontrado.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/vehicles`);
        const vehicles = await response.json();

        container.innerHTML = "";

        if (vehicles.length === 0) {
            container.innerHTML = "<p>Nenhum veículo cadastrado ainda.</p>";
            return;
        }

        vehicles.forEach(vehicle => {
            container.innerHTML += `
                <div class="car-card">
                    <img src="http://127.0.0.1:8000/storage/${vehicle.image}">
                    <div class="car-info">
                        <h3>${vehicle.name}</h3>
                        <p><strong>Marca:</strong> ${vehicle.brand}</p>
                        <p><strong>Modelo:</strong> ${vehicle.model}</p>
                        <p><strong>Ano:</strong> ${vehicle.year}</p>
                        <p><strong>Diária:</strong> R$ ${Number(vehicle.price_per_day).toFixed(2)}</p>
                        <a href="veiculo-detalhe.html?id=${vehicle.id}" class="btn-primary">Ver detalhes</a>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Erro ao carregar veículos:", error);
        container.innerHTML = "<p>Erro ao carregar veículos.</p>";
    }
}

carregarVeiculos();