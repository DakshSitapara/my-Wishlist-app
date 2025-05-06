'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WishlistItem } from '../types/item-types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';

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
  category: z.string().min(1, "Please select a category"),
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
      priority: values.priority, // Fix: Use values.priority here instead of item.priority
    };

    onUpdateItem(updatedItem);
    form.reset();
    onClose();
    toast.success('Item updated successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="relative p-8 w-full max-w-2xl mx-auto shadow-2xl bg-white rounded-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="justify-self-center text-2xl font-bold mb-4 text-gray-800 ">Edit Wishlist Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item Name */}
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

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-semibold">Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number" 
                        step="0" 
                        placeholder="₹ 0" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        value={field.value || ""}
                        min="0"
                        className="text-black placeholder:text-gray-400 border border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
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
              {/* Link */}
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

              {/* Image URL */}
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

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Input */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-semibold">Category</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value || ''}
                        className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      >
                        <option value="" disabled hidden>-- Select a category --</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Books">Books</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Home">Home</option>
                        <option value="Beauty">Beauty</option>
                        <option value="Sports">Sports</option>
                        <option value="Toys">Toys</option>
                        <option value="Other">Other</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priority Input */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-semibold">Priority</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value || ""}
                        className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      >
                        <option value="" disabled hidden>-- Select a priority --</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-black"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Update Item
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
