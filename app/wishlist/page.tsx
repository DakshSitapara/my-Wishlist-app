'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../../components/Navbar';
import { ItemForm } from '../../components/ItemForm';
import ItemList from '../../components/ItemList';
import { EditItemForm } from '../../components/EditItemForm';
import { WishlistItem } from '../../types/item-types';
import SidebarFilter from '@/components/SidebarFilter';
import { useLocalStorageState } from '@/app/utils/useLocalStorageState';
import ClientOnly from '@/components/ClientOnly';
import { getWishlistForUser, setLocalStorage } from '../utils/localStorage';
import { toast } from "react-toastify";



export default function WishlistPage() {
  const router = useRouter();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [search, setSearch] = useLocalStorageState<string>('wishlist-search', '');
  const [selectedCategories, setSelectedCategories] = useLocalStorageState<string[]>('wishlist-categories', []);
  const [selectedStatuses, setSelectedStatuses] = useLocalStorageState<string[]>('wishlist-statuses', []);
  const [priceRange, setPriceRange] = useLocalStorageState<{ min: string; max: string }>('wishlist-price-range', { min: '', max: '' });
  const [selectedPriorities, setSelectedPriorities] = useLocalStorageState<string[]>('wishlist-priorities', []);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);

  const activeUser = typeof window !== 'undefined' ? localStorage.getItem('activeUser') : null;

  const persistItems = (updatedItems: WishlistItem[]) => {
    setItems(updatedItems);
    if (activeUser) {
      setLocalStorage(`wishlist-${activeUser}`, updatedItems);
    }
  };

  // Add
  const handleAddItem = (item: Omit<WishlistItem, 'id'>) => {
    const newItem: WishlistItem = {
      ...item,
      id: uuidv4(),
      isPurchased: false,
    };
    persistItems([...items, newItem]);
    setIsFormVisible(false);
  };
  

  // Edit
  const handleEditItem = (item: WishlistItem) => setEditingItem(item);

  const handleUpdateItem = (updatedItem: WishlistItem) => {
    const updated = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    persistItems(updated);
    setEditingItem(null);
  };
  

  // Delete
  const handleDeleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    persistItems(updated);
    toast.success("Item deleted successfully!");
  };
  

  // Toggle Purchased
  const handleTogglePurchased = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
    );
    persistItems(updated)
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);  

  // Filters
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

  useEffect(() => {
    const activeUser = localStorage.getItem('currentUser');
    console.log(activeUser, "activeUser");
    if (!activeUser) {
      router.push('/login');
      return;
    }

    const savedItems = getWishlistForUser<WishlistItem[]>(`wishlist-${activeUser}`) ?? [];
    setItems(savedItems);
  }, [router]);

  return (
    <div className="flex justify-around items-start bg-gray-100 h-screen overflow-auto ">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md rounded-md fixed top-20 left-0 h-full z-10">
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
      <div className="w-full overflow-auto md:ml-64">
        {/* Navbar */}
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-20">
          <Navbar
            onAddItemClick={() => setIsFormVisible(true)}
            onSearchChange={handleSearchChange}
            setSelectedCategories={setSelectedCategories}
            setSelectedStatuses={setSelectedStatuses}
            setPriceRange={setPriceRange}
            setSelectedPriorities={setSelectedPriorities}
          />
        </div>

        {/* Content Area (Scrollable) */}
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

          {/* Item List */}
          <ClientOnly>
            {items.length === 0 ? (
              <div className="text-center text-gray-500 mt-70 text-4xl">
                <h1>Your wishlist is empty. Start by adding an item!</h1>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center text-gray-500 mt-70 text-4xl">
                <h1>No items match your current search and filters.</h1>
                <p>Try adjusting the search term or filters.</p>
              </div>
            ) : (
              <ItemList
                items={filteredItems}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onTogglePurchased={handleTogglePurchased}
              />
            )}
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}
