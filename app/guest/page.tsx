'use client';

import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../guest/guestNavbar';
import { ItemForm } from '../../components/ItemForm';
import ItemList from '../../components/ItemList';
import { EditItemForm } from '../../components/EditItemForm';
import { WishlistItem } from '../../types/item-types';
import SidebarFilter from '@/components/SidebarFilter';
import ClientOnly from '@/components/ClientOnly';

export default function GuestPage() {

    const router = useRouter();
      useEffect(() => {
        const user = (localStorage.getItem('activeUser'));
        if (!user) {
          router.push('/login');
        }
      }, [router]);


  const [items, setItems] = useState<WishlistItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);



  // Add
  const handleAddItem = (item: Omit<WishlistItem, 'id'>) => {
    const newItem: WishlistItem = {
      ...item,
      id: uuidv4(),
      isPurchased: false,
    };
    setItems((prev) => [...prev, newItem]);
    setIsFormVisible(false);
  };

  // Edit
  const handleEditItem = (item: WishlistItem) => setEditingItem(item);

  const handleUpdateItem = (updatedItem: WishlistItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditingItem(null);
  };

  // Delete
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleTogglePurchased = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
      )
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const matchesStatus =
      selectedStatuses.length === 0 ||
      (item.isPurchased && selectedStatuses.includes('purchased')) ||
      (!item.isPurchased && selectedStatuses.includes('not-purchased'));
    const price = parseFloat(item.price.toString());
    const min = parseFloat(priceRange.min) || 0;
    const max = parseFloat(priceRange.max) || Infinity;
    const matchesPrice = price >= min && price <= max;
    const matchesPriority =
      selectedPriorities.length === 0 || selectedPriorities.includes(item.priority);
    return (
      matchesSearch && matchesCategory && matchesStatus && matchesPrice && matchesPriority
    );
  });

  return (
    <div className="flex justify-around items-start bg-gray-100 h-screen overflow-auto">

      {/* Sidebar */}
      {/* <aside className="w-64 bg-white shadow-md rounded-md fixed top-20 left-0 h-full z-10"> */}
      <aside className={`w-64 bg-white shadow-md rounded-md fixed top-20 left-0 h-full z-10 transition-transform transform 
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <ClientOnly>
          <SidebarFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedPriorities={selectedPriorities}
            setSelectedPriorities={setSelectedPriorities}
          />
        </ClientOnly>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col w-full ml-64">
        {/* Navbar */}
        {/* <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-20">
        <Navbar
            onAddItemClick={() => setShowAlert(true)}
            onSearchChange={handleSearchChange}
        />

        </div> */}
        {/* Navbar */}
       <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-20"> 
  <Navbar
    onAddItemClick={() => setShowAlert(true)}
    onSearchChange={handleSearchChange}
  />
  
  {/* Mobile Filter Toggle Button */}
  <button
    className="md:hidden text-indigo-600 border border-indigo-600 px-3 py-1 rounded"
    onClick={() => setSidebarOpen(!sidebarOpen)}
  >
    Filters
  </button>
</div>

        {/* Content */}
        <div className="mt-16 h-full overflow-y-auto p-4">
          {/* Add Form */}
          {isFormVisible && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              <ItemForm onAddItem={handleAddItem} onClose={() => setIsFormVisible(false)} />
            </div>
          )}

          {/* Edit Form */}
          {editingItem && (
            <EditItemForm
              item={editingItem}
              onUpdateItem={handleUpdateItem}
              onClose={() => setEditingItem(null)}
            />
          )}
          {showAlert && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center space-x-4 mt-4 z-50">
                <div className="bg-white p-6 rounded-md shadow-md text-center">
                <h2 className="text-xl text-black font-semibold mb-4">Login/Sign Up to Save Your Wishlist</h2>
                <button
                    onClick={() => {
                    setShowAlert(false);
                    setIsFormVisible(true);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    OK
                </button>
                <button
                    onClick={() => {
                    setShowAlert(false);
                    setIsFormVisible(false);
                    }}                    
                    className="ml-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
                    Cancel
                    </button>
                </div>
            </div>
            )}

          {/* Item List */}
          <ClientOnly>
            <ItemList
              items={filteredItems}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onTogglePurchased={handleTogglePurchased}
            />
          </ClientOnly>
          {/* <div  className="flex flex-col items-center justify-center  space-y-4 text-gray-700">
            <h1 className="text-4xl font-bold">Welcome to Wishlist</h1>
            <h2 className="text-lg font-medium">Login/Sign Up to Save Your Wishlist</h2>
         </div> */}
        </div>
      </div>
    </div>
  );
}
