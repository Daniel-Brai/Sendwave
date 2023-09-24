import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  public email!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Exclude({ toPlainOnly: true })
  public password!: string;

  @Column({ type: 'jsonb', default: null })
  @Exclude({ toPlainOnly: true })
  public passwordReset: any;

  @Column({ type: 'varchar', nullable: true, select: false })
  public confirmation_token: string;

  @Column({ type: 'varchar', length: 6, nullable: true, select: false })
  public otp_code: string;

  @Column({ type: 'boolean', default: false })
  public is_verified: boolean;

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
