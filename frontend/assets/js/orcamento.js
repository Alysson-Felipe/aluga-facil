(function () {
    const API_URL = window.API_URL || "http://127.0.0.1:8000/api";

    const budgetForm = document.getElementById("budget-form");

    function getLoggedUserForBudget() {
        const user = localStorage.getItem("alugaFacilUser");
        return user ? JSON.parse(user) : null;
    }

    window.addEventListener("DOMContentLoaded", function () {
        const user = getLoggedUserForBudget();

        if (user) {
            document.getElementById("name").value = user.name || "";
            document.getElementById("phone").value = user.phone || "";
        }
    });

    if (budgetForm) {
        budgetForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const user = getLoggedUserForBudget();

            if (!user || !user.id) {
                alert("Você precisa fazer login para enviar uma solicitação.");
                window.location.href = "login.html";
                return;
            }

            const data = {
                user_id: user.id,
                name: document.getElementById("name").value,
                phone: document.getElementById("phone").value,
                vehicle: document.getElementById("vehicle").value,
                start_date: document.getElementById("start_date").value,
                end_date: document.getElementById("end_date").value,
                message: document.getElementById("message").value,
            };

            try {
                const response = await fetch(`${API_URL}/budget-requests`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (!response.ok) {
                    console.error("Erro da API:", result);
                    alert(result.message || "Erro ao enviar orçamento.");
                    return;
                }

                alert("Orçamento enviado com sucesso!");
                budgetForm.reset();

                window.location.href = "dashboard-cliente.html";

            } catch (error) {
                console.error("Erro na conexão:", error);
                alert("Erro na conexão com o servidor.");
            }
        });
    }
})();