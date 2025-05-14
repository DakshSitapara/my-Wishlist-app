
'use client';

import React, { useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WishlistItem } from '@/types/item-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Form validation schema
const editItemFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  link: z.string().url('Please enter a valid URL'),
  price: z.number().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Please enter a valid price',
  }),
  imageUrl: z.string().url('Please enter a valid image URL').optional(),
  category: z.string().min(1, 'Please select a category'),
  priority: z.enum(['High', 'Medium', 'Low'], {
    required_error: 'Priority is required',
  }),
});

type EditItemFormData = z.infer<typeof editItemFormSchema>;

interface EditItemFormProps {
  item: WishlistItem;
  onUpdateItem: (updatedItem: WishlistItem) => void;
  onClose: () => void;
  customCategories: string[];
  setCustomCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export function EditItemForm({
  item,
  onUpdateItem,
  onClose,
  customCategories,
  setCustomCategories,
}: EditItemFormProps) {
  const [showCustomCategoryDialog, setShowCustomCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allCategories = [
    'Electronics',
    'Books',
    'Clothing',
    'Home',
    'Beauty',
    'Sports',
    'Toys',
    ...customCategories,
    'Other',
  ];


  const form = useForm<EditItemFormData>({
    resolver: zodResolver(editItemFormSchema),
    defaultValues: {
      name: item.name,
      description: item.description,
      link: item.link,
      price: item.price,
      imageUrl: item.imageUrl || '',
      category: item.category,
      priority: item.priority,
    },
  });

  const onSubmit = async (values: EditItemFormData) => {
    setIsSubmitting(true);
    const updatedItem: WishlistItem = {
      id: item.id,
      name: values.name,
      description: values.description,
      link: values.link,
      price: Number(values.price),
      imageUrl: values.imageUrl || '',
      isPurchased: item.isPurchased,
      category: values.category,
      priority: values.priority,
    };

    onUpdateItem(updatedItem);
    setIsSubmitting(false);
    onClose();
  };

  const dialogRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dialogRef.current?.contains(target)) return;
      if (target.closest('[data-dropdown-menu]')) return;
      onClose();
    },
    [onClose]
  );

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="w-full max-w-2xl px-4 pb-4"
      >
        <Card
          ref={dialogRef}
          className="max-h-[90vh] overflow-y-auto relative p-8 shadow-2xl bg-white rounded-3xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-6 p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                Edit Wishlist Item
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-semibold">Item Name</FormLabel>
                      <FormControl>
                        <Input
                          autoFocus
                          placeholder="Enter item name..."
                          {...field}
                          className="text-black placeholder:text-gray-400 border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-semibold">Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="₹ 0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          value={field.value || ''}
                          min="0"
                          className="text-black placeholder:text-gray-400 border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-semibold">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter item description..."
                        {...field}
                        className="resize-none text-black placeholder:text-gray-400 min-h-[120px] border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-semibold">Item Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          {...field}
                          className="text-black placeholder:text-gray-400 border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-semibold">Item Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter image URL..."
                          {...field}
                          className="text-black placeholder:text-gray-400 border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-semibold">Category</FormLabel>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className={cn(
                                'w-full justify-between bg-white text-sm border border-gray-300 shadow',
                                field.value ? 'text-black' : 'text-gray-400'
                              )}
                            >
                              {field.value || 'Select a category'}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full" data-dropdown-menu>
                            {allCategories.map((category) => (
                              <DropdownMenuItem
                                key={category}
                                onClick={() => {
                                  if (category === 'Other') {
                                    setShowCustomCategoryDialog(true);
                                  } else {
                                    field.onChange(category);
                                  }
                                }}
                                className={cn(
                                  field.value === category? 'bg-gray-100 text-black font-medium': '' )}
                              >
                                {category}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-semibold">Priority</FormLabel>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className={cn(
                                'w-full justify-between bg-white text-sm border border-gray-300 shadow',
                                field.value ? 'text-black' : 'text-gray-400'
                              )}
                            >
                              {field.value || 'Select a priority'}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full" data-dropdown-menu>
                            {['High', 'Medium', 'Low'].map((priority) => (
                              <DropdownMenuItem
                                key={priority}
                                onSelect={() => field.onChange(priority)}
                                className={cn(field.value === priority ? 'bg-gray-100 text-black font-medium' : '')}
                              >
                                {priority}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  onClick={onClose}
                  className="border border-gray-300 text-gray-800 bg-white hover:bg-gray-300 hover:text-black rounded-md px-4 py-2 transition-colors hover:scale-105"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !form.formState.isValid}
                  className="bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-black transition duration-300 transform hover:scale-105"
                >
                  {isSubmitting ? 'Updating...' : 'Update Item'}
                </Button>
              </div>
            </form>
          </Form>
          
                    {showCustomCategoryDialog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                      <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                        <h2 className="mb-4  text-center font-semibold text-black text-lg">Add New Category</h2>
                        <Input
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Enter new category..."
                          className="text-black placeholder:text-gray-400 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-500 focus:shadow-md"
          
                        />
                        <div className="flex justify-center-safe gap-2  ">
                          <Button 
                            type='button'
                            onClick={() => setShowCustomCategoryDialog(false)}
                            className="border border-gray-300 text-gray-800 bg-white hover:bg-gray-300 hover:text-black rounded-md px-4 py-2 transition-colors hover:scale-105"
                          >
                            Cancel
                          </Button>
                            <Button
                              onClick={() => {
                                if (newCategoryName.trim() && !allCategories.includes(newCategoryName)) {
                                  setCustomCategories([...customCategories, newCategoryName]);
                                  form.setValue('category', newCategoryName);
                                  setNewCategoryName('');
                                  setShowCustomCategoryDialog(false);
                                }
                              }}
                              className="bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-black transition duration-300 transform hover:scale-105"
                            >
                              Add
                            </Button>
                        </div>
                      </div>
                    </div>
                  )}
        </Card>      </motion.div>
    </div>
  );
}
