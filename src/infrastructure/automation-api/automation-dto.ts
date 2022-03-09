import SubscriptionDto from './subscription-dto';

export default interface AutomationDto {
  id: string;
  name: string;
  accountId: string;
  subscriptions: SubscriptionDto[];
  modifiedOn: number;
  // eslint-disable-next-line semi
}
