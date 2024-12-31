import Link from "next/link";
import Image from "next/image";

export default function Logo() {
    return(
        <Link href="/" >
            <span className="sr-only">Little Tokyo Sushi</span>
            <Image
                className="w-auto"
                src={'/assets/images/logo.png'}
                alt="logo"
                height={44}
                width={44}
                priority
            />
            </Link>
    )
}
