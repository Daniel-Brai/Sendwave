import {
  Injectable,
  Inject,
  forwardRef,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
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
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public async sendMail() {}

  public async findMailContacts(
    query: PageOptionsDto,
  ): Promise<PageDto<MailContactEntity>> {
    this.logger.log(`Retrieve mail contacts in a paginated view`);

    try {
      const cachedData = await this.cacheService.get<
        PageDto<MailContactEntity>
      >('mail-contacts-list');

      if (cachedData) {
        return cachedData;
      } else {
        const queryBuilder =
          this.mailContactRepository.createQueryBuilder('contact');

        queryBuilder
          .orderBy('contact.created_at', query.order)
          .skip(query.skip)
          .take(query.take);

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({
          pageOptionsDto: query,
          itemCount: itemCount,
        });

        const contacts = new PageDto(entities, pageMetaDto);
        await this.cacheService.set('mail-contacts-list', contacts);
        return contacts;
      }
    } catch (error) {
      this.logger.error(
        { id: `retrieve-mail-contacts-in-paginated-view-error` },
        `Retrieve mail contacts in a paginated view`,
      );
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  public async findUserMailContacts(
    userId: string,
  ): Promise<Array<MailContactEntity>> {
    this.logger.log(`Retrieve user mail contacts`);

    try {
      const cachedData = await this.cacheService.get<Array<MailContactEntity>>(
        `user-mail-contacts-list-${userId}`,
      );

      if (cachedData) {
        return cachedData;
      } else {
        const contacts = await this.mailContactRepository.find({
          where: {
            owner: {
              id: userId,
            },
          },
        });
        await this.cacheService.set(
          `user-mail-contacts-list-${userId}`,
          contacts,
        );
        return contacts;
      }
    } catch (error) {
      this.logger.error(
        { id: `retrieve-user-mail-contacts-in-error` },
        `Retrieve user mail contact`,
      );
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  public async createMailContact(
    userId: string,
    body: CreateMailContactDto,
  ): Promise<MailContactEntity> {
    this.logger.log(`Create a mail contact`);

    try {
      const user = await this.userService.findOneById(userId);
      const mailContact = this.mailContactRepository.create({
        owner: user,
        ...body,
      });
      return await this.mailContactRepository.save(mailContact);
    } catch (error) {
      this.logger.log({ id: `create-a-mail-contact` }, `Create a mail contact`);
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  public async findMailContactById(
    contactId: string,
  ): Promise<MailContactEntity> {
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
      await this.mailContactRepository.delete({
        id: foundMailContact.id,
      });
      return {
        message: 'Contact deleted successfully',
      };
    } catch (error) {
      this.logger.error(
        { id: `delete-a-mail-contact` },
        `Delete a mail contact`,
      );
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
