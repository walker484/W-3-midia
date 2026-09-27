// ===============================
// WALKER MÍDIA
// Cloudinary + Usar no site
// ===============================

const CLOUD_NAME = "mb1eetro";
const UPLOAD_PRESET = "walker-midia";

const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("fileInput");
const uploadBox = document.getElementById("uploadBox");
const uploadStatus = document.getElementById("uploadStatus");
const mediaGrid = document.getElementById("mediaGrid");


// ===============================
// ABRIR GALERIA DO CELULAR
// ===============================

if (uploadButton) {
  uploadButton.addEventListener("click", () => {
    fileInput.click();
  });
}

if (uploadBox) {
  uploadBox.addEventListener("click", () => {
    fileInput.click();
  });
}


// ===============================
// ESCOLHEU FOTO/VÍDEO
// ===============================

if (fileInput) {
  fileInput.addEventListener("change", () => {

    const arquivo = fileInput.files[0];

    if (!arquivo) return;

    enviarArquivo(arquivo);
  });
}


// ===============================
// UPLOAD PARA CLOUDINARY
// ===============================

async function enviarArquivo(arquivo) {

  if (uploadStatus) {
    uploadStatus.textContent = "Enviando mídia...";
  }

  const formData = new FormData();

  formData.append("file", arquivo);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {

    const resposta = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    const dados = await resposta.json();

    console.log("Cloudinary:", dados);

    if (!resposta.ok) {

      throw new Error(
        dados.error?.message ||
        "Erro no upload."
      );
    }

    if (!dados.secure_url) {

      throw new Error(
        "Cloudinary não retornou a URL."
      );
    }


    // Atualiza a primeira foto da biblioteca
    atualizarFotoPrincipal(
      dados.secure_url,
      arquivo.name,
      arquivo.type
    );


    if (uploadStatus) {

      uploadStatus.innerHTML = `
        <strong>Upload concluído!</strong>
        <br><br>

        <span style="word-break:break-all;">
          ${escaparHTML(dados.secure_url)}
        </span>
      `;
    }

  } catch (erro) {

    console.error(erro);

    if (uploadStatus) {

      uploadStatus.innerHTML = `
        <strong>Erro no upload</strong>
        <br>
        ${escaparHTML(erro.message)}
      `;
    }
  }

  fileInput.value = "";
}


// ===============================
// ATUALIZA FOTO DA BIBLIOTECA
// ===============================

function atualizarFotoPrincipal(url, nome, tipo) {

  if (!mediaGrid) return;

  const primeiroCard =
    mediaGrid.querySelector(".media-card");

  if (!primeiroCard) return;


  const imagem =
    primeiroCard.querySelector(".media-image img");

  const nomeArquivo =
    primeiroCard.querySelector(".media-info strong");

  const tipoArquivo =
    primeiroCard.querySelector(".media-info span");

  const urlArquivo =
    primeiroCard.querySelector(".media-url");

  const botaoCopiar =
    primeiroCard.querySelector(".copy");

  const botaoUsar =
    primeiroCard.querySelector(".use-site");


  if (imagem) {

    imagem.src = url;
    imagem.alt = nome;
  }


  if (nomeArquivo) {

    nomeArquivo.textContent = nome;
  }


  if (tipoArquivo) {

    tipoArquivo.textContent =
      tipo || "Imagem";
  }


  if (urlArquivo) {

    urlArquivo.textContent = url;
  }


  if (botaoCopiar) {

    botaoCopiar.dataset.url = url;
  }


  if (botaoUsar) {

    botaoUsar.dataset.url = url;
    botaoUsar.dataset.name = nome;
  }
}


// ===============================
// BOTÕES DA BIBLIOTECA
// ===============================

function ativarBotoes(container) {

  if (!container) return;


  // COPIAR URL

  container
    .querySelectorAll(".copy")
    .forEach(botao => {

      botao.addEventListener("click", async () => {

        const url = botao.dataset.url;

        if (!url) return;

        try {

          await navigator.clipboard.writeText(url);

          const textoOriginal =
            botao.textContent;

          botao.textContent = "Copiado!";

          setTimeout(() => {

            botao.textContent =
              textoOriginal;

          }, 1500);

        } catch {

          alert(
            "Não foi possível copiar a URL."
          );
        }

      });

    });


  // USAR NO SITE

  container
    .querySelectorAll(".use-site")
    .forEach(botao => {

      botao.addEventListener("click", () => {

        const url =
          botao.dataset.url;

        const nome =
          botao.dataset.name;

        if (!url) return;

        abrirEscolhaLocal(
          url,
          nome
        );

      });

    });
}


