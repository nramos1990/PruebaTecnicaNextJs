'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import postgres from 'postgres'
import { AuthError } from 'next-auth'
import { signIn } from '@/auth'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Por favor selecciona un cliente.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Por favor ingresa un monto mayor a $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Por favor selecciona un estado.',
  }),
  date: z.string(),
})

const CustomerSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Por favor ingresa un nombre.',
  }),
  email: z.string({
    invalid_type_error: 'Por favor ingresa un correo.',
  }),
})

const CreateInvoice = FormSchema.omit({ id: true, date: true })

export type State = {
  errors?: {
    customerId?: string[]
    amount?: string[]
    status?: string[]
  }
  message?: string | null
}

export type StateCustomers = {
  errors?: {
    name?: string[]
    email?: string[]
  }
  message?: string | null
}

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. Error al crear la factura.',
    }
  }

  const { customerId, amount, status } = validatedFields.data
  const amountInCents = amount * 100
  const date = new Date().toISOString().split('T')[0]

  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `
  } catch (error) {
    return {
      message: `Database Error: Failed to Create Invoice: ${error} `,
    }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true })

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. Error al actualizar la factura.',
    }
  }

  const { customerId, amount, status } = validatedFields.data
  const amountInCents = amount * 100

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `
  } catch (error) {
    return { message: `Database Error: Failed to Update Invoice: ${error} ` }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`
  revalidatePath('/dashboard/invoices')
}

const UpdateCustomer = CustomerSchema.omit({ id: true })

export async function updateCustomer(
  id: string,
  prevState: StateCustomers,
  formData: FormData
) {
  console.log('holaaa')

  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. Error al actualizar el cliente.',
    }
  }

  const { name, email } = validatedFields.data

  try {
    await sql`
    UPDATE customers
    SET name = ${name}, email = ${email}
    WHERE id = ${id}
  `
  } catch (error) {
    return { message: `Database Error: Failed to Update Customer. ${error}` }
  }

  revalidatePath('/dashboard/customers')
  return { message: '¡Cliente actualizado con exito!' }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}
