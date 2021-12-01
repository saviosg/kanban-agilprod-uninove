import { EntityManager, wrap } from "@mikro-orm/core";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { HashingService } from "../hashing/hashing.service";
import { CreateUserDto } from "./create-user.dto";
import { ReplaceUserDto } from "./replace-user.dto";
import { UpdateUserDto } from "./update-user.dto";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

export class UserService {
    constructor(
	private readonly em: EntityManager,
	private readonly repo: UserRepository,
	private readonly hashingService: HashingService) {}

    async create(dto: CreateUserDto) {
        try {
            const user = new User();
            wrap(user).assign(dto);
            user.password = await this.hashingService.hash(user.password);
            await this.em.begin();
            this.em.persist(user);
            await this.em.commit();
            return user;
        }
        catch (e) {
            await this.em.rollback();
            throw e;
        }
    }
    async delete(user: User) {
        try {
            await this.em.begin();
            this.em.remove(user);
            await this.em.commit();
            return;
        }
        catch (e) {
            await this.em.rollback();
            throw e;
        }
    }
    async getOne(userId: number) {
        try {
            await this.em.begin();
            const result = await this.repo.getUserById(userId);
            if (!result) {
                throw new NotFoundException();
            }
            await this.em.commit();
            return result;
        }
        catch (e) {
            await this.em.rollback();
            throw e;
        }
    }
    async update(user: User, dto: UpdateUserDto) {
        try {
            if (dto.email && dto.email !== user.email) {
                await this.em.begin();
                const emailInUse = await this.repo.emailInUse(dto.email);
                if (emailInUse) {
                    throw new ForbiddenException();
                }
                await this.em.commit();
            }
            if (dto.password) {
                dto.password = await this.hashingService.hash(dto.password);
            }
            wrap(user).assign(dto);
            await this.em.begin();
            this.em.persist(user);
            await this.em.commit();
            return user;
        }
        catch (e) {
            await this.em.rollback();
            throw e;
        }
    }
    async replace(user: User, dto: ReplaceUserDto) {
        try {
            if (dto.email && dto.email !== user.email) {
                await this.em.begin();
                const emailInUse = await this.repo.emailInUse(dto.email);
                if (emailInUse) {
                    throw new ForbiddenException();
                }
                await this.em.commit();
            }
            if (dto.password) {
                dto.password = await this.hashingService.hash(dto.password);
            }
            wrap(user).assign(dto);
            await this.em.begin();
            this.em.persist(user);
            await this.em.commit();
            return user;
        }
        catch (e) {
            await this.em.rollback();
            throw e;
        }
    }
};
