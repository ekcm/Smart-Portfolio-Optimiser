import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum RuleType {
    MIN_CASH = 'MIN_CASH',
    MAX_CASH = 'MAX_CASH',
    RISK = 'RISK'
}

// Interface to define the base shape of a rule
export interface IRule {
    name: string;
    description: string;
}

@Schema({ 
    collection: "Rule", 
    discriminatorKey: '__type'  // Using __type as discriminator
})
export class Rule extends Document implements IRule {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;
}

@Schema()
export class CashRule extends Rule {
    @Prop({ required: true })
    percentage: number;
}

@Schema()
export class RiskRule extends Rule {
    @Prop({ required: true })
    stocks: number;

    @Prop({ required: true })
    bonds: number;
}

export const RuleSchema = SchemaFactory.createForClass(Rule);
export const CashRuleSchema = SchemaFactory.createForClass(CashRule);
export const RiskRuleSchema = SchemaFactory.createForClass(RiskRule);

// Register discriminators
RuleSchema.discriminator(RuleType.MIN_CASH, CashRuleSchema);
RuleSchema.discriminator(RuleType.MAX_CASH, CashRuleSchema);
RuleSchema.discriminator(RuleType.RISK, RiskRuleSchema);