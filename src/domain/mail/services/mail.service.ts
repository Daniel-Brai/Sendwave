import {
  Injectable,
  Inject,
  forwardRef,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailContactEntity } from '../entities/mail-contact.entity';
import { Repository } from 'typeorm';
import { CreateMailContactDto } from '../dtos/mail-request.dto';
import { PageDto, PageMetaDto, PageOptionsDto } from '@common/dtos';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    @InjectRepository(MailContactEntity)
    private readonly mailContactRepository: Repository<MailContactEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public async findMailContacts(
    query: PageOptionsDto,
  ): Promise<PageDto<MailContactEntity>> {
    this.logger.log(`Retrieve mail contacts in a paginated view`);

    try {
      const queryBuilder =
        this.mailContactRepository.createQueryBuilder('mailContact');

      queryBuilder
        .orderBy('mailContact.created_at', query.order)
        .skip(query.skip)
        .take(query.take);

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMetaDto = new PageMetaDto({
        pageOptionsDto: query,
        itemCount: itemCount,
      });

      return new PageDto(entities, pageMetaDto);
    } catch (error) {
      this.logger.error(
        { id: `retrieve-users-in-paginated-view-error` },
        `Retrieve users in a paginated view`,
      );
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  public async createMailContact(userId: string, body: CreateMailContactDto) {
    this.logger.log(`Create a mail contact`);

    try {
      const user = await this.userService.findOneById(userId);
      const mailContact = this.mailContactRepository.create({
        ...body,
      });
      return await this.mailContactRepository.save(mailContact);
    } catch (error) {
      this.logger.log({ id: `create-a-mail-contact` }, `Create a mail contact`);
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  public async findMailContactById(contactId: string) {
    this.logger.log(`Find a mail contact by id`);

    try {
      const mailContact = await this.mailContactRepository.findOne({
        where: {
          id: contactId,
        },
      });
      return mailContact;
    } catch (error) {
      this.logger.error(
        { id: `find-a-mail-contact-by-id` },
        `Find a mail contact by id`,
      );
      throw new NotFoundException('Contact not found!');
    }
  }

  public async deleteMailContact(contactId: string) {
    this.logger.log(`Delete a mail contact`);

    try {
      const foundMailContact = await this.findMailContactById(contactId);
      return await this.mailContactRepository.delete({
        id: foundMailContact.id,
      });
    } catch (error) {
      this.logger.error(
        { id: `delete-a-mail-contact` },
        `Delete a mail contact`,
      );
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
