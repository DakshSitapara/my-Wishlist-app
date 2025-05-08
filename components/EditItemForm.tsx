'use client';

import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WishlistItem } from '../types/item-types';
import { toast } from 'sonner';
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
import {
  Dialog,
  DialogClose,
} from '@/components/ui/dialog'; // ✅ ShadCN UI Dialog

const editItemFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  link: z.string().url('Please enter a valid URL'),
  price: z
    .number()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
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
}

export function EditItemForm({ item, onUpdateItem, onClose }: EditItemFormProps) {
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

  const onSubmit = (values: EditItemFormData) => {
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
    form.reset();
    onClose();
    toast.success('Item updated successfully!');
  };
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
  
    // Check if click was inside the dialog
    if (dialogRef.current && dialogRef.current.contains(target)) return;
  
    // Avoid closing if the dropdown is open
    if (target.closest("[data-dropdown-menu]")) return;
  
    onClose();
  };
  
  return (
      <Dialog open onOpenChange={onClose}>
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" 
          onClick={handleClickOutside}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed bottom-half left-0 right-0 px-4 pb-4 z-50"
      >
    
        <Card 
        ref={dialogRef}
        className="max-h-[90vh] overflow-y-auto relative p-8 w-full max-w-2xl mx-auto shadow-2xl bg-white rounded-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-6 p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <h2 className="justify-self-center text-2xl font-bold mb-4 text-gray-800">Edit Wishlist Item</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-semibold">Item Name</FormLabel>
                      <FormControl>
                        <Input
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
                            <Button variant="outline" className="w-full justify-between text-sm text-gray-700">
                              {field.value || 'Select a category'}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full" data-dropdown-menu>
                          {[
                              'Electronics',
                              'Books',
                              'Clothing',
                              'Home',
                              'Beauty',
                              'Sports',
                              'Toys',
                              'Other',
                            ].map((category) => (
                              <DropdownMenuItem
                                key={category}
                                onSelect={() => field.onChange(category)}
                                className={field.value === category ? 'bg-gray-100 font-medium' : ''}
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
                            <Button variant="outline" className="w-full justify-between text-sm text-gray-700">
                              {field.value || 'Select a priority'}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full" data-dropdown-menu>
                          {['High', 'Medium', 'Low'].map((priority) => (
                              <DropdownMenuItem
                                key={priority}
                                onSelect={() => field.onChange(priority)}
                                className={field.value === priority ? 'bg-gray-100 font-medium' : ''}
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
                  variant="outline"
                  className="border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-black"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Update Item
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </motion.div>
      </div>
      <DialogClose asChild>
    </DialogClose>
</Dialog>

  ); 
}
