import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useRef } from 'react'

function IPhone({ url }) {
  const iframeRef = useRef(null)
  return (
    <div
      style={{
        width: 393,
        height: 852,
        background: '#1a1a1a',
        borderRadius: 54,
        padding: 12,
        boxShadow: '0 0 0 1.5px #3a3a3a, 0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px #2a2a2a',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Side buttons left */}
      <div
        style={{
          position: 'absolute',
          left: -3,
          top: 140,
          width: 3,
          height: 36,
          background: '#2e2e2e',
          borderRadius: '3px 0 0 3px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -3,
          top: 190,
          width: 3,
          height: 64,
          background: '#2e2e2e',
          borderRadius: '3px 0 0 3px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -3,
          top: 268,
          width: 3,
          height: 64,
          background: '#2e2e2e',
          borderRadius: '3px 0 0 3px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -3,
          top: 200,
          width: 3,
          height: 100,
          background: '#2e2e2e',
          borderRadius: '0 3px 3px 0',
        }}
      />
      {/* Screen */}
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000',
          borderRadius: 44,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Status bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 50,
            zIndex: 10,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '14px 28px 0',
            pointerEvents: 'none',
          }}
        >
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui' }}>9:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
              <rect x="0" y="6" width="3" height="6" rx="1" opacity="0.4" />
              <rect x="4.5" y="4" width="3" height="8" rx="1" opacity="0.6" />
              <rect x="9" y="2" width="3" height="10" rx="1" opacity="0.8" />
              <rect x="13.5" y="0" width="3" height="12" rx="1" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
              <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
              <path
                d="M3.5 6.5C4.9 5.1 6.4 4.3 8 4.3s3.1.8 4.5 2.2"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M1 4C3 2 5.4 1 8 1s5 1 7 3"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35" />
              <rect x="2" y="2" width="16" height="8" rx="2" fill="white" />
              <path d="M23 4v4a2 2 0 0 0 0-4z" fill="white" fillOpacity="0.4" />
            </svg>
          </div>
        </div>
        {/* Dynamic Island */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 34,
            background: '#000',
            borderRadius: 20,
            zIndex: 20,
          }}
        />
        {/* iframe */}
        <iframe
          ref={iframeRef}
          src={url}
          style={{ position: 'absolute', top: 50, left: 0, width: '100%', height: 'calc(100% - 50px)', border: 'none' }}
          title="Mobile preview"
        />
        {/* Home indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 134,
            height: 5,
            background: 'rgba(255,255,255,0.35)',
            borderRadius: 3,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}

function Laptop({ url }) {
  return (
    <div style={{ width: 860, flexShrink: 0 }}>
      {/* Browser chrome */}
      <div
        style={{
          background: '#2a2a2a',
          borderRadius: '12px 12px 0 0',
          padding: '10px 14px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: '1.5px solid #3a3a3a',
          borderBottom: 'none',
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div
          style={{
            flex: 1,
            background: '#1a1a1a',
            borderRadius: 6,
            height: 26,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 12,
            gap: 6,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#555' }} />
          <span style={{ color: '#888', fontSize: 11, fontFamily: 'system-ui' }}>repeat.la{url}</span>
        </div>
      </div>
      {/* Screen */}
      <div
        style={{
          background: '#fff',
          border: '1.5px solid #3a3a3a',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          overflow: 'hidden',
          height: 580,
        }}
      >
        <iframe
          src={url}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title="Desktop preview"
        />
      </div>
      {/* Base */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: 180,
            height: 16,
            background: '#2a2a2a',
            borderRadius: '0 0 4px 4px',
            border: '1.5px solid #3a3a3a',
            borderTop: 'none',
          }}
        />
        <div
          style={{
            width: 280,
            height: 8,
            background: '#222',
            borderRadius: '0 0 8px 8px',
            border: '1.5px solid #333',
            borderTop: 'none',
          }}
        />
      </div>
    </div>
  )
}

export default function Preview() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const url = searchParams.get('url') || '/catalog/beauty-demo'

  const phoneScale = Math.min(1, (window.innerHeight - 120) / 852)
  const laptopScale = Math.min(1, (window.innerHeight - 120) / 620)
  const totalWidth = 393 * phoneScale + 860 * laptopScale + 80
  const globalScale = totalWidth > window.innerWidth - 40 ? (window.innerWidth - 40) / totalWidth : 1

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ background: 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 100%)' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
        <button
          onClick={() => navigate('/demo')}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <p className="text-white/30 text-xs truncate max-w-sm">{url}</p>
        <button onClick={() => window.location.reload()} className="text-white/60 hover:text-white transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Frames */}
      <div className="flex-1 flex items-center justify-center">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 48,
            transform: `scale(${globalScale * Math.min(phoneScale, laptopScale)})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Label + iPhone */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                color: 'rgba(255,255,255,0.35)',
                fontSize: 11,
                fontFamily: 'system-ui',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Mobile
            </span>
            <IPhone url={url} />
          </div>

          {/* Label + Laptop */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                color: 'rgba(255,255,255,0.35)',
                fontSize: 11,
                fontFamily: 'system-ui',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Desktop
            </span>
            <Laptop url={url} />
          </div>
        </div>
      </div>
    </div>
  )
}
