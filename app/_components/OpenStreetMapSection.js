import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createCustomIcon = (phoneNumber) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="color: blue; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 60px; height: 80px; position: relative;">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="40" height="40" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" stroke-width="2" 
          stroke-linecap="round" stroke-linejoin="round" 
          style="color: blue; position: absolute; top: 0; left: 50%; transform: translateX(-50%);">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <div 
          style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          background-color: #4CAF50; border-radius: 50%; width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center; cursor: pointer;"
          onclick="window.location.href = 'tel:${phoneNumber}'"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 24 24" fill="none" 
            stroke="white" stroke-width="2" stroke-linecap="round" 
            stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [60, 80],
    iconAnchor: [30, 80],
  });
};

function OpenStreetMapSection({ coordinates, listing }) {
  const [map, setMap] = useState(null);
  const [dragEnabled, setDragEnabled] = useState(false);

  const containerStyle = {
    width: '100%',
     // Subtract header height
    borderRadius: 1,
  };

  const enableDragOnDoubleClick = (mapInstance) => {
    mapInstance.doubleClickZoom.disable();
    mapInstance.on('dblclick', () => {
      if (!dragEnabled) {
        mapInstance.dragging.enable();
        setDragEnabled(true);
      }
    });
  };

  const showSingleTouchMessage = (mapInstance) => {
    const dragMessage = L.DomUtil.create('div', 'map-drag-message');
    dragMessage.textContent = 'Use + -- button to zoom, 2 fingers / double-click to move the map,Find Property in the Map.';

    Object.assign(dragMessage.style, {
      position: 'absolute',
      top: '0px',
      left: '3.1rem',
      backgroundColor: 'darkBlue',
      color: '#F3F4F6',
      padding: '5px 5px',
      borderRadius: '5px',
      fontSize: '15px',
      zIndex: 1000,
      lineHeight: "1.5rem",
      whiteSpace: 'normal',
      fontWeight: "bold",
      width: '16rem',
      display: 'block',
    });

    const zoomControlContainer = mapInstance.getContainer().querySelector('.leaflet-control-zoom');
    if (zoomControlContainer) {
      zoomControlContainer.appendChild(dragMessage);

      const zoomButtons = zoomControlContainer.querySelectorAll('a');
      zoomButtons.forEach((button) => {
        Object.assign(button.style, {
          width: '50px',
          height: '60px',
          fontSize: '49px',
          lineHeight: '60px',
          left: "1px",
          top: "-1rem",
        });
      });
    }

    mapInstance.on('touchstart', (e) => {
      if (e.touches.length === 1) {
        dragMessage.style.display = 'block';
        mapInstance.dragging.disable();
      } else if (e.touches.length === 2) {
        dragMessage.style.display = 'none';
        mapInstance.dragging.enable();
      }
    });

    mapInstance.on('touchend', () => {
      mapInstance.dragging.disable();
    });
  };

  useEffect(() => {
    // Initialize map
    const mapInstance = L.map('map', {
      center: [27.6931, 85.2807], // Default center
      zoom: 12,
      dragging: false,
      doubleClickZoom: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '©Contribute to OpenStreetMap, ',
    }).addTo(mapInstance);

    enableDragOnDoubleClick(mapInstance);
    showSingleTouchMessage(mapInstance);
    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Handle coordinates and listing updates
  useEffect(() => {
    if (!map || !listing || listing.length === 0) return;

    const markers = [];
    const coordinatePoints = [];

    listing.forEach((item) => {
      if (item.coordinates && item.coordinates.lat && item.coordinates.lng) {
        const { lat, lng } = item.coordinates;
        coordinatePoints.push([lat, lng]);
        
        // Add marker
        const marker = L.marker([lat, lng], {
          icon: createCustomIcon(item.phoneNumber || '+9779851331644'),
        }).addTo(map);

        marker.bindPopup(`
          <div>
            <h3>${item.title || 'Location'}</h3>
            <p>${item.address || 'No address provided'}</p>
            <div 
              style="background-color: #4CAF50; padding: 5px 10px; color: white; border-radius: 5px; text-align: center; cursor: pointer;"
              onclick="window.location.href = 'tel:${item.phoneNumber || '+9779851331644'}'">
              Call: ${item.phoneNumber || '+9779851331644'}
            </div>
          </div>
        `);

        markers.push(marker);
      }
    });

    // If we have coordinates, center the map
    if (coordinatePoints.length > 0) {
      if (coordinatePoints.length === 1) {
        // For single point, just center on it
        map.setView(coordinatePoints[0], 12);
      } else {
        // For multiple points, fit bounds
        const bounds = L.latLngBounds(coordinatePoints);
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 12
        });
      }
    }

    // Cleanup function to remove markers
    return () => {
      markers.forEach(marker => map.removeLayer(marker));
    };
  }, [map, listing]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-center text-white bg-blue-950 text-xl md:text-2xl p-2">
        Locate Property on Map & Call Directly
      </h3>
      <div className="flex-1 overflow-hidden relative" id="map" style={{
        width: '100%',
        height: 'calc(100% - 48px)', // Subtract header height
        borderRadius: '1px'
      }}></div>
    </div>
  );
}

export default OpenStreetMapSection;