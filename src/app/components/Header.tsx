import Link from 'next/link';
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 py-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/">
                    <h1 className="text-white text-lg font-semibold">yuorei blog</h1>
                </Link>
                {/* <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="text-white">Home</a></li>
            <li><a href="#" className="text-white">About</a></li>
            <li><a href="#" className="text-white">Blog</a></li>
            <li><a href="#" className="text-white">Contact</a></li>
          </ul>
        </nav> */}
            </div>
        </header>
    );
}

export default Header;
