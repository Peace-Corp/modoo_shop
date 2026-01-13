'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Brand, Product } from '@/types';

interface AdminBrandsProps {
  brands: Brand[];
  products: Product[];
}

export default function AdminBrands({ brands, products }: AdminBrandsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProductCount = (brandId: string) => {
    return products.filter(p => p.brandId === brandId).length;
  };

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingBrand(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
        <Button onClick={openAddModal}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Brand
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <Input
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map(brand => (
          <div key={brand.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative h-32">
              <Image
                src={brand.banner}
                alt={brand.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-white">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white">{brand.name}</h3>
                  <p className="text-xs text-gray-200">{brand.slug}</p>
                </div>
              </div>
              {brand.featured && (
                <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                  Featured
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{brand.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {getProductCount(brand.id)} products
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(brand)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </h2>
            </div>
            <form className="p-6 space-y-4">
              <Input
                label="Brand Name"
                defaultValue={editingBrand?.name}
                required
              />
              <Input
                label="Slug"
                defaultValue={editingBrand?.slug}
                helperText="URL-friendly name (e.g., my-brand)"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  defaultValue={editingBrand?.description}
                  required
                />
              </div>
              <Input
                label="Logo URL"
                defaultValue={editingBrand?.logo}
                required
              />
              <Input
                label="Banner URL"
                defaultValue={editingBrand?.banner}
                required
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  defaultChecked={editingBrand?.featured}
                />
                <span className="ml-2 text-sm text-gray-700">Featured Brand</span>
              </label>
            </form>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                {editingBrand ? 'Save Changes' : 'Add Brand'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
