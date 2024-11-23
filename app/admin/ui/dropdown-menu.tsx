'use client'

import { logout } from "@/utils/auth/auth";

import {DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DropDownMenuComponent() {
  const router = useRouter(); 

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/')
    } catch(error) {
      console.log(error)
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
          {/* <Image
            src="/placeholder-user.jpg"
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          /> */}
        <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button onClick={handleLogout}>
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    )
}