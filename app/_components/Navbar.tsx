import Image from "next/image";
import Link from "next/link";
import DesktopLogo from "../../public/airbnb-desktop.png"
import MobileLogo from "../../public/airbnb-mobile.webp"
import { UserNav } from "./Usernav";
import { SearchModel } from "./SearchComponent";


export default function Navbar() {
    return (
        <nav className="w-full border-b">
            <div className="flex items-center justify-between container mx-auto px-5 lg:px-10 py-5">
                <Link href="/">
                    <Image src={DesktopLogo} alt="" className="w-32 hidden lg:block" />
                    <Image src={MobileLogo} alt="" className="w-12 block lg:hidden" />
                </Link>

                {/* Search input */}
                <SearchModel />
                <UserNav />
            </div>
        </nav>
    )
};