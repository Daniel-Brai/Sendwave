import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { MailContactEntity } from '../../mail/entities/mail-contact.entity';
import { MailTemplateEntity } from '../../mail/entities/mail-template.entity';

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

  @Column({ type: 'varchar', nullable: true })
  public confirmation_token: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  public otp_code: string;

  @Column({ type: 'boolean', default: false })
  public is_verified: boolean;

  @OneToMany(() => MailContactEntity, (m: MailContactEntity) => m.owner, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'contact_owner_id', referencedColumnName: 'owner' })
  public contacts!: Array<MailContactEntity>;

  @OneToMany(() => MailTemplateEntity, (m: MailTemplateEntity) => m.owner, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'templates_owner_id', referencedColumnName: 'owner' })
  public templates!: Array<MailTemplateEntity>;

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
