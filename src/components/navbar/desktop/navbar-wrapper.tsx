import { getCurrentUser } from "@/services/auth/functions/currentUser"
import { Navbar } from "./index"

export async function NavbarWrapper({ isBannerOpen }: { isBannerOpen?: boolean }) {
    const user = await getCurrentUser({ withFullUser: true })
    return <Navbar user={user} />
} 