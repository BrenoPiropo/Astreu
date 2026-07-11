import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import * as fs from "fs";
import { join } from "path";

@Controller("gallery")
export class GalleryController {
  @Get(":category")
  async getImages(@Param("category") category: string) {
    // Decodifica o nome (ex: "cosmos%20space" vira "cosmos space")
    const decodedCategory = decodeURIComponent(category);

    // Caminho: uploads/dataset/planets (sem o /1 no final)
    const directoryPath = join(
      process.cwd(),
      "uploads",
      "dataset",
      decodedCategory,
    );

    console.log("--- DEBUG GALERIA ---");
    console.log("Buscando em:", directoryPath);

    if (!fs.existsSync(directoryPath)) {
      throw new NotFoundException(
        `Setor espacial não encontrado: ${decodedCategory}`,
      );
    }

    const files = fs.readdirSync(directoryPath);

    // Retorna a lista de objetos com o nome e a URL pública
    return files
      .filter(
        (file) =>
          file.toLowerCase().endsWith(".jpg") ||
          file.toLowerCase().endsWith(".png"),
      )
      .map((file) => ({
        name: file,
        url: `http://10.0.2.2:3000/uploads/dataset/${category}/${file}`,
      }));
  }
}
