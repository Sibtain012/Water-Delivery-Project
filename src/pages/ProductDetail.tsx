import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { Product } from '../types';
import AddToCartModal from '../components/AddToCartModal';
import { usePageTitle } from '../hooks/usePageTitle';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProductStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Set page title based on product name
  usePageTitle(product ? product.name : 'Product Detail');

  useEffect(() => {
    if (id) {
      const foundProduct = products.find((p: Product) => p.id === id);
      setProduct(foundProduct || null);
      window.scrollTo(0, 0);
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-secondary hover:bg-accent text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsModalOpen(true);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  // Mock additional images for demo - in real app, you'd have multiple images per product
  const productImages = [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-text/60 hover:text-text transition-colors"
            >
              Home
            </button>
            <span className="text-text/40">/</span>
            <button
              onClick={() => navigate('/products')}
              className="text-text/60 hover:text-text transition-colors"
            >
              Products
            </button>
            <span className="text-text/40">/</span>
            <span className="text-text font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-text/60 hover:text-text mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 bg-white rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-secondary' : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-text/60">Size: {product.size}</span>
                <span className="text-text/40">•</span>
                <span className="text-text/60 capitalize">Type: {product.type}</span>
              </div>

              {/* Rating (mock) */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-secondary fill-current" />
                  ))}
                </div>
                <span className="text-text/60">(4.8) • 124 reviews</span>
              </div>
            </div>

            <p className="text-text/80 text-lg leading-relaxed">{product.description}</p>

            {/* Price */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-text">PKR {product.price}</span>
                  {product.hasExchange && product.depositPrice && (
                    <div className="text-sm text-accent mt-1">+ PKR {product.depositPrice} deposit (refundable)</div>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={decrementQuantity}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold text-text w-8 text-center">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-secondary hover:bg-accent text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Add to Cart
              </button>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-text">Features & Benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text">Free Delivery</h4>
                    <p className="text-sm text-text/60">Same day delivery available</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text">Quality Guaranteed</h4>
                    <p className="text-sm text-text/60">100% satisfaction promise</p>
                  </div>
                </div>

                {product.hasExchange && (
                  <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 sm:col-span-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text">Bottle Exchange Program</h4>
                      <p className="text-sm text-text/60">Return empty bottles for fresh ones at no extra cost</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-text mb-4">Product Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text/60">Product ID:</span>
                  <span className="text-text font-medium">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text/60">Size:</span>
                  <span className="text-text font-medium">{product.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text/60">Type:</span>
                  <span className="text-text font-medium capitalize">{product.type}</span>
                </div>
                {product.hasExchange && (
                  <div className="flex justify-between">
                    <span className="text-text/60">Exchange Available:</span>
                    <span className="text-secondary font-medium">Yes</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddToCartModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;
