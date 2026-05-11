import { motion } from 'framer-motion'

export default function DashboardHintMoonCafe() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe
          src="/dashboard/mooncafe-demo"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          title="Dashboard"
        />

        {/* Arrow pointing to the Miembros button in the bottom nav */}
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            left: '35%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            pointerEvents: 'none',
          }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
          >
            <span
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: '#1c1c1e',
                background: 'rgba(255,255,255,0.97)',
                padding: '10px 20px',
                borderRadius: 12,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                border: '2.5px solid #eab308',
              }}
            >
              Ver miembros
            </span>
            <span style={{ fontSize: 42, lineHeight: 1, color: '#eab308' }}>↓</span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
