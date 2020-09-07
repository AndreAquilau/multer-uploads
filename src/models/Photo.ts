import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  AfterLoad,
} from 'typeorm';
import User from './User';

@Index('pkey_id_photo', ['id'], { unique: true })
@Entity('photos')
export default class Photos {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'nome',
    nullable: false,
    type: 'varchar',
    length: 255,
  })
  nome: string;

  @Column({
    name: 'originalname',
    nullable: false,
    type: 'varchar',
    length: 255,
  })
  originalname: string;

  @Column({ name: 'filename', nullable: false, type: 'varchar', length: 255 })
  filename: string;

  @ManyToOne(() => User, (user) => user.photos)
  @JoinColumn({
    referencedColumnName: 'id',
  })
  fkIdUser: User;

  private url: string;

  @AfterLoad()
  getUrl() {
    return (this.url = `${process.env.BASE_URL}:${process.env.PORT}/${process.env.FILES_STATICS_IMAGES}/${this.filename}`);
  }
  @CreateDateColumn({
    name: 'created_At',
    nullable: false,
    default: 'now()',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_At',
    nullable: false,
    default: 'now()',
    type: 'timestamp',
  })
  updatedAt: Date;
}
