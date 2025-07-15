import AdmZip from "adm-zip";
import archiver from "archiver";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import fs from "fs-extra";
import { NextRequest } from "next/server";
import os from "os";
import path from "path";

dayjs.extend(localizedFormat);
dayjs.locale("fr");

// Type des données envoyées depuis le client
interface TemplateRequestBody {
  client: string;
  bilan: string;
  formatrice: string;
  beneficiaire: string;
  objectifs: string;
  start_date: string;
  end_date: string;
}

// 🔁 Décompresse le template .pptx
async function extractPptx(templatePath: string, extractTo: string) {
  const zip = new AdmZip(templatePath);
  zip.extractAllTo(extractTo, true);
}

// 🔁 Remplace tous les placeholders dans les slides
async function replacePlaceholdersInSlides(
  folder: string,
  replacements: Record<string, string>
) {
  const slidesPath = path.join(folder, "ppt", "slides");
  const files = await fs.readdir(slidesPath);

  const parser = new XMLParser({ ignoreAttributes: false });
  const builder = new XMLBuilder({ ignoreAttributes: false });

  for (const file of files) {
    if (!file.startsWith("slide") || !file.endsWith(".xml")) continue;

    const filePath = path.join(slidesPath, file);
    const xml = await fs.readFile(filePath, "utf8");
    const json = parser.parse(xml);

    let modified = false;

    const shapes = json["p:sld"]?.["p:cSld"]?.["p:spTree"]?.["p:sp"];
    const allShapes = Array.isArray(shapes) ? shapes : shapes ? [shapes] : [];

    allShapes.forEach((shape) => {
      const paras = shape?.["p:txBody"]?.["a:p"];
      const paragraphs = Array.isArray(paras) ? paras : paras ? [paras] : [];

      paragraphs.forEach((p) => {
        const runs = Array.isArray(p["a:r"])
          ? p["a:r"]
          : p["a:r"]
          ? [p["a:r"]]
          : [];
        const newRuns = [];
        let i = 0;

        while (i < runs.length) {
          const run = runs[i];
          const val = run?.["a:t"];

          if (typeof val === "string" && val.includes("{{")) {
            let fullText = val;
            let endIndex = i;

            // Reconstituer tous les runs jusqu'à fermeture }}
            for (let j = i + 1; j < runs.length; j++) {
              const nextVal = runs[j]?.["a:t"];
              if (typeof nextVal !== "string") break;
              fullText += nextVal;
              endIndex = j;
              if (nextVal.includes("}}")) break;
            }

            // Remplacement des placeholders avec préservation des espaces
            const replacedText = fullText.replace(
              /\s*\{\{(.*?)\}\}\s*/g,
              (_, key) => {
                modified = true;
                return ` ${replacements[key.trim()] || ""} `;
              }
            );

            // Ajouter un seul run corrigé
            newRuns.push({ ...run, "a:t": replacedText });

            // Passer les runs utilisés
            i = endIndex + 1;
          } else {
            // Run normal, non concerné
            newRuns.push(run);
            i++;
          }
        }

        // Écriture des runs modifiés
        p["a:r"] = newRuns;
      });
    });

    if (modified) {
      const updatedXml = builder.build(json);
      await fs.writeFile(filePath, updatedXml, "utf8");
    }
  }
}

// 🔁 Zip le dossier pour produire le .pptx final
async function zipFolderToBuffer(folderPath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip");
    const chunks: Buffer[] = [];

    archive.directory(folderPath, false);
    archive.finalize();

    archive.on("data", (chunk) => chunks.push(chunk));
    archive.on("end", () => resolve(Buffer.concat(chunks)));
    archive.on("error", reject);
  });
}

// ✅ Handler Next.js API route
export async function POST(req: NextRequest) {
  const data = (await req.json()) as TemplateRequestBody;
  const {
    client,
    bilan,
    formatrice,
    beneficiaire,
    objectifs,
    start_date,
    end_date,
  } = data;

  const formatriceId = formatrice
    .split(" ")[0]
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const tempDir = path.join(os.tmpdir(), `pptx-${Date.now()}`);
  const fileName = `${formatriceId}_${bilan.toLowerCase()}.pptx`;
  const templatePath = path.join(
    process.cwd(),
    "public",
    "pptx-templates",
    fileName
  );

  if (!fs.existsSync(templatePath)) {
    return new Response(`Template ${fileName} introuvable`, { status: 404 });
  }

  try {
    await extractPptx(templatePath, tempDir);

    await replacePlaceholdersInSlides(tempDir, {
      client,
      bilan,
      formatrice,
      beneficiaire,
      objectifs,
      start_date: dayjs(start_date).format("D MMMM YYYY"),
      end_date: dayjs(end_date).format("D MMMM YYYY"),
    });

    const buffer = await zipFolderToBuffer(tempDir);

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition":
          "attachment; filename=document-personnalise.pptx",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération du pptx :", error);
    return new Response("Erreur interne serveur", { status: 500 });
  } finally {
    await fs.remove(tempDir);
  }
}
