const CLOUD_NAME = "mb1eetro";
const UPLOAD_PRESET = "walker-midia";

const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("fileInput");
const uploadBox = document.getElementById("uploadBox");
const uploadStatus = document.getElementById("uploadStatus");
const mediaGrid = document.getElementById("mediaGrid");

uploadButton.addEventListener("click", () => {
  fileInput.click();
});

uploadBox.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", async () => {
  const arquivo = fileInput.files[0];

  if (!arquivo) return;

  await enviarArquivo(arquivo);

  fileInput.value = "";
});

async function enviarArquivo(arquivo) {

  uploadStatus.textContent = "Enviando imagem...";

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

    if (!resposta.ok || !dados.secure_url) {
      throw new Error(
        dados.error?.message || "Não foi possível enviar a imagem."
      );
    }

    uploadStatus.textContent = "Imagem enviada com sucesso!";

    adicionarMidia(
      dados.secure_url,
      arquivo.name,
      arquivo.type
    );

  } catch (erro) {

    console.error(erro);

    uploadStatus.textContent =
      "Erro no upload: " + erro.message;
  }
}

function adicionarMidia(url, nome, tipo) {

  const card = document.createElement("article");

  card.className = "media-card";

  let visual = "";

  if (tipo.startsWith("video/")) {

    visual = `
      <video
        src="${url}"
        controls
        class="media-preview"
      ></video>
    `;

  } else {

    visual = `
      <img
        src="${url}"
        alt="${escaparHTML(nome)}"
        class="media-preview"
      >
    `;
  }

  card.innerHTML = `

    ${visual}

    <div class="media-info">

      <strong>${escaparHTML(nome)}</strong>

      <span>${tipo || "mídia"}</span>

      <div class="media-actions">

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

    </div>
  `;

  mediaGrid.appendChild(card);

  ativarBotoes(card);
}

function ativarBotoes(container) {

  const botoesCopiar =
    container.querySelectorAll(".copy");

  botoesCopiar.forEach(botao => {

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

  const botoesUsar =
    container.querySelectorAll(".use-site");

  botoesUsar.forEach(botao => {

    botao.addEventListener("click", () => {

      abrirEscolhaLocal(
        botao.dataset.url,
        botao.dataset.name
      );

    });

  });
}

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
        Onde você quer colocar esta imagem?
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

        <button data-local="outro">
          ✏️ Outro local
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

        aplicarFotoNoSite(url, nome, local);

        modal.remove();

      });

    });
}

function aplicarFotoNoSite(url, nome, local) {

  if (local === "capa") {

    const hero = document.querySelector(".hero");

    if (hero) {

      hero.style.backgroundImage =
        `url("${url}")`;

      alert("Imagem colocada na Capa.");

    }

    return;
  }

  if (local === "galeria") {

    const imagem =
      document.querySelector(".gallery-large img");

    if (imagem) {

      imagem.src = url;
      imagem.alt = nome;

      alert("Imagem colocada na Galeria.");

    }

    return;
  }

  if (local === "projeto") {

    const imagem =
      document.querySelector(".gallery-large img");

    if (imagem) {

      imagem.src = url;
      imagem.alt = nome;

      alert("Imagem colocada no Projeto.");

    }

    return;
  }

  if (local === "perfil") {

    const imagem =
      document.querySelector(".walker-logo img");

    if (imagem) {

      imagem.src = url;

      alert("Imagem colocada no Perfil.");

    }

    return;
  }

  if (local === "outro") {

    const lugar =
      prompt("Digite o local onde quer colocar a imagem:");

    if (lugar) {

      alert(
        `Imagem "${nome}" selecionada para: ${lugar}`
      );

    }

  }
}

function escaparHTML(texto) {

  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// Ativa os botões que já existem no HTML
ativarBotoes(document);


// Botão principal da plataforma
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


