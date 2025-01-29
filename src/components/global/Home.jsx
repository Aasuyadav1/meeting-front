import React from 'react'
import DevButton from '../dev-cmp/Button'

const Home = () => {
  return (
    <div className='flex justify-center items-center h-dvh w-full'>
        <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-lg'>
            <h2 className='text-xl font-bold mb-4'>Manage Meetings</h2>
            <div className='mt-10 flex gap-10'>
                <DevButton href="/meeting" size="lg" rounded="full" >
                    Go to Dashbaord
                </DevButton>
                <DevButton variant="flat" href="/login" size="lg" rounded="full" >
                    Login or Register
                </DevButton>
            </div>
        </div>
    </div>
  )
}

export default Home