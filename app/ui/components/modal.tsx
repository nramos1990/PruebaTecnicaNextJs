export default function Modal({
  title,
  titleButtonAccept,
  onClose,
  onAccept,
  children,
}: {
  title: string
  titleButtonAccept: string
  onClose: () => void
  onAccept: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  children: React.ReactNode
}) {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center'>
        <h2 className='text-2xl font-semibold mb-4'>{title}</h2>
        <div className='mb-4'>{children}</div>
        <div className='flex justify-center space-x-1'>
          <button
            onClick={onClose}
            className='w-1/2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
          >
            Cerrar
          </button>
          <button
            type='button'
            onClick={onAccept}
            className='w-1/2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600'
          >
            {titleButtonAccept}
          </button>
        </div>
      </div>
    </div>
  )
}
