const CLOUD_NAME = "mb1eetro";
const UPLOAD_PRESET = "walker-midia";

const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("fileInput");
const uploadBox = document.getElementById("uploadBox");
const uploadStatus = document.getElementById("uploadStatus");
const mediaGrid = document.getElementById("mediaGrid");


// ===============================
// ABRIR GALERIA
// ===============================

uploadButton.addEventListener("click", () => {
  fileInput.click();
});

uploadBox.addEventListener("click", () => {
  fileInput.click();
});


// ===============================
// ESCOLHEU FOTO
// ===============================

fileInput.addEventListener("change", () => {

  const arquivo = fileInput.files[0];

  if (!arquivo) return;

  enviarArquivo(arquivo);

});


// ===============================
// UPLOAD CLOUDINARY
// ===============================

async function enviarArquivo(arquivo) {

  uploadStatus.textContent = "Enviando foto...";

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


    // ===============================
    // ATUALIZA O CARD EXISTENTE
    // ===============================

    atualizarFotoPrincipal(
      dados.secure_url,
      arquivo.name,
      arquivo.type
    );


    // ===============================
    // MOSTRA URL
    // ===============================

    uploadStatus.innerHTML = `
      <strong>Upload concluído!</strong>
      <br><br>

      <a
        href="${dados.secure_url}"
        target="_blank"
        style="word-break:break-all;"
      >
        ${dados.secure_url}
      </a>
    `;


  } catch (erro) {

    console.error("Erro:", erro);

    uploadStatus.innerHTML = `
      <strong>Erro no upload</strong>
      <br>
      ${escaparHTML(erro.message)}
    `;

  }

  fileInput.value = "";
}


// ===============================
// ATUALIZAR O CARD DA BIBLIOTECA
// ===============================

function atualizarFotoPrincipal(url, nome, tipo) {

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


  // FOTO

  if (imagem) {

    imagem.src = url;
    imagem.alt = nome;

  }


  // NOME

  if (nomeArquivo) {

    nomeArquivo.textContent = nome;

  }


  // TIPO

  if (tipoArquivo) {

    tipoArquivo.textContent =
      tipo || "Imagem";

  }


  // URL

  if (urlArquivo) {

    urlArquivo.textContent = url;

  }


  // BOTÃO COPIAR

  if (botaoCopiar) {

    botaoCopiar.dataset.url = url;

  }


  // BOTÃO USAR NO SITE

  if (botaoUsar) {

    botaoUsar.dataset.url = url;
    botaoUsar.dataset.name = nome;

  }

}


// ===============================
// BOTÕES
// ===============================

function ativarBotoes(container) {

  container
    .querySelectorAll(".copy")
    .forEach(botao => {

      botao.addEventListener("click", async () => {

        const url = botao.dataset.url;

        try {

          await navigator.clipboard.writeText(url);

          botao.textContent = "Copiado!";

          setTimeout(() => {

            botao.textContent = "Copiar URL";

          }, 1500);

        } catch {

          alert("Não foi possível copiar a URL.");

        }

      });

    });


  container
    .querySelectorAll(".use-site")
    .forEach(botao => {

      botao.addEventListener("click", () => {

        abrirEscolhaLocal(
          botao.dataset.url,
          botao.dataset.name
        );

      });

    });

}


// ===============================
// ESCOLHER LOCAL
// ===============================

function abrirEscolhaLocal(url, nome) {

  const modal = document.createElement("div");

  modal.className = "site-modal";

  modal.innerHTML = `

    <div class="site-modal-box">

      <button class="site-modal-close">
        ×
      </button>

      <h2>Usar no site</h2>

      <p>
        Onde você quer colocar esta foto?
      </p>

      <div class="site-options">

        <button data-local="capa">
          🏠 Capa
        </button>

        <button data-local="galeria">
          🖼️ Galeria
        </button>

        <button data-local="projeto">
          📁 Projeto
        </button>

        <button data-local="perfil">
          👤 Perfil
        </button>

      </div>

    </div>
  `;

  document.body.appendChild(modal);


  modal
    .querySelector(".site-modal-close")
    .addEventListener("click", () => {

      modal.remove();

    });


  modal
    .querySelectorAll(".site-options button")
    .forEach(botao => {

      botao.addEventListener("click", () => {

        aplicarFotoNoSite(
          url,
          nome,
          botao.dataset.local
        );

        modal.remove();

      });

    });

}


// ===============================
// COLOCAR FOTO NO SITE
// ===============================

function aplicarFotoNoSite(url, nome, local) {

  if (local === "capa") {

    const hero =
      document.querySelector(".hero");

    if (hero) {

      hero.style.backgroundImage =
        `url("${url}")`;

      alert("Foto colocada na Capa.");

    }

    return;
  }


  if (local === "galeria") {

    const imagem =
      document.querySelector(".gallery-large img");

    if (imagem) {

      imagem.src = url;
      imagem.alt = nome;

      alert("Foto colocada na Galeria.");

    }

    return;
  }


  if (local === "projeto") {

    const imagem =
      document.querySelector(".gallery-large img");

    if (imagem) {

      imagem.src = url;
      imagem.alt = nome;

      alert("Foto colocada no Projeto.");

    }

    return;
  }


  if (local === "perfil") {

    const imagem =
      document.querySelector(".walker-logo img");

    if (imagem) {

      imagem.src = url;

      alert("Foto colocada no Perfil.");

    }

    return;
  }

}


// ===============================
// SEGURANÇA
// ===============================

function escaparHTML(texto) {

  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// ===============================
// ATIVAR BOTÕES EXISTENTES
// ===============================

ativarBotoes(document);


// ===============================
// BOTÃO COMEÇAR
// ===============================

const startButton =
  document.getElementById("startButton");

if (startButton) {

  startButton.addEventListener("click", () => {

    const plataforma =
      document.getElementById("plataforma");

    if (plataforma) {

      plataforma.scrollIntoView({
        behavior: "smooth"
      });

    }

  });

}

