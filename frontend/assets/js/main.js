const API_URL = "http://127.0.0.1:8000/api";
const STORAGE_URL = "http://127.0.0.1:8000/storage";

function getVehicleImage(image) {
    if (!image) {
        return "assets/img/car-placeholder.jpg";
    }

    if (image.startsWith("http")) {
        return image;
    }

    return `${STORAGE_URL}/${image}`;
}

async function carregarVeiculosHome() {
    const container = document.getElementById("home-vehicles-container");

    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/vehicles`);
        const vehicles = await response.json();

        const disponiveis = vehicles.filter(vehicle => {
            return Number(vehicle.available) === 1 || vehicle.available === true;
        });

        container.innerHTML = "";

        if (disponiveis.length === 0) {
            container.innerHTML = `
                <p>Nenhum veículo disponível no momento.</p>
            `;
            return;
        }

        disponiveis.slice(0, 3).forEach(vehicle => {

            container.innerHTML += `
                <article class="vehicle-card">

                    <div class="vehicle-thumb">
                        <img 
                            src="${getVehicleImage(vehicle.image)}"
                            alt="${vehicle.name}"
                            onerror="this.src='assets/img/car-placeholder.jpg'"
                        >
                    </div>

                    <h3>${vehicle.name}</h3>

                    <p>
                        ${vehicle.description || "Veículo disponível para locação."}
                    </p>

                    <div class="tags">
                        <span class="tag">${vehicle.brand}</span>
                        <span class="tag">${vehicle.model}</span>
                        <span class="tag">${vehicle.year}</span>
                    </div>

                    <div class="actions-inline" style="justify-content:space-between; margin-top:18px;">

                        <div class="price">
                            R$ ${Number(vehicle.price_per_day).toFixed(2)}
                            <span>/ diária</span>
                        </div>

                        <a 
                            class="btn btn-primary"
                            href="pages/veiculo-detalhe.html?id=${vehicle.id}"
                        >
                            Detalhes
                        </a>

                    </div>

                </article>
            `;
        });

    } catch (error) {
        console.error("Erro ao carregar veículos:", error);

        container.innerHTML = `
            <p>Erro ao carregar veículos disponíveis.</p>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarVeiculosHome();
});