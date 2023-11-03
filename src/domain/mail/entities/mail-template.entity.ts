import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('MailTemplates')
export class MailTemplateEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  public name!: string;

  @Column({ type: 'varchar', nullable: false })
  public content!: string;

  @ManyToOne(() => UserEntity, (u: UserEntity) => u.templates)
  public owner!: UserEntity;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    select: true,
  })
  @Exclude()
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    select: true,
  })
  @Exclude()
  public updated_at: Date;
}
