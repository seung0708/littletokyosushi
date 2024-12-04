import { logout } from "../login/actions"

import {DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { redirect, useRouter } from "next/navigation"
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export default function DropDownMenuComponent() {



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
        <form>
          <Button formAction={logout}>Logout</Button>
        </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    )
}