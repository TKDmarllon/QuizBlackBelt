/* ================================================= */
/* ================= VARIÁVEIS GLOBAIS ============== */
/* ================================================= */

let tecnicas = [];
let tecnicasEmbaralhadas = [];
let tecnicaAtualIndex = 0;
let respostaMontada = [];


/* ================================================= */
/* ================= LOCAL STORAGE ================= */
/* ================================================= */

function salvarStorage() {
    localStorage.setItem("tecnicas", JSON.stringify(tecnicas));
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


/* ================================================= */
/* ================= FUNÇÕES UTILITÁRIAS =========== */
/* ================================================= */

function embaralhar(array) {
    return array.sort(() => Math.random() - 0.5);
}


/* ================================================= */
/* ================= TROCA DE TELAS ================ */
/* ================================================= */

function trocarTela(id) {
    document.querySelectorAll(".tela").forEach(t => t.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
    window.scrollTo(0, 0);
}

/*=================================================*/
/*===============POONSAE===========================*/
/*=================================================*/

function abrirPoomsae(segundos) {
    window.open(
        `https://www.youtube.com/watch?v=y-pmLZmjoG8&t=${segundos}s`,
        "_blank"
    );
}

/* ================================================= */
/* ================= ABA APOSTILA ================== */
/* ================================================= */

function mostrarFaixa(id) {
    document.querySelectorAll(".faixa").forEach(f => f.classList.add("hidden"));

    const elementoAlvo = document.getElementById(id);

    if (elementoAlvo) {
        elementoAlvo.classList.remove("hidden");
        elementoAlvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


/* ================= ACORDEÃO ================= */

function ativarAcordeao() {
    document.querySelectorAll(".acordeao").forEach(botao => {
        botao.addEventListener("click", function () {
            this.classList.toggle("ativo");
            const painel = this.nextElementSibling;

            if (painel.style.display === "block") {
                painel.style.display = "none";
            } else {
                painel.style.display = "block";
                painel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}


/* ================= MINI QUIZ ================= */

function toggleResposta(botao) {
    const resposta = botao.nextElementSibling;
    resposta.classList.toggle("hidden");
}

function verificarResposta(select, respostaCorreta) {
    if (select.value === respostaCorreta) {
        select.style.backgroundColor = "#c8f7c5";
    } else {
        select.style.backgroundColor = "#f7c5c5";
    }
}


/* ================= DIGA O SIGNIFICADO ================= */
function ativarQuizSignificado() {

    const perguntas = document.querySelectorAll(".quiz-significado .pergunta");

    perguntas.forEach(pergunta => {

        const respostaCorreta = pergunta.dataset.resposta.trim();
        const botoes = pergunta.querySelectorAll("button");

        botoes.forEach(botao => {

            botao.addEventListener("click", function () {

                // trava todos os botões da pergunta
                botoes.forEach(b => {
                    b.disabled = true;
                    b.classList.remove("resultado-correto", "resultado-erro");
                });

                if (botao.innerText.trim() === respostaCorreta) {
                    botao.classList.add("resultado-correto");
                } else {
                    botao.classList.add("resultado-erro");

                    // marca o correto automaticamente
                    botoes.forEach(b => {
                        if (b.innerText.trim() === respostaCorreta) {
                            b.classList.add("resultado-correto");
                        }
                    });
                }

            });

        });

    });
}

function carregarOpcoesSignificado(opcoes, correta) {
    const div = document.getElementById("opcoesSignificado");
    if (!div) return;

    div.innerHTML = "";

    const opcoesEmbaralhadas = embaralhar([...opcoes]);

    opcoesEmbaralhadas.forEach(opcao => {
        const btn = document.createElement("button");
        btn.innerText = opcao;

        btn.addEventListener("click", function () {

            const grupo = div.querySelectorAll("button");

            grupo.forEach(b => {
                b.disabled = true;
                b.classList.remove("resultado-correto", "resultado-erro");
            });

            if (opcao === correta) {
                btn.classList.add("resultado-correto");
            } else {
                btn.classList.add("resultado-erro");

                grupo.forEach(b => {
                    if (b.innerText === correta) {
                        b.classList.add("resultado-correto");
                    }
                });
            }
        });

        div.appendChild(btn);
    });
}


/* ================================================= */
/* ================= ABA JOGO ====================== */
/* ================================================= */

function iniciarSistema() {
    listarTecnicas();
    iniciarJogo();
    carregarJogo();
}

function iniciarJogo() {
    tecnicasEmbaralhadas = embaralhar([...tecnicas]);
    tecnicaAtualIndex = 0;
}

function carregarJogo() {
    if (!tecnicasEmbaralhadas.length) return;

    const t = tecnicasEmbaralhadas[tecnicaAtualIndex];

    document.getElementById("imagemTecnica").src = t.imagem;

    respostaMontada = [];
    atualizarArea();

    const resposta = Array.isArray(t.resposta) ? t.resposta : [];
    const erradas = Array.isArray(t.erradas) ? t.erradas : [];

    const opcoes = embaralhar([...resposta, ...erradas]);
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


/* ================================================= */
/* ================= GERENCIAMENTO ================= */
/* ================================================= */

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
    if (!lista) return;

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


/* ================================================= */
/* ================= EXPORTAR / IMPORTAR =========== */
/* ================================================= */

function exportarTecnicas() {
    const blob = new Blob([JSON.stringify(tecnicas, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tecnicas-taekwondo.json";
    a.click();
}

function ativarImportacao() {
    const input = document.getElementById("importFile");
    if (!input) return;

    input.addEventListener("change", function(e) {
        const reader = new FileReader();
        reader.onload = function(event) {
            tecnicas = JSON.parse(event.target.result);
            salvarStorage();
            iniciarSistema();
        };
        reader.readAsText(e.target.files[0]);
    });
}


/* ================================================= */
/* ================= RESET ========================= */
/* ================================================= */

function resetarBanco() {
    if (!confirm("Tem certeza que deseja apagar os dados locais e recarregar o banco original?")) return;
    localStorage.clear();
    alert("Banco de dados resetado com sucesso!");
    location.reload();
}


/* ================================================= */
/* ================= INICIALIZAÇÃO ================= */
/* ================================================= */

document.addEventListener("DOMContentLoaded", function () {
    ativarAcordeao();
    ativarImportacao();
    ativarQuizSignificado(); // 👈 ADICIONE ISSO
    carregarTecnicasIniciais();
});
