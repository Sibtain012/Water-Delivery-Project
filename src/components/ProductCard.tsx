import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking add to cart
    onAddToCart(product);
  };

  return (
    <div
      className="bg-background rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300 cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="aspect-square overflow-hidden rounded-t-lg bg-background">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-text">{product.name}</h3>
          <span className="text-sm text-text">{product.size}</span>
        </div>

        <p className="text-text text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-text">PKR {product.price}</span>
            {product.hasExchange && product.depositPrice && (
              <span className="text-xs text-accent">+ PKR {product.depositPrice} deposit</span>
            )}
          </div>

          <button
            onClick={handleAddToCartClick}
            className="bg-secondary hover:bg-accent text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
