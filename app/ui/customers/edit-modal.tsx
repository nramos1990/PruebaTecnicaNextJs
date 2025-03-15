'use client'
import { useActionState, useRef, useState } from 'react'
import Modal from '../components/modal'
import { PencilIcon } from '@heroicons/react/24/outline'
import { State, StateCustomers, updateCustomer } from '@/app/lib/actions'
import { fetchCustomerById } from '@/app/lib/data'
import { CustomerForm } from '@/app/lib/definitions'

export default function EditModal({ customer }: { customer: CustomerForm }) {
  const [isOpen, setIsOpen] = useState(false)
  const initialState: StateCustomers = { message: null, errors: {} }
  const updateCustomerWithId = updateCustomer.bind(null, customer.id)
  const [state, formAction] = useActionState(updateCustomerWithId, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  const toggleModal = () => setIsOpen(!isOpen)

  return (
    <>
      <button
        onClick={toggleModal}
        className='rounded-md border p-2 hover:bg-gray-100'
      >
        <PencilIcon className='w-5' />
      </button>
      {isOpen && (
        <Modal
          title='Título del Modal'
          titleButtonAccept='Editar'
          onClose={toggleModal}
          onAccept={() => formRef.current?.requestSubmit()}
        >
          <form
            ref={formRef}
            action={formAction}
            className='flex flex-col gap-4'
          >
            <div>
              <label
                htmlFor='name'
                className='block text-left text-sm font-medium text-gray-700'
              >
                Nombre
              </label>
              <input
                type='text'
                id='name'
                name='name'
                defaultValue={customer.name}
                placeholder='Ingresa tu nombre'
                className='mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                aria-describedby='name-error'
              />
              <div
                id='name-error'
                aria-live='polite'
                aria-atomic='true'
              >
                {state.errors?.name &&
                  state.errors.name.map((error: string) => (
                    <p
                      className='mt-2 text-sm text-red-500'
                      key={error}
                    >
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div>
              <label
                htmlFor='email'
                className='block text-left text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                defaultValue={customer.email}
                placeholder='Ingresa tu email'
                className='mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                aria-describedby='email-error'
              />
              <div
                id='email-error'
                aria-live='polite'
                aria-atomic='true'
              >
                {state.errors?.email &&
                  state.errors.email.map((error: string) => (
                    <p
                      className='mt-2 text-sm text-red-500'
                      key={error}
                    >
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            {state.message && <p className='text-green-500'>{state.message}</p>}
          </form>
        </Modal>
      )}
    </>
  )
}
