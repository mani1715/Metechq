import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Store, Search, Heart, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import DemoTopNav from '../common/DemoTopNav';
import './ecommerce.css';

const EcommerceNav = () => {
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();
  const location = useLocation();

  return (
    <>
      <DemoTopNav currentDemoTitle="StyleHub E-Commerce" portfolioSlug="shopify-ecommerce-platform" />
      
      {/* Promotional Ticker */}
      <div className="ecommerce-promo-ticker">
        <div className="promo-ticker-content">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>Spring Collection Live: Use code <strong>METECHQ20</strong> for 20% off • Free Express Shipping on orders over $75</span>
        </div>
      </div>

      <nav className="ecommerce-nav">
        <div className="ecommerce-nav-container">
          {/* Brand Logo */}
          <Link to="/demo/ecommerce" className="ecommerce-logo">
            <div className="logo-icon-wrapper">
              <Store className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="logo-text">Style<span>Hub</span></span>
          </Link>

          {/* Navigation Links */}
          <div className="ecommerce-nav-links">
            <Link to="/demo/ecommerce" className={`nav-link ${location.pathname === '/demo/ecommerce' ? 'active' : ''}`}>
              Featured
            </Link>
            <Link to="/demo/ecommerce/shop" className={`nav-link ${location.pathname === '/demo/ecommerce/shop' ? 'active' : ''}`}>
              Shop All
            </Link>
            <Link to="/demo/ecommerce/shop?category=men" className="nav-link">
              Men
            </Link>
            <Link to="/demo/ecommerce/shop?category=women" className="nav-link">
              Women
            </Link>
            <Link to="/demo/ecommerce/shop?category=accessories" className="nav-link">
              Accessories
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="ecommerce-nav-actions">
            <Link to="/demo/ecommerce/shop" className="nav-action-btn" title="Search catalog">
              <Search className="h-5 w-5 text-gray-700" />
            </Link>

            <Link to="/demo/ecommerce/cart" className="ecommerce-cart-btn" title="View Cart">
              <ShoppingCart className="h-5 w-5 text-gray-800" />
              {cartCount > 0 && (
                <span className="cart-badge-bubble">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default EcommerceNav;
