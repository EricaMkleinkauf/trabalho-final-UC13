// Recupera o ID do usuário logado
const usuarioId = localStorage.getItem("usuarioId");
if (!usuarioId) window.location.href = "login.html"; // Redireciona se não estiver logado

const form = document.getElementById('cadastro-serie');
const lista = document.getElementById('lista-series');

// Cadastrar nova série
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const serie = {
    titulo: document.getElementById('titulo').value,
    sinopse: document.getElementById('sinopse').value,
    genero: document.getElementById('genero').value,
    temporada: Number(document.getElementById('temporada').value),
    episodio: Number(document.getElementById('episodio').value),
    nota: Number(document.getElementById('nota').value),
    usuarioId: Number(usuarioId)
  };

  try {
    const res = await fetch('http://localhost:3000/api/series', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serie)
    });

    const data = await res.json();
    if (res.ok) {
      alert("Série cadastrada!");
      form.reset();
      carregarSeries(); // Recarrega lista
    } else {
      alert(data.mensagem || "Erro ao cadastrar série.");
    }
  } catch (err) {
    alert("Erro ao salvar série.");
  }
});

// Carrega todas as séries do usuário
async function carregarSeries() {
  try {
    const res = await fetch(`http://localhost:3000/api/series/usuario/${usuarioId}`);
    const series = await res.json();

    lista.innerHTML = '';
    series.forEach((serie) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${serie.titulo}</strong> - Temporada ${serie.temporada}, Episódio ${serie.episodio}<br>
        Gênero: ${serie.genero} | Nota: ${serie.nota}<br>
        <em>${serie.sinopse}</em><br>
        <button onclick="deletarSerie(${serie.id})">Excluir</button>
        <button onclick='editarSerie(${(serie).id})'>Editar</button>
      `;
      lista.appendChild(li);
    });

    if (series.length === 0) {
      lista.innerHTML = '<li>Nenhuma série cadastrada.</li>';
    }
  } catch (err) {
    alert("Erro ao carregar séries.");
  }
}

// Excluir uma série
async function deletarSerie(id) {
  if (!confirm("Deseja apagar esta série?")) return;

  try {
    const res = await fetch(`http://localhost:3000/api/series/deletar/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (res.ok) {
      alert(data.mensagem || "Série excluída!");
      carregarSeries(); // Atualiza a lista
    } else {
      alert(data.mensagem || "Erro ao excluir.");
    }
  } catch (err) {
    alert("Erro ao excluir série.");
  }
}

// Editar uma série
async function editarSerie(id) {
  // Carrega os valores do formulário
  document.getElementById('titulo').value,
  document.getElementById('sinopse').value,
  document.getElementById('genero').value,
  document.getElementById('temporada').value,
  document.getElementById('episodio').value,
  document.getElementById('nota').value;

  // Cria botão de edição
  const botaoEditar = document.createElement('button');
  botaoEditar.textContent = "Salvar Edição";
  botaoEditar.type = "button";
  botaoEditar.onclick = async () => {
    const serieAtualizada = {
      titulo: document.getElementById('titulo').value,
      sinopse: document.getElementById('sinopse').value,
      genero: document.getElementById('genero').value,
      temporada: Number(document.getElementById('temporada').value),
      episodio: Number(document.getElementById('episodio').value),
      nota: Number(document.getElementById('nota').value),
      usuarioId: Number(usuarioId)
    };

    try {
      const res = await fetch(`http://localhost:3000/api/series/editar/${id}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serieAtualizada)
      });

      const data = await res.json();
      if (res.ok) {
        alert("Série atualizada!");
        form.reset();
        botaoEditar.remove();
        carregarSeries(); // Atualiza lista
      } else {
        alert(data.mensagem || "Erro ao editar série.");
      }
    } catch (err) {
      alert("Erro ao editar série.");
    }
  };

  // Evita adicionar botão duplicado
  if (!document.getElementById('botao-editar')) {
    botaoEditar.id = "botao-editar";
    form.appendChild(botaoEditar);
  }
}

// Função de logout
function logout() {
  localStorage.removeItem("usuarioId");
  window.location.href = "login.html";
}

// Carrega lista ao abrir a página
carregarSeries();
