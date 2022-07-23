export enum AccountStatusValue {
  AccountNotConfirmed = 'AccountNotConfirmed',
  Active = 'Active',
  Banned = 'Banned',
}

export interface AccountStatusProps {
  value: string;
}
