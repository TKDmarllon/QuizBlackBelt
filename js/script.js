let tecnicas = [];
let tecnicasEmbaralhadas = [];
let tecnicaAtualIndex = 0;
let respostaMontada = [];

function salvarStorage() {
    localStorage.setItem("tecnicas", JSON.stringify(tecnicas));
}

function embaralhar(array) {
    return array.sort(() => Math.random() - 0.5);
}

function carregarTecnicasIniciais() {

    const storage = localStorage.getItem("tecnicas");

    if (storage) {
        tecnicas = JSON.parse(storage);
        iniciarSistema();
    } else {
        fetch("tecnicas.json")
            .then(r => r.json())
            .then(data => {
                tecnicas = data;
                salvarStorage();
                iniciarSistema();
            });
    }
}

// SANFONA
document.querySelectorAll(".acordeao").forEach(botao => {
    botao.addEventListener("click", function () {
        this.classList.toggle("ativo");
        const painel = this.nextElementSibling;
        painel.style.display =
            painel.style.display === "block" ? "none" : "block";
    });
});

// Mostrar resposta mini quiz
function toggleResposta(botao) {
    const resposta = botao.nextElementSibling;
    resposta.classList.toggle("hidden");
}

function verificarResposta(select, respostaCorreta) {
    if (select.value === respostaCorreta) {
        select.style.backgroundColor = "#c8f7c5"; // verde
    } else {
        select.style.backgroundColor = "#f7c5c5"; // vermelho
    }
}

function trocarTela(id) {

    document.querySelectorAll(".tela").forEach(t => {
        t.classList.add("hidden");
    });

    document.getElementById(id).classList.remove("hidden");

    window.scrollTo(0,0);
}

function mostrarFaixa(id) {

    document.querySelectorAll(".faixa").forEach(f => {
        f.classList.add("hidden");
    });

    document.getElementById(id).classList.remove("hidden");

    window.scrollTo(0, 0);
}

// Seleciona todos os botões de acordeão
const acordeoes = document.querySelectorAll('.acordeao');

acordeoes.forEach(btn => {
    btn.addEventListener('click', function() {
        // Alterna a exibição do painel
        const painel = this.nextElementSibling;
        painel.classList.toggle('hidden');

        // Scroll suave até o acordeão clicado
        this.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

painel.scrollIntoView({ behavior: 'smooth', block: 'start' });


function abrirPoomsae(segundos) {
    window.open(
        `https://www.youtube.com/watch?v=y-pmLZmjoG8&t=${segundos}s`,
        "_blank"
    );
}

function iniciarSistema() {
    listarTecnicas();
    iniciarJogo();
    carregarJogo();
}

function iniciarJogo() {
    tecnicasEmbaralhadas = embaralhar([...tecnicas]);
    tecnicaAtualIndex = 0;
}

function cadastrarTecnica() {

    const imagem = document.getElementById("imagemInput").value;
    const resposta = document.getElementById("respostaInput").value.trim().split(" ");
    const erradas = document.getElementById("erradasInput").value
        .split(",")
        .map(p => p.trim())
        .filter(p => p !== "");

    if (!imagem || resposta.length === 0) {
        alert("Preencha imagem e resposta.");
        return;
    }

    tecnicas.push({ imagem, resposta, erradas });
    salvarStorage();

    document.getElementById("imagemInput").value = "";
    document.getElementById("respostaInput").value = "";
    document.getElementById("erradasInput").value = "";

    iniciarSistema();
}

function excluirTecnica(index) {
    tecnicas.splice(index, 1);
    salvarStorage();
    iniciarSistema();
}

function listarTecnicas() {
    const lista = document.getElementById("listaTecnicas");
    lista.innerHTML = "";

    tecnicas.forEach((t, i) => {
        const div = document.createElement("div");
        div.className = "tecnica-item";
        div.innerHTML = `
            ${t.resposta.join(" ")}
            <button onclick="excluirTecnica(${i})">Excluir</button>
        `;
        lista.appendChild(div);
    });
}

function toggleLista() {
    document.getElementById("listaContainer").classList.toggle("hidden");
}

function carregarJogo() {

    if (!tecnicasEmbaralhadas.length) return;

    const t = tecnicasEmbaralhadas[tecnicaAtualIndex];

    document.getElementById("imagemTecnica").src = t.imagem;

    respostaMontada = [];
    atualizarArea();

    // Garantia contra erro
    const resposta = Array.isArray(t.resposta) ? t.resposta : [];
    const erradas = Array.isArray(t.erradas) ? t.erradas : [];

    const opcoes = embaralhar([
        ...resposta,
        ...erradas
    ]);

    carregarOpcoes(opcoes);
}

function carregarOpcoes(opcoes) {
    const div = document.getElementById("opcoes");
    div.innerHTML = "";

    opcoes.forEach(p => {
        const btn = document.createElement("button");
        btn.innerText = p;
        btn.onclick = () => adicionarPalavra(p);
        div.appendChild(btn);
    });
}

function adicionarPalavra(p) {
    respostaMontada.push(p);
    atualizarArea();
}

function atualizarArea() {
    document.getElementById("areaMontada").innerText = respostaMontada.join(" ");
}

function apagarUltima() {
    respostaMontada.pop();
    atualizarArea();
}

function pularTecnica() {
    tecnicaAtualIndex++;
    if (tecnicaAtualIndex >= tecnicasEmbaralhadas.length) iniciarJogo();
    document.getElementById("resultado").innerText = "";
    carregarJogo();
}

function verificar() {

    const t = tecnicasEmbaralhadas[tecnicaAtualIndex];
    const overlay = document.getElementById("overlayResultado");
    const texto = document.getElementById("overlayTexto");

    overlay.classList.remove("hidden", "overlay-correto", "overlay-erro");

    if (JSON.stringify(respostaMontada) === JSON.stringify(t.resposta)) {

        texto.innerText = "✅ CORRETO! 👊🥋";
        overlay.classList.add("overlay-correto");

        setTimeout(() => {
            overlay.classList.add("hidden");
            tecnicaAtualIndex++;
            if (tecnicaAtualIndex >= tecnicasEmbaralhadas.length) iniciarJogo();
            carregarJogo();
        }, 1500);

    } else {

        texto.innerText = "❌ ERRADO!";
        overlay.classList.add("overlay-erro");

        setTimeout(() => {
            overlay.classList.add("hidden");
        }, 1500);
    }
}

function exportarTecnicas() {
    const blob = new Blob([JSON.stringify(tecnicas, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tecnicas-taekwondo.json";
    a.click();
}

document.getElementById("importFile").addEventListener("change", function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        tecnicas = JSON.parse(event.target.result);
        salvarStorage();
        iniciarSistema();
    };
    reader.readAsText(e.target.files[0]);
});

carregarTecnicasIniciais();

function resetarBanco() {

    if (!confirm("Tem certeza que deseja apagar os dados locais e recarregar o banco original?")) {
        return;
    }

    localStorage.clear();

    alert("Banco de dados resetado com sucesso!");

    location.reload(); // recarrega a página
}