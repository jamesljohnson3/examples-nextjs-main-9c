import Image from 'next/image'
import ApplePics from "@/components/apple-pics2"
import Feed from'./client'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     
     <Feed/>
     
     <ApplePics/>
    </main>
  )
}
