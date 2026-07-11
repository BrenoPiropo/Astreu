import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DiarioBordo } from "../../diario/entities/diario.entity";
import { Meta } from "../../diario/entities/meta.entity"; // Importe a nova entidade
import { PostComunidade } from "../../posts/entities/post.entity";
@Entity("usuarios")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @OneToMany(() => PostComunidade, (post) => post.usuario)
  posts: PostComunidade[];

  @OneToMany(() => DiarioBordo, (diario) => diario.usuario)
  diarios: DiarioBordo[];
    @OneToMany(() => Meta, (meta) => meta.usuario)
    metas: Meta[];
}
