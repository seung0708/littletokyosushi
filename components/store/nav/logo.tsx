import Link from "next/link";
import Image from "next/image";

export default function Logo() {
    return(

        <div className="hidden lg:flex lg:items-center">
            <Link href="/">
                <span className="sr-only">Your Company</span>
                <img
                    alt=""
                    src="/assets/images/logo.png"
                    className="h-12 w-auto"
                />
            </Link>
        </div>
    )
}
