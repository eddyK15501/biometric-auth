'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { useRef, useState } from 'react'
import Link from 'next/link'

export default function App() {
  const ref = useRef<HTMLInputElement>(null)
  const [userId, setUserId] = useState('')
  return (
    <div className="App grid_txt_1">
      <Link className={styles.btn} href={'/signup'}>
        signup
      </Link>
      <Link className="btn br" href={'/login'}>
        login
      </Link>
    </div>
  )
}
