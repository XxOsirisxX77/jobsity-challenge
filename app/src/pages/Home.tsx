import { EmailHistoryModal } from '@/components/EmailHistoryModal'
import { OrganizationModal } from '@/components/OrganizationModal'
import { Email } from '@/models/email.model'
import { Organization } from '@/models/organization.model'
import { API_URL } from '@/utils/constants'
import { convertCSVToOrganization } from '@/utils/utils'
import { Pagination } from '@mui/material'
import { ChangeEvent, createRef, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Papa from 'papaparse'
import { OrganizationDetailModal } from '@/components/OrganizationDetailModal'
import { FaEye } from 'react-icons/fa'

export const Home: React.FC = () => {
  const LIMIT = 5

  const [subject, setSubject] = useState('Receipt for your donation')
  const [body, setBody] = useState(
    'Sending money to nonprofit { name } at address { address }.'
  )
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization>()
  const [openOrganizationModal, setOpenOrganizationModal] = useState(false)
  const [openEmailHistoryModal, setOpenEmailHistoryModal] = useState(false)
  const [openOrganizationDetailModal, setOrganizationDetailModal] =
    useState(false)
  const [page, changePage] = useState(1)
  const [reload, setReload] = useState({})
  const [paginationMaxPage, setPaginationMaxPage] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const fileUploadElement = createRef<HTMLInputElement>()

  const handleAddOrganization = () => {
    setOpenOrganizationModal(true)
  }

  const handleViewOrganizationDetails = (organization: Organization) => {
    setSelectedOrganization(organization)
    setOrganizationDetailModal(true)
  }

  const handleViewEmails = () => {
    setOpenEmailHistoryModal(true)
  }

  const addNewOrganization = (organization: Organization) => {
    setOrganizations([...organizations, organization])
    fetchOrganizations(page)
    toast.success('Organization added successfully')
  }

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value)
  }

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
  }

  const handleSendEmail = () => {
    const email: Email = {
      subject: subject,
      body: body
    }

    fetch(`${API_URL}/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(email)
    })
      .then(() => toast.success('Emails sent successfully'))
      .catch(() => toast.error('Error sending email'))
  }

  const handlePageChange = (newPage: number) => {
    changePage(newPage)
  }

  const handleFileUpload = () => {
    fileUploadElement.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setFile(files[0])
    }
  }

  useEffect(() => {
    fetchOrganizations(page)
  }, [page, reload])

  const fetchOrganizations = (page: number) => {
    fetch(`${API_URL}/organization/all?page=${page}`)
      .then((response) => {
        return response.json()
      })
      .then((data: { organizations: Organization[]; count: number }) => {
        setOrganizations(data.organizations)
        setPaginationMaxPage(Math.ceil(data.count / LIMIT))
      })
      .catch((err) => {
        console.error(err)
        if (err.name === 'AbortError') return
      })
  }

  useEffect(() => {
    const reRenderOrganizations = () => {
      setReload({})
    }

    if (!file) return

    const storeOrganizations = (organizations: Organization[]) => {
      fetch(`${API_URL}/organization/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(organizations)
      })
        .then((resp) => {
          if (resp.ok) {
            return resp.json()
          }
          throw new Error('Error importing organizations')
        })
        .then(() => {
          reRenderOrganizations()
          toast.success('Organizations imported successfully')
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rawData = results.data as object[]
        const organizations = convertCSVToOrganization(rawData)
        storeOrganizations(organizations)
      }
    })
  }, [file])

  return (
    <div
      className={`p-5 w-full m-auto flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md border border-blue-gray-100 ${openOrganizationModal || openEmailHistoryModal ? 'blur' : ''}`}
    >
      <h1>Foundation Emails Generator</h1>
      <div className="grid grid-cols-3">
        <div className="h-[305px] col-span-2 mr-2 justify-start inset-2 flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md border border-blue-gray-100 p-3">
          <div>
            <h2>Organizations</h2>
          </div>
          <div>
            {organizations.length === 0 && (
              <p className="text-center">No organizations found</p>
            )}
            {organizations.length > 0 && (
              <table className="w-[90%] m-auto mt-5 table-fixed">
                <thead>
                  <tr>
                    <th className="w-[30%] border truncate">Name</th>
                    <th className="w-[20%] border truncate">Address</th>
                    <th className="w-[40%] border truncate">Email</th>
                    <th className="w-[10%] border truncate">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.map((organization) => (
                    <tr key={organization.id}>
                      <td
                        className="w-[30%] border truncate text-ellipsis"
                        title={organization.name}
                      >
                        {organization.name}
                      </td>
                      <td
                        className="w-[20%] border truncate"
                        title={organization.address}
                      >
                        {organization.address}
                      </td>
                      <td
                        className="w-[40%] border truncate"
                        title={organization.email}
                      >
                        {organization.email}
                      </td>
                      <td className="w-[10%] border truncate">
                        {organization.organizationDetails && organization.organizationDetails.length > 0 && (
                          <a
                            title='View Details'
                            className="cursor-pointer justify-center flex"
                            onClick={() =>
                              handleViewOrganizationDetails(organization)
                            }
                          >
                            <FaEye color='#1976d2' />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex flex-1 flex-col mt-5 m-auto justify-end">
            <Pagination
              page={page}
              count={paginationMaxPage}
              size="large"
              onChange={(_, value) => handlePageChange(value)}
              color="primary"
            />
          </div>
        </div>
        <div>
          <div className="flex justify-end gap-2">
            <div>
              <button className="bg-primary" onClick={handleFileUpload}>
                Import Organizations
              </button>
              <input
                className="hidden"
                type="file"
                onChange={handleFileChange}
                ref={fileUploadElement}
                accept=".csv"
              />
            </div>
            <div>
              <button className="bg-primary" onClick={handleAddOrganization}>
                Add Organization
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-1">
            <button className="bg-accent" onClick={handleViewEmails}>
              View Emails History
            </button>
          </div>
        </div>
      </div>
      <div className="grid gap-[10px] grid-cols-[100px_1fr] my-5 grid-rows-[auto_300px] items-center">
        <label className="block" htmlFor="subject">
          Subject
        </label>
        <input
          className="w-[80%]"
          id="subject"
          placeholder="Subject"
          value={subject}
          onChange={handleSubjectChange}
        />
        <label className="block self-start" htmlFor="body">
          Body
        </label>
        <textarea
          id="body"
          className="w-[99%] h-full"
          value={body}
          onChange={handleBodyChange}
        />
      </div>
      <div>
        <button
          className={`${organizations.length && subject && body ? 'bg-accent cursor-pointer' : 'bg-muted'}`}
          disabled={!organizations.length || !subject || !body}
          onClick={handleSendEmail}
        >
          Send Emails
        </button>
      </div>
      <OrganizationModal
        show={openOrganizationModal}
        handleShow={setOpenOrganizationModal}
        addNewOrganization={addNewOrganization}
      />
      <OrganizationDetailModal
        show={openOrganizationDetailModal}
        handleShow={setOrganizationDetailModal}
        organization={selectedOrganization}
      />
      <EmailHistoryModal
        show={openEmailHistoryModal}
        handleShow={setOpenEmailHistoryModal}
      />
    </div>
  )
}
