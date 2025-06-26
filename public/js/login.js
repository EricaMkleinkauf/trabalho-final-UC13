// Seleciona o formulário pelo ID
const form = document.getElementById('login');

// Escuta o envio do formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita reload da página
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    // Requisição POST para logar o usuário
    const res = await fetch('http://localhost:3000/api/usuarios/login', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("usuarioId", data.usuarioId); // Salva ID no localStorage
      window.location.href = "series.html"; // Redireciona para tela de séries
    } else {
      document.getElementById("erro").textContent = data.mensagem; // Mostra erro
    }
  } catch (err) {
    alert("Erro ao fazer login."); // Falha na requisição
  }
});
