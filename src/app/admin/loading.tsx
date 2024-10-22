import { Loader } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <div className='flex justify-center items-center pt-4'>
        <Loader size="50" className='animate-spin' />
    </div>
  )
}

export default loading