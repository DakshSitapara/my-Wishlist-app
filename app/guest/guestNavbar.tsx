'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface NavbarProps {
  onAddItemClick: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAddItemClick, onSearchChange }) => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/'); // Redirect to home (localhost:3000)
  };

  return (
    <nav className="p-5">
      <div className="max-w-7x2 mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <h1 className="text-3xl font-bold text-black">🎁 My Wishlist</h1>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              onChange={onSearchChange}
              className="w-64 pl-10 pr-4 py-2 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Add Item */}
          <button
            onClick={onAddItemClick}
            className="border-1 border-gray-400 bg-white text-gray-600 font-semibold  px-4 py-2  rounded-lg  hover:bg-gray-600  hover:text-white transition duration-300 transform hover:scale-105"
          >
            + Add Item
          </button>

          {/* Login/Signup Button */}
          <button
            onClick={handleLogin}
            className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition"
          >
            Login/Signup
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
