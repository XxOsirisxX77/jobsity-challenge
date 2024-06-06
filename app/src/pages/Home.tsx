import { EmailHistoryModal } from '@/components/EmailHistoryModal'
import { OrganizationModal } from '@/components/OrganizationModal'
import { Email } from '@/models/email.model'
import { Organization } from '@/models/organization.model'
import { API_URL } from '@/utils/constants'
import { Pagination } from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const Home: React.FC = () => {

  const LIMIT = 5;

  const [subject, setSubject] = useState('Receipt for your donation')
  const [body, setBody] = useState('Sending money to nonprofit { name } at address { address }.')
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [openOrganizationModal, setOpenOrganizationModal] = useState(false)
  const [openEmailHistoryModal, setOpenEmailHistoryModal] = useState(false)
  const [page, changePage] = useState(1);
  const [paginationMaxPage, setPaginationMaxPage] = useState(0);

  const handleAddOrganization = () => {
    setOpenOrganizationModal(true);
  }

  const handleViewEmails = () => {
    setOpenEmailHistoryModal(true);
  }

  const addNewOrganization = (organization: Organization) => {
    setOrganizations([...organizations, organization]);
    fetchOrganizations(page)
    toast.success('Organization added successfully')
  }
  
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  }

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
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
    }).then(() => toast.success('Emails sent successfully'))
    .catch(() => 
      toast.error('Error sending email')
    )
  }

  const handlePageChange = (newPage: number) => {
    changePage(newPage)
  }
  
  useEffect(() => {
    fetchOrganizations(page)
  }, [page])

  const fetchOrganizations = (page: number) => {
    fetch(`${API_URL}/organization/all?page=${page}`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      console.log(data)
      setOrganizations(data.organizations)
      setPaginationMaxPage(Math.ceil(data.count / LIMIT))
    })
    .catch((err) => {
      console.error(err)
      if (err.name === 'AbortError') return
    })
  }


  return (
    <div className={`p-5 w-full m-auto flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md border border-blue-gray-100 ${openOrganizationModal || openEmailHistoryModal ? 'blur' : ''}`}>
      <h1>Foundation Emails Generator</h1>
      <div className="grid grid-cols-2">
        <div className='h-[305px] justify-start inset-2 flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md border border-blue-gray-100 p-3'>
          <div>
            <h2>Organizations</h2>
          </div>
          <div>
            {organizations.length === 0 && <p className='text-center'>No organizations found</p>}
            {organizations.length > 0 && 
              <table className='w-[90%] m-auto mt-5'>
                <thead>
                  <tr>
                    <th className='w-[10%] border'>Name</th>
                    <th className='w-[30%] border'>Address</th>
                    <th className='w-[50%] border'>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.map((organization) => (
                    <tr key={organization.id}>
                      <td className="border">{organization.name}</td>
                      <td className="border">{organization.address}</td>
                      <td className="border">{organization.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          </div>
          <div className='flex flex-1 flex-col mt-5 m-auto justify-end'>
            <Pagination
                page={page}
                count={paginationMaxPage}
                size="large"
                onChange={(_, value) => handlePageChange(value)}
                color='primary'
              />
          </div>
        </div>
        <div>
          <div className='flex justify-end '>
            <button className='bg-primary' onClick={handleAddOrganization}>Add Organization</button>
          </div>
          <div className='flex justify-end mt-1'>
            <button className='bg-accent' onClick={handleViewEmails}>View Emails History</button>
          </div>
        </div>
      </div>
      <div className='grid gap-[10px] grid-cols-[100px_1fr] my-5 grid-rows-[auto_300px] items-center'>
        <label className='block' htmlFor='subject'>Subject</label>
        <input className='w-[80%]' id='subject' placeholder='Subject' value={subject} onChange={handleSubjectChange} />
        <label className='block self-start' htmlFor='body'>Body</label>
        <textarea id='body' className='w-[99%] h-full' value={body} onChange={handleBodyChange} />
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
      <OrganizationModal show={openOrganizationModal} handleShow={setOpenOrganizationModal} addNewOrganization={addNewOrganization}/>
      <EmailHistoryModal show={openEmailHistoryModal} handleShow={setOpenEmailHistoryModal}/>
    </div>
  );
};