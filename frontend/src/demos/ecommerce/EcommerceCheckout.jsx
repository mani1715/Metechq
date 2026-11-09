import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, Package, Truck } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useCart } from '../../context/CartContext';
import './ecommerce.css';

const EcommerceCheckout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate order placement
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      navigate('/demo/ecommerce');
    }, 3000);
  };

  if (cartItems.length === 0 && !orderPlaced) {
    navigate('/demo/ecommerce/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="ecommerce-checkout">
        <div className="container-ecom">
          <div className="order-success">
            <CheckCircle2 className="success-icon" />
            <h1 className="success-title">Demo checkout complete</h1>
            <p className="success-message">
              This is a simulated checkout. No payment was taken and no order will be shipped.
            </p>
            <div className="success-details">
              <p><strong>Order Total:</strong> ${total.toFixed(2)}</p>
              <p><strong>Order Number:</strong> #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            <p className="success-note">
              A confirmation email has been sent to {formData.email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ecommerce-checkout">
      <div className="container-ecom">
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-subtitle">Complete your purchase</p>

        <div className="checkout-layout">
          {/* Checkout Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <Card className="checkout-card">
                <div className="card-header">
                  <Truck className="h-6 w-6" />
                  <h2 className="card-title">Shipping Information</h2>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Information */}
              <Card className="checkout-card">
                <div className="card-header">
                  <CreditCard className="h-6 w-6" />
                  <h2 className="card-title">Payment Information</h2>
                </div>
                <div className="payment-note">
                  <p>This is a demo. No real payment will be processed.</p>
                </div>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="4242 4242 4242 4242"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date *</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVC *</label>
                    <input
                      type="text"
                      name="cardCVC"
                      value={formData.cardCVC}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                      className="form-input"
                    />
                  </div>
                </div>
              </Card>

              <Button type="submit" className="place-order-btn">
                Place Order - ${total.toFixed(2)}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary-section">
            <Card className="checkout-summary">
              <h2 className="summary-title">Order Summary</h2>
              
              {/* Order Items */}
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item.cartItemId} className="summary-item">
                    <div className="summary-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="summary-item-details">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                      {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                    </div>
                    <div className="summary-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              {/* Totals */}
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommerceCheckout;