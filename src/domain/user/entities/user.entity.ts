import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Business } from '@common/types';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  public name!: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  public email!: string;

  @Column({ type: 'varchar', length: 60, unique: true, nullable: false })
  public phone_number!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Exclude({ toPlainOnly: true })
  public password!: string;

  @Column({ type: 'jsonb', default: null })
  @Exclude({ toPlainOnly: true })
  public passwordReset: any;

  @Column({ type: 'varchar', nullable: true, select: false })
  public refresh_token: string;

  @Column({ type: 'bool', default: false })
  public isVerified: boolean;

  @Column('simple-array', { array: true, default: [] })
  public business: Business;

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
