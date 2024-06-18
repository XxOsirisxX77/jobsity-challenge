import { CsvData } from '@/models/csv-data.model'
import { Organization } from '@/models/organization.model'
import { Tag } from '@/models/tag.model'

export const convertCSVToOrganization = (rawData: object[]): Organization[] => {
  const organizations: Organization[] = []

  rawData.forEach((data: object) => {
    Object.keys(data).forEach((key) => {
      const newKey = key
        .toLocaleLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_m, chr) => chr.toUpperCase())
      data[newKey as keyof object] = data[key as keyof object]

      delete data[key as keyof object]
    })
  });

  (rawData as CsvData[]).forEach(data => {
    const organization: Organization = {
      name: data.nonprofitLegalName,
      email: data.foundationOwner,
      address: '',
      organizationDetails: [
        {
          awardedAmount: parseFloat(data.awardedAmount.replace(/[^0-9.-]+/g, '')),
          durationEnd: new Date(data.durationEnd),
          durationStart: new Date(data.durationStart),
          grantSubmissionName: data.grantSubmissionName,
          grantType: data.grantType,
          requestedAmount: parseFloat(data.requestedAmount.replace(/[^0-9.-]+/g, '')),
          stage: data.stage,
          tags: (typeof data.tags === 'string' ? [{ name: data.tags }] : data.tags.map((tag: string) => ({ name: tag } as Tag)))
        }
      ]
    }
    const existingOrg = organizations.find(org => org.name === organization.name)
    if (existingOrg !== undefined && organization.organizationDetails !== undefined) {
      existingOrg.organizationDetails?.push(organization.organizationDetails[0]);
    } else {
      organizations.push(organization)
    }
  })

  return organizations
}

export const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})