import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "fs";
import { join } from "path";
import { Repository } from "typeorm";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostComunidade } from "./entities/post.entity";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostComunidade)
    private postsRepository: Repository<PostComunidade>,
  ) {}

  // Criar Post
  // src/posts/posts.service.ts
  async create(dto: CreatePostDto, filenameMidia: string, filenamePdf: string) {
    const post = this.postsRepository.create({
      titulo: dto.titulo,
      conteudo: dto.conteudo,
      tipo: dto.tipo,
      url_midia: filenameMidia, // Nome gerado pelo Multer
      url_pdf: filenamePdf, // Nome gerado pelo Multer
      usuario: { id: Number(dto.usuarioId) },
    });
    return await this.postsRepository.save(post);
  }
  // Listar todos
  async findAll() {
    return await this.postsRepository.find({
      relations: ["usuario"],
      order: { id: "DESC" },
    });
  }

  // Buscar um por ID
  async findOne(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ["usuario"],
    });
    if (!post) throw new NotFoundException(`Post com ID ${id} não encontrado`);
    return post;
  }

  // Remover Post e os Arquivos Físicos
  async remove(id: number) {
    const post = await this.findOne(id);

    // Apaga os arquivos da pasta uploads antes de deletar do banco
    this.deletePhysicalFile(post.url_midia);
    this.deletePhysicalFile(post.url_pdf);

    return await this.postsRepository.remove(post);
  }

  // Atualizar (Opcional)
  async update(id: number, updateDto: Partial<CreatePostDto>) {
    const post = await this.findOne(id);
    const updated = this.postsRepository.merge(post, updateDto);
    return await this.postsRepository.save(updated);
  }

  /**
   * Função auxiliar para deletar arquivos do disco
   */
  private deletePhysicalFile(filename: string) {
    if (!filename) return;

    // Caminho da pasta uploads (ajuste conforme sua estrutura)
    const filePath = join(__dirname, "..", "..", "uploads", filename);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Arquivo removido: ${filename}`);
      }
    } catch (err) {
      console.error(`Erro ao deletar arquivo ${filename}:`, err);
    }
  }
}
