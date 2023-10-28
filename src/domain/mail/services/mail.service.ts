import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { MailContactEntity } from '../entities/mail-contact.entity';
import { Repository } from 'typeorm';
import { CreateMailContactDto, SendMailDto } from '../dtos/mail-request.dto';
import { PageDto, PageMetaDto, PageOptionsDto } from '@common/dtos';
import { UserService } from '../../user/services/user.service';
import {
  MailSchedule,
  BATCH_MAIL_QUEUE,
  SEND_BATCH_MAIL,
} from '../mail.constants';
import { InjectQueue } from '@nestjs/bull';

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
    @InjectQueue(BATCH_MAIL_QUEUE)
    private readonly mailQueue: Queue,
  ) {}

  public async sendMail(
    query: MailSchedule = 'none',
    body: SendMailDto,
  ): Promise<void> {
    try {
      if (query === 'hourly') {
        await this.mailQueue.add(
          SEND_BATCH_MAIL,
          {
            body,
            query,
          },
          {
            removeOnFail: 5,
            repeat: {
              cron: '0 * * * *',
            },
          },
        );
      } else if (query === 'weekly') {
        await this.mailQueue.add(
          SEND_BATCH_MAIL,
          {
            body,
            query,
          },
          {
            removeOnFail: 5,
            repeat: {
              cron: '0 3 * * 0',
            },
          },
        );
      } else if (query === 'monthly') {
        await this.mailQueue.add(
          SEND_BATCH_MAIL,
          {
            body,
            query,
          },
          {
            removeOnFail: 5,
            repeat: {
              cron: '0 0 28 * *',
            },
          },
        );
      } else if (query === 'none') {
        await this.mailQueue.add(
          SEND_BATCH_MAIL,
          {
            body,
            query,
          },
          {
            removeOnFail: 5,
          },
        );
      }
    } catch (error) {
      this.logger.error(`Error queueing email`);
      throw error;
    }
  }

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

  public async searchUserMailContacts(userId: string, query: string): Promise<Array<MailContactEntity>> {
    this.logger.log(`Search mail contacts by user id`)
    try {
      const searchResults = await this.mailContactRepository
        .createQueryBuilder('contact')
        .where('contact.owner.id = :userId AND contact.name LIKE :query', { userId,  query: `%${query}%` })
        .getMany();

      return searchResults;
    } catch(error) {
      this.logger.error({ id: `search-mail-contacts-by-user-id`}, `Search mail contacts by user id`);
      throw new BadRequestException('Something went wrong - unable to fetch mail contacts');
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
