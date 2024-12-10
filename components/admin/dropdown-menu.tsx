'use client'
import {DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


export default function DropDownMenuComponent() {
    const [isLoggedOut, setIsLoggedOut] = useState(false)
    const router = useRouter()

    useEffect(() => {
      if (isLoggedOut) router.push('/login')
    }, [isLoggedOut])
    
    const handleSignout = async() => {
      const response = await fetch('http://admin.localhost:3000/api/auth/signout', {
        method: 'POST', 
        credentials: 'include'
      })

      const responseData = await response.json(); 
      console.log(responseData)
      if(responseData) {
        setIsLoggedOut(true)
      }
    }


    return (
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
        <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button onClick={handleSignout}>Logout</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    )
}