// ===============================
// JANELA "USAR NO SITE"
// ===============================

function abrirEscolhaLocal(url, nome) {

  const modal =
    document.createElement("div");

  modal.className =
    "site-modal";


  modal.innerHTML = `

    <div class="site-modal-box">

      <button
        class="site-modal-close"
        type="button"
      >
        ×
      </button>

      <h2>Usar no site</h2>

      <p>
        Onde você quer colocar esta foto?
      </p>

      <div class="site-options">

        <button
          type="button"
          data-local="capa"
        >
          🏠 Capa
        </button>

        <button
          type="button"
          data-local="galeria"
        >
          🖼️ Galeria
        </button>

        <button
          type="button"
          data-local="projeto"
        >
          📁 Projeto
        </button>

        <button
          type="button"
          data-local="perfil"
        >
          👤 Perfil
        </button>

      </div>

    </div>
  `;


  document.body.appendChild(modal);


  // FECHAR

  modal
    .querySelector(".site-modal-close")
    .addEventListener("click", () => {

      modal.remove();

    });


  // ESCOLHER LOCAL

  modal
    .querySelectorAll(".site-options button")
    .forEach(botao => {

      botao.addEventListener("click", () => {

        const local =
          botao.dataset.local;

        aplicarFotoNoSite(
          url,
          nome,
          local
        );

        modal.remove();

      });

    });
}


// ===============================
// APLICA FOTO NO SITE
// ===============================

function aplicarFotoNoSite(
  url,
  nome,
  local
) {


  // =============================
  // CAPA
  // =============================

  if (local === "capa") {

    const hero =
      document.querySelector(".hero");

    if (hero) {

      hero.style.backgroundImage =
        `url("${url}")`;

      hero.style.backgroundSize =
        "cover";

      hero.style.backgroundPosition =
        "center";

      mostrarAviso(
        "Foto colocada na Capa."
      );
    }

    return;
  }


  // =============================
  // GALERIA
  // =============================

  if (local === "galeria") {

    const imagem =
      document.querySelector(
        ".gallery-large img"
      );

    if (imagem) {

      imagem.src = url;

      imagem.alt =
        nome || "Imagem da galeria";

      mostrarAviso(
        "Foto colocada na Galeria."
      );
    }

    return;
  }


  // =============================
  // PROJETO
  // =============================

  if (local === "projeto") {

    const imagem =
      document.querySelector(
        ".gallery-large img"
      );

    if (imagem) {

      imagem.src = url;

      imagem.alt =
        nome || "Imagem do projeto";

      mostrarAviso(
        "Foto colocada no Projeto."
      );
    }

    return;
  }


  // =============================
  // PERFIL
  // =============================

  if (local === "perfil") {

    const imagem =
      document.querySelector(
        ".walker-logo img"
      );

    if (imagem) {

      imagem.src = url;

      imagem.alt =
        nome || "Perfil";

      mostrarAviso(
        "Foto colocada no Perfil."
      );
    }

    return;
  }
}


// ===============================
// AVISO NA TELA
// ===============================

function mostrarAviso(mensagem) {

  const aviso =
    document.createElement("div");

  aviso.textContent =
    mensagem;

  aviso.style.position =
    "fixed";

  aviso.style.left =
    "50%";

  aviso.style.bottom =
    "25px";

  aviso.style.transform =
    "translateX(-50%)";

  aviso.style.background =
    "#0d1b2a";

  aviso.style.color =
    "#fff";

  aviso.style.padding =
    "14px 20px";

  aviso.style.borderRadius =
    "12px";

  aviso.style.zIndex =
    "99999";

  aviso.style.boxShadow =
    "0 8px 30px rgba(0,0,0,.3)";

  document.body.appendChild(aviso);


  setTimeout(() => {

    aviso.remove();

  }, 2000);
}


// ===============================
// PROTEÇÃO HTML
// ===============================

function escaparHTML(texto) {

  return String(texto)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );
}


// ===============================
// INICIALIZAÇÃO
// ===============================

ativarBotoes(document);


// ===============================
// BOTÃO COMEÇAR
// ===============================

const startButton =
  document.getElementById(
    "startButton"
  );

if (startButton) {

  startButton.addEventListener(
    "click",
    () => {

      const plataforma =
        document.getElementById(
          "plataforma"
        );

      if (plataforma) {

        plataforma.scrollIntoView({
          behavior: "smooth"
        });

      }

    }
  );
}
