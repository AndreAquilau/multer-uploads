import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { IsEmpty, IsEmail, Length } from 'class-validator';
import Photos from './Photo';

@Index('pkey_id_user', ['id'], { unique: true })
@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'nome', nullable: false, type: 'varchar', length: 255 })
  @IsEmpty({ message: 'Nome não pode ser vazio' })
  @Length(5, 50, { message: 'Nome deve está entre 5 e 50 caracteres' })
  nome: string;

  @Column({ name: 'email', nullable: false, type: 'varchar', length: 255 })
  @IsEmail({}, { message: 'Email inválido!' })
  @IsEmpty({ message: 'Email não pode ser vazio' })
  email: string;

  @Column({ name: 'password', nullable: false, type: 'varchar', length: 255 })
  @IsEmpty({ message: 'Senha não pode ser vazio' })
  password_hash: string;

  password: string | null;

  @BeforeInsert()
  async encryptPassword() {
    console.log(this);
    this.password_hash = await bcrypt.hash(this.password, 8);
    this.password = null;
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

  @OneToMany(() => Photos, (photo) => photo.fkIdUser, { eager: true })
  photos: Photos[];
}
