// elementos
const btnavaliacao = document.getElementById("btnavaliacao");
const formdepoimento = document.getElementById("formdepoimento");
const listaAvaliacoes = document.getElementById("lista-avaliacoes");
const verMaisBtn = document.getElementById("verMaisBtn");

// abrir formulário
if (btnavaliacao && formdepoimento) {
    btnavaliacao.addEventListener("click", () => {
        formdepoimento.style.display = "flex";
    });
}

// ⭐ gerar estrelas
function gerarEstrelas(nota) {
    nota = Number(nota) || 0;
    let estrelas = "";

    for (let i = 1; i <= 5; i++) {
        estrelas += i <= nota
            ? '<i class="fa-solid fa-star"></i>'
            : '<i class="fa-regular fa-star"></i>';
    }

    return estrelas;
}

// 📅 formatar data
function formatarData(dataISO) {
    if (!dataISO) return "";

    const data = new Date(dataISO);

    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }) + " às " + data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

// estado
let mostrandoTudo = false;
let avaliacoes = [];

// 📥 buscar dados
async function obterDados() {
    try {
        const res = await fetch("https://apisistemadeavaliacao.onrender.com/avaliacoes");
        const data = await res.json();

        avaliacoes = data.reverse(); // mostra mais recentes primeiro
        renderizar();
    } catch (erro) {
        console.error("Erro ao buscar avaliações:", erro);
    }
}

// 🎨 renderizar
function renderizar() {
    if (!listaAvaliacoes) return; // evita erro

    listaAvaliacoes.innerHTML = "";

    const limite = mostrandoTudo ? avaliacoes.length : 3;

    avaliacoes.slice(0, limite).forEach(av => {
        const div = document.createElement("div");
        div.classList.add("avaliacao");

        div.innerHTML = `
            <div class="topo-avaliacao">
                <span class="nome">${av.nome}</span>
                <span class="estrelas">${gerarEstrelas(av.nota)}</span>
            </div>

            <div class="comentario">"${av.comentario}"</div>

            <div class="data">${formatarData(av.data)}</div>
        `;

        listaAvaliacoes.appendChild(div);
    });

    // botão ver mais
    if (verMaisBtn) {
        if (avaliacoes.length > 3) {
            verMaisBtn.style.display = "block";
            verMaisBtn.textContent = mostrandoTudo ? "Ver menos" : "Ver mais";
        } else {
            verMaisBtn.style.display = "none";
        }
    }
}

// botão ver mais
if (verMaisBtn) {
    verMaisBtn.addEventListener("click", () => {
        mostrandoTudo = !mostrandoTudo;
        renderizar();
    });
}
const form = document.getElementById("formdepoimento");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // 🚫 impede reload da página

    const nome = document.getElementById("nome").value;
    const comentario = document.getElementById("comentario").value;
    const nota = form.querySelector("select[name='nota']").value;

    const dados = {
        nome: nome,
        comentario: comentario,
        nota: Number(nota)
    };

    try {
        const res = await fetch("https://apisistemadeavaliacao.onrender.com/avaliacoes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (!res.ok) throw new Error("Erro ao enviar");

        // limpa o formulário
        form.reset();

        // esconde o form (opcional)
        form.style.display = "none";

        // atualiza lista de avaliações
        obterDados();

        console.log("Avaliação enviada com sucesso!");

    } catch (erro) {
        console.error("Erro:", erro);
        console.log("Erro ao enviar avaliação");
    }
});
// iniciar quando carregar página
document.addEventListener("DOMContentLoaded", () => {
    obterDados();
});