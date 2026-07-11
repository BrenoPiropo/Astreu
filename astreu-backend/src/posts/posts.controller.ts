import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostsService } from "./posts.service";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "midia", maxCount: 1 },
        { name: "pdf", maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: "./uploads",
          filename: (req, file, cb) => {
            // Se for o PDF, mantemos o nome original
            if (file.fieldname === "pdf") {
              // Removemos espaços para evitar erros de URL no navegador
              const safeName = file.originalname.replace(/\s/g, "_");
              return cb(null, safeName);
            }

            // Para a imagem (midia), podemos manter o sufixo único para evitar conflitos
            const uniqueSuffix =
              Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, `midia-${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async create(
    @UploadedFiles()
    files: { midia?: Express.Multer.File[]; pdf?: Express.Multer.File[] },
    @Body() createPostDto: CreatePostDto,
  ) {
    const midiaFile = files.midia?.[0]?.filename;
    const pdfFile = files.pdf?.[0]?.filename;

    return this.postsService.create(createPostDto, midiaFile, pdfFile);
  }

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.postsService.findOne(+id);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.postsService.remove(+id);
  }
}
