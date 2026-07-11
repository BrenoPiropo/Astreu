import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { DiarioBordo } from "../../entities/diario.entity";

@Entity("fotos_diario")
export class FotoDiario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "longtext" }) // Usamos longtext para suportar o tamanho do Base64
  url_foto: string;

  @ManyToOne(() => DiarioBordo, (diario) => diario.fotos)
  @JoinColumn({ name: "diario_id" })
  diario: DiarioBordo;
}
