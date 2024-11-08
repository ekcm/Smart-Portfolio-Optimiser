// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { CashRuleDto, RiskRuleDto } from 'src/dto/rule.dto';
// import { Rule } from 'src/model/rule.model';

// @Injectable()
// export class RuleService {
//     constructor(
//         @InjectModel(Rule.name) private ruleModel: Model<Rule>,
//     ) { }

//     async findAll(): Promise<Rule[]> {
//         return this.ruleModel.find().exec();
//     }

//     async findById(id: string): Promise<Rule> {
//         const rule = await this.ruleModel.findById(id).exec();
//         if (!rule) {
//             throw new NotFoundException(`Rule with ID ${id} not found`);
//         }
//         return rule;
//     }

//     async createRule(dto: CashRuleDto | RiskRuleDto): Promise<Rule> {
//         const rule = new this.ruleModel({
//             ...dto
//         });
//         return rule.save();
//     }

//     async updateRule(id: string, dto: CashRuleDto | RiskRuleDto): Promise<Rule> {
//         const rule = await this.findById(id);

//         if ((rule as any).__type !== dto.__type) {
//             throw new BadRequestException('Cannot change rule type');
//         }

//         const updatedRule = await this.ruleModel
//             .findByIdAndUpdate(id, dto, { new: true })
//             .exec();

//         return updatedRule;
//     }

//     async deleteRule(id: string): Promise<void> {
//         const result = await this.ruleModel.deleteOne({ _id: id }).exec();
//         if (result.deletedCount === 0) {
//             throw new NotFoundException(`Rule with ID ${id} not found`);
//         }
//     }
// }