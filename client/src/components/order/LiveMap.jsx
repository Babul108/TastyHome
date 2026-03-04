import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

const deliveryIcon = new L.DivIcon({
  html: '<div style="background:#E23744;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:18px;">🛵</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  className: ''
})

const userIcon = new L.DivIcon({
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

const RecenterMap = ({ center }) => {
  const map = useMap()
  useEffect(() => { map.setView(center, map.getZoom()) }, [center])
  return null
}

const LiveMap = ({ deliveryLocation, userLocation, restaurantLocation }) => {
  const defaultCenter = userLocation || restaurantLocation || [19.076, 72.8777]

  const center = deliveryLocation || defaultCenter

  return (
    <div className="h-80 rounded-2xl overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={14}
        className="h-full w-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {deliveryLocation && (
          <Marker position={deliveryLocation} icon={deliveryIcon}>
            <Popup>🛵 Delivery Partner</Popup>
          </Marker>
        )}

        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>🏠 Your Location</Popup>
          </Marker>
        )}

        {restaurantLocation && (
          <Marker position={restaurantLocation} icon={restaurantIcon}>
            <Popup>🍽️ Restaurant</Popup>
          </Marker>
        )}

        {deliveryLocation && <RecenterMap center={deliveryLocation} />}
      </MapContainer>
    </div>
  )
}

export default LiveMap
