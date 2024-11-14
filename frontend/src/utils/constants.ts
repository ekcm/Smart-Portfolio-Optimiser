import { RuleType } from "@/lib/types";

export const ruleTypes = [
    { value: RuleType.MIN_CASH, label: "Minimum Cash" },
    { value: RuleType.MAX_CASH, label: "Maximum Cash" },
    { value: RuleType.RISK, label: "Risk Appetite Level" },
    { value: RuleType.EXCLUSIONS, label: "Exclusions List" },
];

export const riskAppetites = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
};