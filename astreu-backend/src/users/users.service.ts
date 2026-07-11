import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Criar Usuário
  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(); // Gera o tempero da senha
    const hash = await bcrypt.hash(createUserDto.senha, salt); // Transforma em código

    const newUser = this.userRepository.create({
      ...createUserDto,
      senha: hash, // Salva a versão codificada
    });
    return this.userRepository.save(newUser);
  }
  // Listar todos os usuários
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // Buscar um por ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    return user;
  }
  // src/users/users.service.ts
  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email },
      select: ["id", "nome", "email", "senha"], // Força a seleção da senha aqui
    });
  }
  // Atualizar Perfil
  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }
  async login(email: string, senha: string) {
    const user = await this.userRepository.findOne({ where: { email, senha } });
    if (!user) throw new UnauthorizedException("Email ou senha incorretos");
    return user; // Por enquanto retornamos o usuário todo, depois implementamos JWT
  }
  // Deletar Conta
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
