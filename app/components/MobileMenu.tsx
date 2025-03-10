'use client';
import Link from 'next/link'
import { useState } from 'react';

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div>
            {!isOpen ? (<div className="md:hidden  p-1 rounded-sm">
                <button onClick={toggleMenu} className="focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>) : null}
            <div
                className={`z-99 fixed h-full top-0 right-0 bg-white w-64 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <button
                    onClick={toggleMenu}
                    className="absolute top-4 left-52 text-white focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="black"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        ></path>
                    </svg>
                </button>
                <nav className="flex flex-col space-y-2 p-4 mt-12">
                    <Link href="/" className="hover:text-gray-400">ホーム</Link>
                    <Link href="https://yuorei.com" className="hover:text-gray-400" target="_blank">プロフィール</Link>
                </nav>
            </div>
        </div>
    )

}

export default MobileMenu
