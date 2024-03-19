'use client'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import Sidebar from './Sidebar'
import { useState, useEffect } from 'react'


export interface MobileSidebarProps {
  apiLimitCount: number,
  isPro : boolean
}

const MobileSidebar = ({ apiLimitCount=0 , isPro=false}: MobileSidebarProps) => {
  const [isMounted, setisMounted] = useState(false)

  useEffect(() => {
    setisMounted(true)
  }, [])


  if (!isMounted) return null

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant='outline' size='icon' className='md:hidden'>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='p-0'  >
        <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
      </SheetContent>

    </Sheet>
  )
}

export default MobileSidebar
