import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import settingsService from '../services/settingsService';

/**
 * Floating WhatsApp Button Component
 * Displays a fixed floating button for WhatsApp click-to-chat
 */
const WhatsAppButton = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsService.getSettings();
        if (settings?.whatsapp_number) {
          setWhatsappNumber(settings.whatsapp_number);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error fetching WhatsApp settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleWhatsAppClick = () => {
    if (whatsappNumber) {
      const message = encodeURIComponent("Hi METECHQ, I'm interested in your services.");
      const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    }
  };

  // Don't render if no WhatsApp number configured
  if (!isVisible || !whatsappNumber) {
    return null;
  }

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 999,
        }}
      >
        {/* Tooltip */}
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              bottom: '70px',
              right: '0',
              background: '#fff',
              color: '#352a21',
              padding: '12px 16px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              whiteSpace: 'nowrap',
              fontSize: '14px',
              fontWeight: '500',
              animation: 'fadeInUp 0.3s ease',
            }}
          >
            Chat with us on WhatsApp
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '20px',
                width: '12px',
                height: '12px',
                background: '#fff',
                transform: 'rotate(45deg)',
              }}
            />
          </div>
        )}

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            border: 'none',
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            animation: 'pulse 2s infinite',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(37, 211, 102, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.4)';
          }}
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
        >
          <MessageCircle size={28} color="#fff" strokeWidth={2} />
        </button>

        {/* Pulse Animation Ring */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '3px solid #25D366',
            animation: 'pulse-ring 2s infinite',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0% {
              box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
            }
            50% {
              box-shadow: 0 4px 20px rgba(37, 211, 102, 0.6);
            }
            100% {
              box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
            }
          }

          @keyframes pulse-ring {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1.4);
              opacity: 0;
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {
            .whatsapp-floating-button {
              bottom: 20px !important;
              right: 20px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default WhatsAppButton;
