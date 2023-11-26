'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '../AuthProvider'

export default function RegisterDevice() {
  const { handleDeviceRegistration, user } = useAuth()
  const router = useRouter()
  const handleWebauthnRegistration = async () => {
    const isSuccessful = await handleDeviceRegistration()
    console.log('isSuccessful: ', isSuccessful)
    isSuccessful && router.push('login')
  }

  return (
    <div className="App grid_txt_1">
      <h1>
        Register device for{' '}
        <span className="col-gold">&lt;{user?.email}&gt;</span>{' '}
      </h1>
      <div className="u-center">
        <button className="btn br" onClick={handleWebauthnRegistration}>
          register device
        </button>
      </div>
    </div>
  )
}
