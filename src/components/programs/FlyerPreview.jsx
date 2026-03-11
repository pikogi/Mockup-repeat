import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Helper to darken color
const darkenColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
  const B = Math.max((num & 0x0000FF) - amt, 0);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
};

// Helper to add alpha to hex color
const addAlpha = (hex, alpha) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const R = (num >> 16) & 255;
  const G = (num >> 8) & 255;
  const B = num & 255;
  return `rgba(${R}, ${G}, ${B}, ${alpha})`;
};

const FlyerPreview = forwardRef(({
  card,
  template = 'classic',
  customTitle,
  customSubtitle,
  customReward,
  shareUrl,
  isForDownload = false
}, ref) => {
  const title = customTitle || card?.club_name || 'Programa de Fidelidad';
  const subtitle = customSubtitle || 'Escanea y únete gratis';
  const reward = customReward || card?.reward_text || 'Recompensa especial';
  const accentColor = card?.card_color || '#8B5CF6';
  const logoUrl = card?.logo_url;
  const darkAccent = darkenColor(accentColor, 15);
  const flyerId = isForDownload ? 'flyer-preview-download' : 'flyer-preview';

  // Base container styles
  const containerStyle = {
    width: '400px',
    height: '566px',
    backgroundColor: '#ffffff',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative'
  };

  // Classic Template
  if (template === 'classic') {
    return (
      <div ref={ref} id={flyerId} style={containerStyle}>
        {/* Top bar */}
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: accentColor
        }} />

        {/* Main content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 32px'
        }}>
          {/* Logo */}
          <div style={{ marginBottom: '20px' }}>
            {logoUrl ? (
              <div style={{
                padding: '12px',
                borderRadius: '16px',
                backgroundColor: addAlpha(accentColor, 0.1)
              }}>
                <img
                  src={logoUrl}
                  alt={title}
                  style={{ width: '72px', height: '72px', objectFit: 'contain' }}
                  crossOrigin="anonymous"
                />
              </div>
            ) : (
              <div style={{
                width: '88px',
                height: '88px',
                borderRadius: '16px',
                backgroundColor: accentColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <span style={{
                  color: '#ffffff',
                  fontSize: '36px',
                  fontWeight: 'bold'
                }}>
                  {title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1a1a1a',
              margin: '0 0 12px 0',
              letterSpacing: '-0.5px'
            }}>
              {title}
            </h1>
            <div style={{
              width: '60px',
              height: '4px',
              backgroundColor: accentColor,
              borderRadius: '2px',
              margin: '0 auto'
            }} />
          </div>

          {/* QR Code */}
          <div style={{
            padding: '20px',
            backgroundColor: '#f8f8f8',
            borderRadius: '20px',
            border: `3px solid ${addAlpha(accentColor, 0.2)}`,
            marginBottom: '20px'
          }}>
            <QRCodeSVG
              value={shareUrl}
              size={180}
              level="H"
              includeMargin={false}
              fgColor="#1a1a1a"
              bgColor="#f8f8f8"
            />
          </div>

          {/* Subtitle */}
          <p style={{
            fontSize: '16px',
            color: '#666666',
            margin: '0 0 16px 0',
            fontWeight: '500'
          }}>
            {subtitle}
          </p>

          {/* Reward Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: accentColor,
            borderRadius: '50px',
            boxShadow: `0 4px 12px ${addAlpha(accentColor, 0.4)}`
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12"></polyline>
              <rect x="2" y="7" width="20" height="5"></rect>
              <line x1="12" y1="22" x2="12" y2="7"></line>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
            <span style={{
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {reward}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px',
          textAlign: 'center',
          borderTop: '1px solid #f0f0f0'
        }}>
          <span style={{ color: '#999999', fontSize: '12px' }}>Powered by </span>
          <span style={{ color: accentColor, fontSize: '12px', fontWeight: 'bold' }}>Repeat.la</span>
        </div>
      </div>
    );
  }

  // Minimal Template
  if (template === 'minimal') {
    return (
      <div ref={ref} id={flyerId} style={containerStyle}>
        {/* Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px'
        }}>
          {/* Logo */}
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={title}
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'contain',
                marginBottom: '24px'
              }}
              crossOrigin="anonymous"
            />
          ) : (
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <span style={{
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* QR Code */}
          <div style={{
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)',
            marginBottom: '24px'
          }}>
            <QRCodeSVG
              value={shareUrl}
              size={220}
              level="H"
              includeMargin={false}
              fgColor="#1a1a1a"
              bgColor="#ffffff"
            />
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1a1a1a',
            margin: '0 0 8px 0',
            textAlign: 'center',
            letterSpacing: '-0.5px'
          }}>
            {title}
          </h1>

          {/* Subtitle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: accentColor
            }} />
            <p style={{
              fontSize: '14px',
              color: '#888888',
              margin: 0
            }}>
              {subtitle}
            </p>
            <div style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: accentColor
            }} />
          </div>

          {/* Reward Badge - Highlighted */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 24px',
            backgroundColor: addAlpha(accentColor, 0.1),
            border: `2px solid ${accentColor}`,
            borderRadius: '16px',
            boxShadow: `0 4px 12px ${addAlpha(accentColor, 0.2)}`
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12"></polyline>
              <rect x="2" y="7" width="20" height="5"></rect>
              <line x1="12" y1="22" x2="12" y2="7"></line>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: accentColor
            }}>
              {reward}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px',
          textAlign: 'center'
        }}>
          <span style={{ color: '#cccccc', fontSize: '12px', fontWeight: '500' }}>repeat.la</span>
        </div>
      </div>
    );
  }

  // Promo Template
  if (template === 'promo') {
    return (
      <div ref={ref} id={flyerId} style={containerStyle}>
        {/* Header with reward */}
        <div style={{
          backgroundColor: accentColor,
          padding: '24px 16px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative circle */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.15)'
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '4px'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12"></polyline>
              <rect x="2" y="7" width="20" height="5"></rect>
              <line x1="12" y1="22" x2="12" y2="7"></line>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
            <span style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '11px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Recompensa
            </span>
          </div>
          <p style={{
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: 'bold',
            margin: 0
          }}>
            {reward}
          </p>
        </div>

        {/* Main content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 32px'
        }}>
          {/* Logo and Title row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '28px'
          }}>
            {logoUrl ? (
              <div style={{
                padding: '8px',
                borderRadius: '12px',
                backgroundColor: addAlpha(accentColor, 0.1)
              }}>
                <img
                  src={logoUrl}
                  alt={title}
                  style={{ width: '52px', height: '52px', objectFit: 'contain' }}
                  crossOrigin="anonymous"
                />
              </div>
            ) : (
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                backgroundColor: addAlpha(accentColor, 0.1),
                border: `2px solid ${addAlpha(accentColor, 0.2)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: accentColor
                }}>
                  {title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#1a1a1a',
                margin: '0 0 4px 0',
                letterSpacing: '-0.5px'
              }}>
                {title}
              </h1>
              <p style={{
                fontSize: '13px',
                color: '#999999',
                margin: 0
              }}>
                Club de Fidelidad
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f8f8f8',
            borderRadius: '16px',
            border: `2px dashed ${addAlpha(accentColor, 0.3)}`,
            marginBottom: '24px'
          }}>
            <QRCodeSVG
              value={shareUrl}
              size={160}
              level="H"
              includeMargin={false}
              fgColor="#1a1a1a"
              bgColor="#f8f8f8"
            />
          </div>

          {/* CTA */}
          <div style={{
            width: '100%',
            maxWidth: '260px',
            padding: '16px 24px',
            backgroundColor: accentColor,
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: `0 6px 20px ${addAlpha(accentColor, 0.35)}`
          }}>
            <span style={{
              color: '#ffffff',
              fontSize: '17px',
              fontWeight: 'bold'
            }}>
              {subtitle}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px',
          textAlign: 'center',
          backgroundColor: '#f8f8f8'
        }}>
          <span style={{ color: '#999999', fontSize: '12px' }}>Powered by </span>
          <span style={{ color: accentColor, fontSize: '12px', fontWeight: 'bold' }}>Repeat.la</span>
        </div>
      </div>
    );
  }

  return null;
});

FlyerPreview.displayName = 'FlyerPreview';

export default FlyerPreview;
