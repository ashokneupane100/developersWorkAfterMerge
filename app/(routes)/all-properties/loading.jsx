import React from 'react'
import {Spinner} from "@heroui/spinner";

function loading() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <Spinner size='lg' className='text-primary'/>
    </div>
  )
}

export default loading