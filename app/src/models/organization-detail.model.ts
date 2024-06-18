import { Tag } from './tag.model'

export type OrganizationDetail = {
  id?: number;
  awardedAmount: number;
  durationEnd: Date;
  durationStart: Date;
  grantSubmissionName: string;
  grantType: GrantType;
  requestedAmount: number;
  stage: string;
  tags: Tag[];
}

export type GrantType = 'OPERATING_GRANT' | 'PROJECT_GRANT';