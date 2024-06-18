import { GrantType } from './organization-detail.model'

export type CsvData = {
  additionalFileFolderPath: string;
  awardedAmount: string;
  durationEnd: string;
  durationStart: string;
  foundationOwner: string;
  grantSubmissionId: string;
  grantSubmissionName: string;
  grantType: GrantType;
  nonprofitLegalName: string;
  requestedAmount: string;
  stage: string;
  tags: string[];
}
