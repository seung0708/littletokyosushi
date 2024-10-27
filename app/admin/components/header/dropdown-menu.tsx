import {DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DropDownMenuComponent() {
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
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    )
}