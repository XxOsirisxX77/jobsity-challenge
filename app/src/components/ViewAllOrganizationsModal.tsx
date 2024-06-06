import { Organization } from '@/models/organization.model'
import { API_URL } from '@/utils/constants'
import { Pagination } from '@mui/material'
import { MouseEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'

type ViewAllOrganizationsModalProps = {
  show: boolean
  handleShow: (show: boolean) => void
}

export const ViewAllOrganizationsModal = (props: ViewAllOrganizationsModalProps) => {

  const LIMIT = 10;

  const [page, changePage] = useState(1);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [paginationMaxPage, setPaginationMaxPage] = useState(0);

  const dialog = useRef<HTMLDialogElement>(null);

  const handlePageChange = (newPage: number) => {
    changePage(newPage)
  }

  const handleCancel = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    closeDialog();
  }

  const closeDialog = () => {
    if (dialog?.current) {
      dialog.current.close();
      props.handleShow(false);
    }
  }

  useEffect(() => {
    if (!props.show) return

    const controller = new AbortController()
    const signal = controller.signal

    fetch(
      `${API_URL}/organization/all?page=${page}`,
      {
        signal
      }
    )
    .then((res) => { 
      if (!res.ok) throw new Error('Error fetching emails')
      return res.json()
    })
    .then((data) => {
      setOrganizations(data.emails)
      setPaginationMaxPage(Math.ceil(data.count / LIMIT))
    })
    .catch((err) => {
      console.error(err)
      if (err.name === 'AbortError') return
    })

    return () => controller.abort()
  }, [page, props.show])

  useLayoutEffect(() => {
    if (dialog?.current && props.show) {
      dialog.current.showModal();
    }
  }, [dialog, props.show]);


  return (
    <dialog className='w-[60%] absolute bg-transparent' ref={dialog}>
      <div className='m-auto inset-2 flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md border border-blue-gray-100'>
        <div>
          <h1>Organizations</h1>
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
        <div className='mt-5 m-auto'>
          <Pagination
              page={page}
              count={paginationMaxPage}
              size="large"
              onChange={(_, value) => handlePageChange(value)}
              color='primary'
            />
        </div>
        <div className='mt-5 mb-2 grid grid-flow-col gap-2 grid-cols-1 place-items-end mx-2'>
          <button className='bg-destructive' onClick={(e) => handleCancel(e)}>Cancel</button>
        </div>
      </div>
    </dialog>
  );
};