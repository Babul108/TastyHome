import React, { useEffect, useRef } from 'react'

// Simple QR code display using a canvas-based approach
// Falls back to a placeholder if QR generation is not available

const QRCodeDisplay = ({ value, size = 160, label }) => {
  // We use a public QR code API for rendering
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&color=E23744&bgcolor=FFFFFF&margin=10`

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="p-3 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
        <img
          src={apiUrl}
          alt="QR Code"
          width={size}
          height={size}
          className="rounded-lg"
          onError={(e) => {
            // Fallback to a placeholder
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        <div
          style={{ display: 'none', width: size, height: size }}
          className="items-center justify-center bg-gray-100 rounded-lg flex-col gap-2"
        >
          <span className="text-4xl">📱</span>
          <p className="text-xs text-gray-400 text-center">Scan QR Code</p>
        </div>
      </div>
      {label && <p className="text-xs text-gray-500 text-center">{label}</p>}
      {!label && <p className="text-xs text-gray-500">Scan with any UPI app</p>}
    </div>
  )
}

export default QRCodeDisplay
