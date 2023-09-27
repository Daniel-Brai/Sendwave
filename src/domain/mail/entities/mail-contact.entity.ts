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

@Entity('MailContacts')
export class MailContactEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', nullable: false })
  public name!: string;

  @Column({ type: 'varchar', nullable: false })
  public email!: string;

  @ManyToOne(() => UserEntity, (u: UserEntity) => u.contacts, {
    nullable: true,
  })
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
