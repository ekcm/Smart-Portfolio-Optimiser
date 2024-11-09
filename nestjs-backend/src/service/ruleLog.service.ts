import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RuleLogDto } from '../dto/ruleLog.dto';
import { RuleLog } from '../model/ruleLog.model';

@Injectable()
export class RuleLogService {
    constructor(@InjectModel(RuleLog.name) private ruleLogModel: Model<RuleLog>) {}

    async getAll(): Promise<RuleLog[]> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const ruleLogs = await this.ruleLogModel.find().exec();
                resolve(ruleLogs);
            }, 1000);
        });
    }

    async getById(id: string): Promise<RuleLog> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const ruleLog = await this.ruleLogModel.findById(id).exec();
                if (ruleLog) {
                    resolve(ruleLog);
                } else {
                    reject(new NotFoundException("No such rule log found"));
                }
            }, 1000);
        });
    }

    async getByIds(ids: string[]): Promise<RuleLog[]> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const ruleLogs = await this.ruleLogModel.find({ _id: { $in: ids } }).exec();
                if (ruleLogs.length > 0) {
                    resolve(ruleLogs);
                } else {
                    reject(new NotFoundException("No rule logs found for the provided IDs"));
                }
            }, 1000);
        });
    }

    async create(ruleLogDto: RuleLogDto): Promise<RuleLog> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const createdRuleLog = new this.ruleLogModel(ruleLogDto);
                resolve(await createdRuleLog.save());
            }, 1000);
        });
    }

    async update(id: string, ruleLogDto: RuleLogDto): Promise<RuleLog> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const updatedRuleLOg = await this.ruleLogModel.findByIdAndUpdate(
                    id,
                    ruleLogDto,
                    { new: true }
                ).exec();
                if (!updatedRuleLOg) {
                    reject(new NotFoundException(`${id} does not exist`));
                } else {
                    resolve(updatedRuleLOg);
                }
            }, 1000);
        });
    }

    async delete(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const rule = await this.ruleLogModel.findByIdAndDelete(id).exec();
                if (!rule) {
                    reject(new NotFoundException(`${id} does not exist`));
                } else {
                    resolve();
                }
            }, 1000);
        });
    }

    async getAllByPortfolioId(portfolioId: string): Promise<RuleLog[]> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const ruleLogs = await this.ruleLogModel.find({ portfolioId }).exec();
                resolve(ruleLogs);
            }, 1000);
        });
    }
}