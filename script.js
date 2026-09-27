```javascript
const CLOUD_NAME = "mb1eetro";
const UPLOAD_PRESET = "walker-midia";


const fileInput =
  document.getElementById("fileInput");

const uploadButton =
  document.getElementById("uploadButton");

const uploadBox =
  document.getElementById("uploadBox");

const mediaGrid =
  document.getElementById("mediaGrid");

const uploadStatus =
  document.getElementById("uploadStatus");


/* =========================================
   UPLOAD
========================================= */

uploadButton.addEventListener(
  "click",
  function() {
    fileInput.click();
  }
);


uploadBox.addEventListener(
  "click",
  function() {
    fileInput.click();
  }
);


fileInput.addEventListener(
  "change",
  function() {

    const arquivo =
      fileInput.files[0];

    if (!arquivo) {
      return;
    }

    enviarArquivo(arquivo);
  }
);


async function enviarArquivo(arquivo) {

  uploadStatus.style.display = "block";

  uploadStatus.textContent =
    "Enviando mídia...";


  const formData =
    new FormData();


  formData.append(
    "file",
    arquivo
  );


  formData.append(
    "upload_preset",
    UPLOAD_PRESET
  );


  try {

    const resposta =
      await fetch(
        "https://api.cloudinary.com/v1_1/" +
        CLOUD_NAME +
        "/auto/upload",
        {
          method: "POST",
          body: formData
        }
      );


    const data =
      await resposta.json();


    if (!resposta.ok) {

      throw new Error(
        data.error?.message ||
        "Erro no upload"
      );

    }


    let url =
      data.secure_url;


    if (
      arquivo.type.startsWith("image/")
    ) {

      url =
        url.replace(
          "/image/upload/",
          "/image/upload/f_jpg,q_auto,w_1200/"
        );

    }


    adicionarMidia(
      url,
      arquivo.name,
      arquivo.type
    );


    uploadStatus.textContent =
      "✓ Upload concluído!";


    fileInput.value = "";


  } catch (erro) {

    console.error(erro);

    uploadStatus.textContent =
      "Erro no upload: " +
      erro.message;

  }

}


/* =========================================
   ADICIONAR MÍDIA
========================================= */

function adicionarMidia(
  url,
  nome,
  tipo
) {

  const card =
    document.createElement("div");

  card.className =
    "media-card";


  const imagem =
    document.createElement("div");

  imagem.className =
    "media-image";


  if (
    tipo.startsWith("video/")
  ) {

    const video =
      document.createElement("video");

    video.src = url;

    video.controls = true;

    video.style.width = "100%";

    video.style.height = "100%";

    video.style.objectFit = "cover";

    imagem.appendChild(video);

  } else {

    const img =
      document.createElement("img");

    img.src = url;

    img.alt = nome;

    imagem.appendChild(img);

  }


  const info =
    document.createElement("div");

  info.className =
    "media-info";


  const titulo =
    document.createElement("strong");

  titulo.textContent =
    nome;


  const tipoArquivo =
    document.createElement("span");

  tipoArquivo.textContent =
    tipo.startsWith("video/")
      ? "Vídeo"
      : "Imagem";


  const urlBox =
    document.createElement("div");

  urlBox.className =
    "media-url";

  urlBox.textContent =
    url;


  /* =====================================
     COPIAR URL
  ===================================== */

  const copiar =
    document.createElement("button");

  copiar.className =
    "copy";

  copiar.textContent =
    "Copiar URL";


  copiar.addEventListener(
    "click",
    async function() {

      try {

        await navigator.clipboard.writeText(
          url
        );

        copiar.textContent =
          "✓ Copiado";


        setTimeout(
          function() {

            copiar.textContent =
              "Copiar URL";

          },
          1500
        );

      } catch {

        copiar.textContent =
          "Copie a URL";

      }

    }
  );


  /* =====================================
     USAR NO SITE
  ===================================== */

  const usarNoSite =
    document.createElement("button");

  usarNoSite.className =
    "use-site";

  usarNoSite.textContent =
    "Usar no site";


  usarNoSite.addEventListener(
    "click",
    function() {

      abrirEscolhaLocal(
        url,
        nome
      );

    }
  );


  info.appendChild(titulo);
  info.appendChild(tipoArquivo);
  info.appendChild(urlBox);
  info.appendChild(copiar);
  info.appendChild(usarNoSite);


  card.appendChild(imagem);
  card.appendChild(info);


  mediaGrid.prepend(card);


  /* Mantém somente 2 mídias na visualização */

  while (
    mediaGrid.children.length > 2
  ) {

    mediaGrid.lastElementChild.remove();

  }

}


/* =========================================
   BOTÕES "COPIAR URL" DAS FOTOS EXISTENTES
========================================= */

document
  .querySelectorAll(".copy")
  .forEach(
    function(botao) {

      botao.addEventListener(
        "click",
        async function() {

          const url =
            botao.dataset.url;

          if (!url) {
            return;
          }


          try {

            await navigator.clipboard.writeText(
              url
            );

            botao.textContent =
              "✓ Copiado";


            setTimeout(
              function() {

                botao.textContent =
                  "Copiar URL";

              },
              1500
            );

          } catch {

            botao.textContent =
              "Copie a URL";

          }

        }
      );

    }
  );


/* =========================================
   BOTÕES "USAR NO SITE" DAS FOTOS EXISTENTES
========================================= */

document
  .querySelectorAll(".use-site")
  .forEach(
    function(botao) {

      botao.addEventListener(
        "click",
        function() {

          const url =
            botao.dataset.url;

          const nome =
            botao.dataset.name ||
            "imagem";

          abrirEscolhaLocal(
            url,
            nome
          );

        }
      );

    }
  );


/* =========================================
   JANELA PARA ESCOLHER O LOCAL
========================================= */

function abrirEscolhaLocal(
  url,
  nome
) {

  const modal =
    document.createElement("div");

  modal.className =
    "site-modal";


  modal.innerHTML = `

    <div class="site-modal-box">

      <button
        class="site-modal-close"
        aria-label="Fechar"
      >
        ×
      </button>

      <h2>
        Usar esta foto no site
      </h2>

      <p>
        Onde você quer colocar:
        <strong>${escaparHTML(nome)}</strong>?
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


  const fechar =
    modal.querySelector(
      ".site-modal-close"
    );


  fechar.addEventListener(
    "click",
    function() {

      modal.remove();

    }
  );


  modal.addEventListener(
    "click",
    function(event) {

      if (
        event.target === modal
      ) {

        modal.remove();

      }

    }
  );


  modal
    .querySelectorAll("[data-local]")
    .forEach(
      function(botao) {

        botao.addEventListener(
          "click",
          function() {

            const local =
              botao.dataset.local;


            aplicarFotoNoSite(
              url,
              local
            );


            modal.remove();

          }
        );

      }
    );

}


