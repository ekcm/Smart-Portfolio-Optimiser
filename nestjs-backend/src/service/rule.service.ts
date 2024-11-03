import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RuleDto } from '../dto/rule.dto';
import { Rule } from '../model/rule.model';

@Injectable()
export class RuleService {
    constructor(@InjectModel(Rule.name) private ruleModel: Model<Rule>) {}

    async getAll(): Promise<Rule[]> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const rules = await this.ruleModel.find().exec();
                resolve(rules);
            }, 1000);
        });
    }

    async getById(id: string): Promise<Rule> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const rule = await this.ruleModel.findById(id).exec();
                if (rule) {
                    resolve(rule);
                } else {
                    reject(new NotFoundException("No such rule found"));
                }
            }, 1000);
        });
    }

    async create(rulesDto: RuleDto): Promise<Rule> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const createdRule = new this.ruleModel(rulesDto);
                resolve(await createdRule.save());
            }, 1000);
        });
    }

    async update(id: string, rulesDto: RuleDto): Promise<Rule> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const updatedRule = await this.ruleModel.findByIdAndUpdate(
                    id,
                    rulesDto,
                    { new: true }
                ).exec();
                if (!updatedRule) {
                    reject(new NotFoundException(`${id} does not exist`));
                } else {
                    resolve(updatedRule);
                }
            }, 1000);
        });
    }

    async delete(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const rule = await this.ruleModel.findByIdAndDelete(id).exec();
                if (!rule) {
                    reject(new NotFoundException(`${id} does not exist`));
                } else {
                    resolve();
                }
            }, 1000);
        });
    }
}