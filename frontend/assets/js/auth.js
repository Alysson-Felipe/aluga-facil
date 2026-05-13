const API_URL = "http://127.0.0.1:8000/api";

function saveUser(user) {
    localStorage.setItem("alugaFacilUser", JSON.stringify(user));
}

function getUser() {
    const user = localStorage.getItem("alugaFacilUser");
    return user ? JSON.parse(user) : null;
}

function logout() {
    localStorage.removeItem("alugaFacilUser");
    localStorage.removeItem("alugaFacilToken");
    window.location.href = "login.html";
}

function protectPage(requiredRole = null) {
    const user = getUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    if (requiredRole && user.role !== requiredRole) {
        if (user.role === "admin") {
            window.location.href = "dashboard-admin.html";
        } else {
            window.location.href = "dashboard-cliente.html";
        }
    }
}

// ── LOGIN ─────────────────────────────────────────────────────
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const btnSubmit = loginForm.querySelector("button[type=submit]");
        btnSubmit.disabled    = true;
        btnSubmit.textContent = "Entrando...";

        const data = {
            email:    document.getElementById("login-email").value,
            password: document.getElementById("login-password").value,
        };

        try {
            const response = await fetch(`${API_URL}/login`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "E-mail ou senha inválidos.");
                btnSubmit.disabled    = false;
                btnSubmit.textContent = "Entrar";
                return;
            }

            saveUser(result.user);
            if (result.token) {
                localStorage.setItem("alugaFacilToken", result.token);
            }

            if (result.user.role === "admin") {
                window.location.href = "dashboard-admin.html";
            } else {
                window.location.href = "dashboard-cliente.html";
            }

        } catch (error) {
            console.error("Erro no login:", error);
            alert("Erro ao conectar com o servidor. Verifique se o backend está rodando.");
            btnSubmit.disabled    = false;
            btnSubmit.textContent = "Entrar";
        }
    });
}

// ── CADASTRO ──────────────────────────────────────────────────
const signupForm = document.getElementById("signup-form");

if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const btnSubmit = signupForm.querySelector("button[type=submit]");
        btnSubmit.disabled    = true;
        btnSubmit.textContent = "Criando conta...";

        const password        = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("signup-confirm-password").value;

        if (password !== confirmPassword) {
            alert("As senhas não conferem.");
            btnSubmit.disabled    = false;
            btnSubmit.textContent = "Criar conta";
            return;
        }

        const data = {
            name:         document.getElementById("signup-name").value,
            cpf:          document.getElementById("signup-cpf").value,
            email:        document.getElementById("signup-email").value,
            phone:        document.getElementById("signup-phone").value,
            cnh:          document.getElementById("signup-cnh").value,
            cnh_category: document.getElementById("signup-category").value,
            password:     password,
            role:         "cliente",
        };

        try {
            const response = await fetch(`${API_URL}/register`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Erro ao criar conta.");
                btnSubmit.disabled    = false;
                btnSubmit.textContent = "Criar conta";
                return;
            }

            saveUser(result.user);
            if (result.token) {
                localStorage.setItem("alugaFacilToken", result.token);
            }

            // Redireciona direto para o dashboard, sem alert
            window.location.href = "dashboard-cliente.html";

        } catch (error) {
            console.error("Erro no cadastro:", error);
            alert("Erro ao conectar com o servidor.");
            btnSubmit.disabled    = false;
            btnSubmit.textContent = "Criar conta";
        }
    });
}