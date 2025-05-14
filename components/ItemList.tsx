'use client';

import { useState } from 'react';
import { SquarePen, Trash2, ExternalLink } from 'lucide-react';
import React from 'react';
import ImageWithSkeleton from './ImageWithSkeleton'; 
import { WishlistItem } from '../types/item-types';

interface ItemListProps {
  items: WishlistItem[];
  onEdit: (item: WishlistItem) => void;
  onDelete: (id: string) => void;
  onTogglePurchased: (id: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onEdit, onDelete, onTogglePurchased }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<null | string>(null);

  return (
    <> 
     {/* <div className="pt-10"> */}
      <div className=" grid gap-6 mt-6 max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-xl p-4 transition-all duration-200 hover:shadow-md border border-gray-200 relative flex flex-col hover:scale-105"
          >
            <div
              className={`absolute top-5 left-5 px-3 py-1 rounded-md text-white font-semibold text-xs z-10
              ${item.priority === 'High' ? 'bg-red-500' : 
               item.priority === 'Medium' ? 'bg-yellow-500' : 'bg-gray-500'}`}
            >
              {item.priority}
            </div>

            {item.imageUrl && (
              <ImageWithSkeleton src={item.imageUrl} alt={item.name} />
            )}

            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
              <p className="text-gray-700 font-bold text-lg">₹ {item.price}</p>
            </div>

            <p className="text-gray-600 mt-2 sm:text-base md:text-lg overflow-hidden text-ellipsis whitespace-nowrap  ">
                {item.description}
              </p>

            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              {item.category && (
                <span
                  className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded
                  ${
                    item.category === 'Electronics' ? 'bg-blue-100 text-blue-700' :
                    item.category === 'Books' ? 'bg-green-100 text-green-700' :
                    item.category === 'Clothing' ? 'bg-pink-100 text-pink-700' :
                    item.category === 'Home' ? 'bg-yellow-100 text-yellow-700' :
                    item.category === 'Beauty' ? 'bg-purple-100 text-purple-700' :
                    item.category === 'Sports' ? 'bg-orange-100 text-orange-700' :
                    item.category === 'Toys' ? 'bg-teal-100 text-teal-700' :
                    'bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.category}
                </span>
              )}

              <button
                onClick={() => onTogglePurchased(item.id)}
                className={`text-sm px-4 py-1.5 rounded-full font-medium transition-colors duration-300 ease-in-out shadow-sm ${
                  item.isPurchased
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {item.isPurchased ? '✔️ Purchased' : '🛒 Not Purchased'}
              </button>
            </div>

            <div className="mt-4 flex justify-between items-center gap-4">
              {item.link && (
                <a
                  title='View item'
                  href={item.link}
                  rel="noopener noreferrer"
                  className="flex items-center text-purple-600 hover:text-purple-800"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View Item
                </a>
              )}

              <div className="flex justify-end items-center space-x-3">
                <button
                  onClick={() => onEdit(item)}
                  title="Edit item"
                  className="flex items-center justify-center w-7 h-7 text-gray-600 hover:text-indigo-700 hover:bg-indigo-300 rounded-md transition-colors"
               >
                  <SquarePen className="w-5 h-5" />
                  
                </button>

                <button
                  onClick={() => {
                    setItemToDelete(item.id);
                    setShowConfirm(true);
                  }}
                  title="Delete item"
                  className="flex items-center justify-center w-7 h-7 text-red-600 hover:text-red-700 hover:bg-red-300 rounded-md transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showConfirm && itemToDelete && (
      <div className="fixed inset-0 z-50 bg-black/40 bg-opacity-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
          <h3 className="text-lg font-semibold text-gray-800">Delete Item</h3>
          <p className="text-sm text-gray-600 mt-2 mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowConfirm(false);
                setItemToDelete(null);
              }}
              className="px-4 py-2 text-sm rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (itemToDelete) {
                  onDelete(itemToDelete);
                  setShowConfirm(false);
                  setItemToDelete(null);
                }
              }}
              className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      )}
      {/* </div> */}
    </>
  );
};

export default ItemList;
