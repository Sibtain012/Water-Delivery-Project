import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import AddToCartModal from '../components/AddToCartModal';
import { useProductStore } from '../store/productStore';
import { Product } from '../types';
import { usePageTitle } from '../hooks/usePageTitle';

const Products: React.FC = () => {
  usePageTitle('Products');
  const { products } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const filteredProducts = filterType === 'all'
    ? products
    : products.filter(product => product.type === filterType);

  const productTypes = [
    { value: 'all', label: 'All Products' },
    { value: 'bottle', label: 'Water Bottles' },
    { value: 'dispenser', label: 'Dispensers' },
    { value: 'accessory', label: 'Accessories' }
  ];

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mt-10 font-bold text-text mb-4">Our Products</h1>
          <p className="text-xl text-text/70 max-w-2xl mx-auto">
            Discover our complete range of premium water solutions for your home and office
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="w-5 h-5 text-text/70" />
            <span className="text-sm font-medium text-text">Filter by category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {productTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilterType(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === type.value
                  ? 'bg-secondary text-white'
                  : 'bg-white text-text/70 hover:bg-accent/20 border border-text/20'
                  }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text/70">No products found in this category.</p>
          </div>
        )}
      </div>

      <AddToCartModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Products;