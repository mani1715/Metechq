import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Star, ArrowRight, Sparkles, Heart, 
  Search, ShieldCheck, Truck, RefreshCw, Zap, Check, Eye
} from 'lucide-react';
import { ecommerceProducts, ecommerceCategories } from '../../data/ecommerceData';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useCart } from '../../context/CartContext';
import EcommerceNav from './EcommerceNav';
import './ecommerce.css';

const EcommerceHome = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});

  // Countdown timer for flash sale
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (product) => {
    const size = selectedSizes[product.id] || (product.sizes && product.sizes[0]) || 'M';
    const color = (product.colors && product.colors[0]) || 'Default';
    addToCart(product, 1, size, color);

    // Show temporary "Added!" indicator
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  // Filter products based on active category & search
  const filteredProducts = useMemo(() => {
    return ecommerceProducts.filter(p => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchQuery = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="ecommerce-demo">
      <EcommerceNav />

      {/* Hero Banner */}
      <section className="ecom-hero-modern">
        <div className="ecom-hero-bg-overlay"></div>
        <div className="ecom-container ecom-hero-grid">
          <div className="ecom-hero-text">
            <div className="ecom-hero-badge">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Spring / Summer 2026 Edition</span>
            </div>
            <h1 className="ecom-hero-title">
              Effortless Elegance, <br />
              <span className="text-gradient-purple">Designed to Inspire.</span>
            </h1>
            <p className="ecom-hero-desc">
              Discover artisan crafted apparel and minimalist essentials engineered for modern lifestyle. 
              Sustainably sourced, precision tailored.
            </p>
            <div className="ecom-hero-cta-group">
              <Link to="/demo/ecommerce/shop">
                <Button className="ecom-btn-primary">
                  Explore Catalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <div className="ecom-hero-metrics">
                <div className="metric-pill">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span>4.9 / 5.0 (12k+ Reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="ecom-hero-card-preview">
            <div className="preview-card-glass">
              <div className="preview-badge">Featured Look</div>
              <img 
                src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&h=900&fit=crop" 
                alt="Spring Editorial" 
                className="preview-img"
              />
              <div className="preview-card-info">
                <div>
                  <h4>Atelier Linen Overshirt</h4>
                  <p>$119.00 <span className="line-through text-gray-400 text-xs">$159.00</span></p>
                </div>
                <Link to="/demo/ecommerce/shop?category=men">
                  <button className="preview-btn-icon">
                    <Eye className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Bar */}
      <div className="ecom-flash-bar">
        <div className="ecom-container flash-bar-inner">
          <div className="flash-title">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Limited-Time Flash Event: Extra 20% Off at Checkout</span>
          </div>
          <div className="flash-timer">
            <div className="timer-unit"><span>{String(timeLeft.hours).padStart(2, '0')}</span><small>hrs</small></div>
            <span className="timer-colon">:</span>
            <div className="timer-unit"><span>{String(timeLeft.minutes).padStart(2, '0')}</span><small>min</small></div>
            <span className="timer-colon">:</span>
            <div className="timer-unit"><span>{String(timeLeft.seconds).padStart(2, '0')}</span><small>sec</small></div>
          </div>
        </div>
      </div>

      {/* Category Pills & Search Controls */}
      <section className="ecom-control-section">
        <div className="ecom-container">
          <div className="ecom-controls-bar">
            {/* Category Filter Pills */}
            <div className="ecom-filter-pills">
              <button 
                className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Items ({ecommerceProducts.length})
              </button>
              {ecommerceCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-pill ${selectedCategory === cat.slug ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* In-Page Quick Search */}
            <div className="ecom-search-box">
              <Search className="h-4 w-4 text-gray-400 search-icon" />
              <input 
                type="text" 
                placeholder="Search products, materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ecom-search-input"
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="ecom-products-section">
        <div className="ecom-container">
          <div className="section-heading-row">
            <div>
              <h2 className="section-heading-title">
                {selectedCategory === 'all' ? 'Curated Collection' : `${selectedCategory.toUpperCase()} Selection`}
              </h2>
              <p className="section-heading-sub">
                Showing {filteredProducts.length} items ready for instant dispatch
              </p>
            </div>
            <Link to="/demo/ecommerce/shop" className="view-catalog-link">
              <span>View Full Shop</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products-found">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3>No products found</h3>
              <p>Try searching for a different keyword or select another category.</p>
              <Button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="ecom-product-grid">
              {filteredProducts.map(product => {
                const isWishlisted = wishlist[product.id];
                const isAdded = addedItems[product.id];
                const activeSize = selectedSizes[product.id] || (product.sizes && product.sizes[0]);

                return (
                  <Card key={product.id} className="ecom-product-card">
                    <div className="product-card-media">
                      <Link to={`/demo/ecommerce/product/${product.slug}`}>
                        <img src={product.image} alt={product.name} className="product-card-img" />
                      </Link>

                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <span className="badge-discount">-{product.discount}% OFF</span>
                      )}

                      {/* Wishlist Heart Button */}
                      <button 
                        className={`wishlist-toggle ${isWishlisted ? 'active' : ''}`}
                        onClick={() => toggleWishlist(product.id)}
                        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        aria-label="Wishlist"
                      >
                        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                      </button>
                    </div>

                    <div className="product-card-body">
                      <div className="product-category-tag">{product.category}</div>
                      <Link to={`/demo/ecommerce/product/${product.slug}`} className="product-title-link">
                        <h3 className="product-card-title">{product.name}</h3>
                      </Link>

                      <div className="product-rating-row">
                        <div className="rating-stars">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                        </div>
                        <span className="review-count">({product.reviews} reviews)</span>
                      </div>

                      {/* Size Selector */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="size-selector-row">
                          <span className="size-label">Size:</span>
                          <div className="size-pills">
                            {product.sizes.slice(0, 4).map(size => (
                              <button
                                key={size}
                                className={`size-pill ${activeSize === size ? 'selected' : ''}`}
                                onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="product-card-footer">
                        <div className="price-stack">
                          <span className="current-price">${product.price.toFixed(2)}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="old-price">${product.originalPrice.toFixed(2)}</span>
                          )}
                        </div>

                        <Button 
                          className={`ecom-add-btn ${isAdded ? 'btn-success' : ''}`}
                          onClick={() => handleAddToCart(product)}
                        >
                          {isAdded ? (
                            <>
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Added!
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="ecom-trust-section">
        <div className="ecom-container">
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon-box">
                <Truck className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h4>Express Global Shipping</h4>
                <p>Free delivery on all qualified orders over $75 with real-time tracking.</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <RefreshCw className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h4>30-Day Hassle-Free Returns</h4>
                <p>Not completely in love? Return or exchange with zero restocking fees.</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h4>256-Bit SSL Encrypted</h4>
                <p>Industry-standard PCI-compliant checkout powered by Stripe & Apple Pay.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcommerceHome;
