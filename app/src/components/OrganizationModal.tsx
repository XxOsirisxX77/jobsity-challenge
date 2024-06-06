import { Organization } from '@/models/organization.model'
import { API_URL } from '@/utils/constants'
import { MouseEvent, useLayoutEffect, useRef } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type OrganizationModalProps = {
  show: boolean
  handleShow: (show: boolean) => void
  addNewOrganization: (organization: Organization) => void
}

export const OrganizationModal = (props: OrganizationModalProps) => {

  const dialog = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleCancel = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();
    closeDialog();
  }

  const processForm = (data: FieldValues) => {
    const organization: Organization = {
      name: data.name,
      address: data.address,
      email: data.email
    };
    fetch(`${API_URL}/organization`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(organization)
    }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        return data
      })
      .then((data) => {
        props.addNewOrganization(data);
      })
      .catch((err) => {
        toast.error(err.message);
      });
    closeDialog();
  }

  const closeDialog = () => {
    reset();
    if (dialog?.current) {
      dialog.current.close();
      props.handleShow(false);
    }
  }

  useLayoutEffect(() => {
    if (dialog?.current && props.show) {
      dialog.current.showModal();
    }
  }, [dialog, props.show]);

  return (
    <dialog className='w-[30%] absolute bg-transparent' ref={dialog}>
      <form 
        onSubmit={handleSubmit((data) => processForm(data))} 
        className='m-auto inset-2 flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md border border-blue-gray-100'
        >
        <div>
          <h1>Add Organization</h1>
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" placeholder="Organization Name" {...register('name', { required: true })} />
          {errors.name && <p className='text-destructive text-sm'>Name is required.</p>}
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input id="address" placeholder="Organization Address" {...register('address', { required: true })} />
          {errors.address && <p className='text-destructive text-sm'>Address is required.</p>}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" placeholder="Organization Email" {...register('email', { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i })} />
          {errors.email && <p className='text-destructive text-sm'>Invalid Email.</p>}
        </div>
        <div className='mt-5 mb-2 grid grid-flow-col gap-2 grid-cols-1 place-items-end mx-2'>
          <button className='bg-destructive' onClick={(e) => handleCancel(e)}>Cancel</button>
          <button type="submit" className="bg-primary">Create</button>
        </div>
      </form>
    </dialog>
  );
};