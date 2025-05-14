'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../guest/guestNavbar';
import { ItemForm } from '../../components/ItemForm';
import ItemList from '../../components/ItemList';
import { EditItemForm } from '../../components/EditItemForm';
import { WishlistItem } from '../../types/item-types';
import SidebarFilter from '@/components/SidebarFilter';
import ClientOnly from '@/components/ClientOnly';
import { useLocalStorageState } from '@/app/utils/useLocalStorageState';
import { toast } from 'react-toastify';

export default function GuestPage() {
  const [items, setItems] = useLocalStorageState<WishlistItem[]>('wishlist_guest', []);
  const [search, setSearch] = useLocalStorageState<string>('wishlist-search-guest', '');
  const [selectedCategories, setSelectedCategories] = useLocalStorageState<string[]>('wishlist-categories-guest', []);
  const [selectedStatuses, setSelectedStatuses] = useLocalStorageState<string[]>('wishlist-statuses-guest', []);
  const [priceRange, setPriceRange] = useLocalStorageState<{ min: string; max: string }>('wishlist-price-range-guest', { min: '', max: '' });
  const [selectedPriorities, setSelectedPriorities] = useLocalStorageState<string[]>('wishlist-priorities-guest', []);
  const [customCategories, setCustomCategories] = useLocalStorageState<string[]>('wishlist-custom-categories-guest', []);
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
    setItems((prev) => [newItem, ...prev]);
    setIsFormVisible(false);
    toast.success('Item added successfully!');
  };

  // Edit
  const handleEditItem = (item: WishlistItem) => setEditingItem(item);

  const handleUpdateItem = (updatedItem: WishlistItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditingItem(null);
    toast.success('Item updated successfully!');
  };

  // Delete
  const handleDeleteItem = (id: string) => {
    const deletedItem = items.find((item) => item.id === id);
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    if (deletedItem && customCategories.includes(deletedItem.category)) {
      const isCategoryUsed = updatedItems.some(
        (item) => item.category === deletedItem.category
      );
      if (!isCategoryUsed) {
        setCustomCategories(
          customCategories.filter((cat) => cat !== deletedItem.category)
        );
      }
    }
    toast.success('Item deleted successfully!');
  };

  // Toggle Purchased
  const handleTogglePurchased = (id: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
    );
    setItems(updatedItems);
    const toggledItem = updatedItems.find((item) => item.id === id);
    toast.dismiss();
    if (toggledItem?.isPurchased) {
      toast.success('Marked as purchased!', { toastId: 'purchase-status' });
    } else {
      toast.info('Marked as not purchased!', { toastId: 'purchase-status' });
    }
  };

  // Search
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
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen overflow-auto">
      <aside
        className={`fixed top-20 left-0 h-[90vh] z-30 w-64 bg-white shadow-md rounded-md p-4 overflow-auto no-scrollbar border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:block`}
      >
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
            customCategories={customCategories}
          />
        </ClientOnly>
      </aside>

      <div className="flex-1 overflow-auto md:ml-64">
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-20">
          <Navbar
              onAddItemClick={() => setShowAlert(true)}
              onSearchChange={handleSearchChange}
            />
          <div className="p-2 md:hidden">
            <button
              className="text-indigo-600 border border-indigo-600 px-3 py-1 rounded hover:bg-indigo-600 hover:text-white transition"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? 'Close Filters' : 'Open Filters'}
            </button>
          </div>
        </div>

        <div className="mt-20 p-4">
          {isFormVisible && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              <ItemForm
                onAddItem={handleAddItem}
                onClose={() => setIsFormVisible(false)}
                customCategories={customCategories}
                setCustomCategories={setCustomCategories}
              />
            </div>
          )}

          {editingItem && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              <EditItemForm
                item={editingItem}
                onUpdateItem={handleUpdateItem}
                onClose={() => setEditingItem(null)}
                customCategories={customCategories}
                setCustomCategories={setCustomCategories}
              />
            </div>
          )}

          {showAlert && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-md shadow-md text-center space-y-4">
                <h2 className="text-xl text-black font-semibold">
                  Login/Sign Up to Save Your Wishlist
                </h2>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setShowAlert(false);
                      setIsFormVisible(true);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                  >
                    OK
                  </button>
                  <button
                    onClick={() => {
                      setShowAlert(false);
                      setIsFormVisible(false);
                    }}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-8 text-2xl">
              <h1>Your wishlist is empty. Start by adding an item!</h1>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-8 text-2xl">
              <h1>No items match your current search and filters.</h1>
              <p>Try adjusting the search term or filters.</p>
            </div>
          ) : (
            <ClientOnly>
              <ItemList
                items={filteredItems}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onTogglePurchased={handleTogglePurchased}
              />
            </ClientOnly>
          )}
        </div>
      </div>
    </div>
  );
}