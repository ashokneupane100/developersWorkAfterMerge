import { Spinner } from '@heroui/react'
import React from 'react'

function loading() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <Spinner size='lg' className='text-primary'/>
    </div>
  )
}

export default loading