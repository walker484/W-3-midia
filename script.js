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

    console.log("RESPOSTA CLOUDINARY:", dados);


    if (!resposta.ok) {

      const mensagem =
        dados.error?.message ||
        "Erro desconhecido no Cloudinary.";

      throw new Error(mensagem);
    }


    if (!dados.secure_url) {

      throw new Error(
        "O Cloudinary não retornou a URL da imagem."
      );

    }


    // SUCESSO

    uploadStatus.innerHTML = `
      <strong>Upload concluído!</strong>
      <br>
      URL gerada:
      <br>
      <a
        href="${dados.secure_url}"
        target="_blank"
        style="word-break:break-all;"
      >
        ${dados.secure_url}
      </a>
    `;


    adicionarMidia(
      dados.secure_url,
      arquivo.name,
      arquivo.type
    );


  } catch (erro) {

    console.error("ERRO UPLOAD:", erro);

    uploadStatus.innerHTML = `
      <strong>Erro no upload</strong>
      <br>
      ${escaparHTML(erro.message)}
    `;

  }


  fileInput.value = "";

}


// ===============================
// ADICIONAR NA BIBLIOTECA
// ===============================

function adicionarMidia(url, nome, tipo) {

  const card = document.createElement("article");

  card.className = "media-card";


  let visual;


  if (tipo.startsWith("video/")) {

    visual = `
      <div class="media-image">
        <video
          src="${url}"
          controls
          style="width:100%;height:100%;object-fit:cover;"
        ></video>
      </div>
    `;

  } else {

    visual = `
      <div class="media-image">
        <img
          src="${url}"
          alt="${escaparHTML(nome)}"
        >
      </div>
    `;

  }


  card.innerHTML = `

    ${visual}

    <div class="media-info">

      <strong>
        ${escaparHTML(nome)}
      </strong>

      <span>
        ${tipo || "mídia"}
      </span>

      <div class="media-url">
        ${escaparHTML(url)}
      </div>

      <button
        class="copy"
        data-url="${url}"
      >
        Copiar URL
      </button>

      <button
        class="use-site"
        data-url="${url}"
        data-name="${escaparHTML(nome)}"
      >
        Usar no site
      </button>

    </div>

  `;


  mediaGrid.appendChild(card);


  ativarBotoes(card);

}


// ===============================
// BOTÕES
// ===============================

function ativarBotoes(container) {


  // COPIAR URL

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


  // USAR NO SITE

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

      <h2>
        Usar no site
      </h2>

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

        const local = botao.dataset.local;

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
// SEGURANÇA HTML
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

