const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Diretório base onde os PDFs serão salvos
const BASE_DIR = path.join(__dirname, "uploads", "seed-articles");

// Mapeamento das categorias
const categorias = {
  constellation: "all:constellation AND all:review AND cat:astro-ph",
  "cosmos-space": "all:cosmology AND all:overview AND cat:astro-ph",
  galaxies: "all:galaxy AND all:review AND cat:astro-ph",
  nebula: "all:nebula AND all:review AND cat:astro-ph",
  planets: "all:exoplanet AND all:review AND cat:astro-ph",
  stars: "all:stellar AND all:review AND cat:astro-ph",
};

// 💡 Definição da quantidade desejada
const MAX_ARTIGOS = 7;

function sanitizarNomeArquivo(titulo) {
  return titulo
    .replace(/[\r\n]+/g, " ")
    .replace(/[^a-zA-Z0-9\s-_]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .substring(0, 120);
}

function limparTexto(texto) {
  return texto
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function garantirDiretorios() {
  if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
  }
  Object.keys(categorias).forEach((categoria) => {
    const dir = path.join(BASE_DIR, categoryToFolderName(categoria));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function categoryToFolderName(categoria) {
  if (categoria === "cosmos-space") return "cosmos space";
  return categoria;
}

async function baixarPdf(url, caminhoSalvar) {
  const writer = fs.createWriteStream(caminhoSalvar);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function popularBancoDeDados() {
  console.log(
    `🚀 Iniciando o Seed de Artigos do Astreu Hub (${MAX_ARTIGOS} por categoria)...`,
  );
  garantirDiretorios();

  const listaCitacoes = [];
  listaCitacoes.push("==================================================");
  listaCitacoes.push("    REFERÊNCIAS E CITAÇÕES - ASTREU HUB (TCC)");
  listaCitacoes.push("==================================================\n");

  for (const [categoria, query] of Object.entries(categorias)) {
    const pastaDestino = categoryToFolderName(categoria);
    console.log(
      `\n🌌 Buscando ${MAX_ARTIGOS} artigos para: [${pastaDestino}]...`,
    );

    try {
      // 💡 Atualizado max_results para MAX_ARTIGOS
      const urlArxiv = `http://export.arxiv.org/api/query?search_query=${encodeURIComponent(query)}&max_results=${MAX_ARTIGOS}`;
      const response = await axios.get(urlArxiv);
      const xml = response.data;

      const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
      const titleRegex = /<title>([\s\S]*?)<\/title>/;
      const idRegex = /<id>http:\/\/arxiv\.org\/abs\/(.+?)<\/id>/;
      const authorNameRegex = /<name>([\s\S]*?)<\/name>/g;

      let matchEntry;
      let contador = 1;

      // 💡 Atualizado loop para contador <= MAX_ARTIGOS
      while (
        (matchEntry = entryRegex.exec(xml)) !== null &&
        contador <= MAX_ARTIGOS
      ) {
        const entryContent = matchEntry[1];
        const matchTitle = titleRegex.exec(entryContent);
        const matchId = idRegex.exec(entryContent);

        if (matchTitle && matchId) {
          const tituloOriginal = limparTexto(matchTitle[1]);
          const artigoId = matchId[1].trim();

          const autores = [];
          let matchAuthor;
          while ((matchAuthor = authorNameRegex.exec(entryContent)) !== null) {
            autores.push(limparTexto(matchAuthor[1]));
          }
          const autoresFormatados =
            autores.length > 0 ? autores.join(", ") : "Autor desconhecido";

          const tituloSanitizado = sanitizarNomeArquivo(tituloOriginal);
          const nomeArquivo = `${tituloSanitizado}.pdf`;
          const caminhoSalvar = path.join(BASE_DIR, pastaDestino, nomeArquivo);
          const pdfUrl = `http://arxiv.org/pdf/${artigoId}.pdf`;

          console.log(
            `   📥 [${contador}/${MAX_ARTIGOS}] Baixando: "${tituloOriginal.substring(0, 45)}..."`,
          );

          try {
            await baixarPdf(pdfUrl, caminhoSalvar);
            console.log(`   ✅ Salvo!`);

            listaCitacoes.push(`CATEGORIA: ${pastaDestino.toUpperCase()}`);
            listaCitacoes.push(`TÍTULO: ${tituloOriginal}`);
            listaCitacoes.push(`AUTORES: ${autoresFormatados}`);
            listaCitacoes.push(`ARQUIVO: ${nomeArquivo}`);
            listaCitacoes.push(
              `LINK ORIGINAL: http://arxiv.org/abs/${artigoId}`,
            );
            listaCitacoes.push(
              `--------------------------------------------------\n`,
            );

            contador++;
          } catch (downloadError) {
            console.error(
              `   ❌ Falha ao baixar, pulando...`,
              downloadError.message,
            );
          }
        }
      }
    } catch (error) {
      console.error(
        `❌ Erro na API do arXiv para ${pastaDestino}:`,
        error.message,
      );
    }
  }

  const caminhoCitacoes = path.join(BASE_DIR, "referencias_citacoes.txt");
  fs.writeFileSync(caminhoCitacoes, listaCitacoes.join("\n"), "utf-8");

  console.log("\n🎉 Processo finalizado!");
}

popularBancoDeDados();
