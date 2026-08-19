'use client';

import {useState, useEffect} from 'react';
import Navbar from "./navigation"

export default function Header() {
    const [open, setOpen] = useState(false)

    return (
        <div className="bg-white">
            <header className="relative">
                <Navbar open={open} setOpen={setOpen} />
            </header>
        </div>
    );
}