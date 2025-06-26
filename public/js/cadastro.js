// Seleciona o formulário pelo ID
const form = document.getElementById('cadastro');

// Escuta o envio do formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Impede o recarregamento da página
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    // Faz requisição POST para cadastrar o usuário
    const res = await fetch('http://localhost:3000/api/usuarios/cadastro', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha: senha })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Usuário cadastrado com sucesso!");
      window.location.href = "login.html"; // Redireciona para tela de login
    } else {
      document.getElementById("erro-cadastro").textContent = data.mensagem; // Mostra erro
    }
  } catch {
    alert("Erro ao cadastrar."); // Caso a requisição falhe
  }
});
