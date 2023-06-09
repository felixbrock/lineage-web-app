import { CustomThresholdMode } from '../../../infrastructure/observability-api/observability-api-repo';

export interface CustomTest {
    id: string;
    name: string;
    description?: string;
    active: boolean;
    cron: string;
    targetResourceId: string;
    customLowerThreshold?: number;
    customUpperThreshold?: number;
    customLowerThresholdMode: CustomThresholdMode;
    customUpperThresholdMode: CustomThresholdMode;
    feedbackLowerThreshold?: number;
    feedbackUpperThreshold?: number;
}