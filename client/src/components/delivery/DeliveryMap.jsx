import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

const deliverIcon = new L.DivIcon({
  html: '<div style="background:#E23744;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:18px;">🛵</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  className: ''
})

const customerIcon = new L.DivIcon({
  html: '<div style="background:#3B82F6;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:16px;">🏠</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: ''
})

const restaurantIcon = new L.DivIcon({
  html: '<div style="background:#FF6B35;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:16px;">🍽️</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: ''
})

const DeliveryMap = ({ restaurantLocation, customerLocation, currentLocation }) => {
  const center = currentLocation || restaurantLocation || [19.076, 72.8777]
  const routePoints = [restaurantLocation, currentLocation, customerLocation].filter(Boolean)

  return (
    <div className="h-64 rounded-2xl overflow-hidden shadow-md">
      <MapContainer center={center} zoom={14} className="h-full w-full" scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {restaurantLocation && (
          <Marker position={restaurantLocation} icon={restaurantIcon}>
            <Popup>🍽️ Restaurant (Pickup)</Popup>
          </Marker>
        )}

        {currentLocation && (
          <Marker position={currentLocation} icon={deliverIcon}>
            <Popup>🛵 Your Location</Popup>
          </Marker>
        )}

        {customerLocation && (
          <Marker position={customerLocation} icon={customerIcon}>
            <Popup>🏠 Customer</Popup>
          </Marker>
        )}

        {routePoints.length >= 2 && (
          <Polyline positions={routePoints} color="#E23744" weight={3} dashArray="6, 6" />
        )}
      </MapContainer>
    </div>
  )
}

export default DeliveryMap
