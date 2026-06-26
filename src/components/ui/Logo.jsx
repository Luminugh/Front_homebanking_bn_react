export default function Logo({
  size = 44,
  wordmark = true,
  variant = 'dark',
  subtitle = 'BANCA POR INTERNET',
}) {
  const textColor = variant === 'light' ? '#ffffff' : '#1f2937'
  const subColor = variant === 'light' ? 'rgba(255,255,255,.85)' : '#6b7280'
  const nameSize = Math.round(size * 0.5)
  const subSize = Math.max(9, Math.round(size * 0.23))

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <img
        src="/image/logoBN.png"
        alt="Banco de la Nación"
        width={size}
        height={Math.round(size * 0.45)}
        style={{ display: 'block', width: size, height: 'auto' }}
      />

      {wordmark && (
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.04 }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: nameSize,
              color: textColor,
              letterSpacing: '-0.5px',
            }}
          >
            Banco de la Nación
          </span>
          {subtitle && (
            <span
              style={{
                fontSize: subSize,
                fontWeight: 700,
                color: subColor,
                letterSpacing: '1.2px',
              }}
            >
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  )
}
