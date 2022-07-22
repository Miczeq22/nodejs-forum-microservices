export interface AuthorStatusProps {
  value: string;
}

export enum AuthorStatusValue {
  AccountNotConfirmed = 'AccountNotConfirmed',
  Active = 'Active',
  Banned = 'Banned',
}
