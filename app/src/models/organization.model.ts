import { OrganizationDetail } from './organization-detail.model'

export type Organization = {
  id?: string
  name: string
  address: string
  email: string
  organizationDetails?: OrganizationDetail[]
}