/* =========================================
   COLOCAR FOTO NO LOCAL ESCOLHIDO
========================================= */

function aplicarFotoNoSite(
  url,
  local
) {

  let elemento = null;


  if (
    local === "capa"
  ) {

    elemento =
      document.querySelector(
        ".hero"
      );

  }


  if (
    local === "galeria"
  ) {

    elemento =
      document.querySelector(
        ".gallery-large img"
      );

  }


  if (
    local === "perfil"
  ) {

    elemento =
      document.querySelector(
        ".walker-logo img"
      );

  }


  if (
    local === "projeto"
  ) {

    elemento =
      document.querySelector(
        ".gallery-large img"
      );

  }


  if (
    elemento &&
    elemento.tagName === "IMG"
  ) {

    elemento.src =
      url;


    alert(
      "✓ Foto colocada no site!"
    );


    return;

  }


  if (
    elemento
  ) {

    elemento.style.backgroundImage =
      `url("${url}")`;


    alert(
      "✓ Foto colocada no site!"
    );


    return;

  }


  const nomeLocal =
    prompt(
      "Digite onde você quer colocar esta foto:"
    );


  if (
    nomeLocal
  ) {

    alert(
      "✓ Foto selecionada para: " +
      nomeLocal
    );

  }

}


/* =========================================
   PROTEÇÃO DO NOME DA FOTO
========================================= */

function escaparHTML(
  texto
) {

  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================
   BOTÃO COMEÇAR
========================================= */

document
  .getElementById("startButton")
  .addEventListener(
    "click",
    function() {

      document
        .getElementById("plataforma")
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );
```
