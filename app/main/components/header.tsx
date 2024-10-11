'use client'
import {useState} from 'react';
import Image from "next/image"
import Navbar from "./navigation"
import { ShoppingBag, Menu } from "lucide-react";

export default function Header() {
    const [isToggle, setIsToggle] = useState(false);

    return (
        <header className="flex justify-between items-center p-3">
            <div>
            <Image src={'/assets/images/logo.png'} alt="logo" width={50} height={50}/>     
            </div>
           
            <div className="flex items-center gap-2">
                <Navbar isToggle={isToggle} />
                <button className="relative bg-red-500 p-3 rounded-full">
                    <ShoppingBag size={18} />
                    <span className="absolute top-1 left-7">0</span>
                </button>
                <button onClick={() => setIsToggle(!isToggle)} className="sm:hidden">
                    <Menu/>
                </button>
            </div>
        </header>
    )
}