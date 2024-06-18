import { Organization } from '@/models/organization.model'
import { currencyFormat } from '@/utils/utils'
import { Pagination } from '@mui/material'
import { MouseEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'

type OrganizationDetailModalProps = {
  show: boolean
  handleShow: (show: boolean) => void,
  organization: Organization | undefined
}

export const OrganizationDetailModal = (props: OrganizationDetailModalProps) => {

  const LIMIT = 10;

  const [page, changePage] = useState(1);
  const [organization, setOrganization] = useState<Organization | undefined>(props.organization);
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
    if (!props.show || !organization || !organization.organizationDetails) return
      setPaginationMaxPage(Math.ceil(organization.organizationDetails.length / LIMIT))
  }, [organization, page, props.show])

  useLayoutEffect(() => {
    if (dialog?.current && props.show) {
      dialog.current.showModal();
      setOrganization(props.organization);
    }
  }, [dialog, props.organization, props.show]);


  if (!organization || !organization.organizationDetails) return (
    <dialog className='w-[60%] absolute bg-transparent' ref={dialog}>
      <div className='m-auto inset-2 flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md border border-blue-gray-100'>
        <div>
          <h1>Loading...</h1>
        </div>
        <div className='mt-5 mb-2 grid grid-flow-col gap-2 grid-cols-1 place-items-end mx-2'>
          <button className='bg-destructive' onClick={(e) => handleCancel(e)}>Cancel</button>
        </div>
      </div>
    </dialog>
  );

  return (
    <dialog className='w-[60%] absolute bg-transparent' ref={dialog}>
      <div className='m-auto inset-2 flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md border border-blue-gray-100'>
        <div>
          <h1>{organization.name}</h1>
        </div>
        <div>
          {organization.organizationDetails.length === 0 && <p className='text-center'>No details found.</p>}
          {organization.organizationDetails.length > 0 && 
            <table className='w-[90%] m-auto mt-5'>
              <thead>
                <tr>
                  <th className='w-[10%] border'>Awarded Amount</th>
                  <th className='w-[10%] border'>Duration End</th>
                  <th className='w-[10%] border'>Duration Start</th>
                  <th className='w-[20%] border'>Grant Submission Name</th>
                  <th className='w-[10%] border'>Grant Type</th>
                  <th className='w-[10%] border'>Requested Amount</th>
                  <th className='w-[10%] border'>Stage</th>
                  <th className='w-[20%] border'>Tags</th>
                </tr>
              </thead>
              <tbody>
                {organization.organizationDetails.map((organizationDetail) => (
                  <tr key={organizationDetail.id}>
                    <td className="border">{currencyFormat.format(organizationDetail.awardedAmount)}</td>
                    <td className="border">{new Date(organizationDetail.durationEnd).toLocaleDateString()}</td>
                    <td className="border">{new Date(organizationDetail.durationStart).toLocaleDateString()}</td>
                    <td className="border">{organizationDetail.grantSubmissionName}</td>
                    <td className="border">{organizationDetail.grantType}</td>
                    <td className="border">{currencyFormat.format(organizationDetail.requestedAmount)}</td>
                    <td className="border">{organizationDetail.stage}</td>
                    <td className="border">{organizationDetail.tags.map(tag => tag.name).join(', ')}</td>
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