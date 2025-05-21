import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import MarkerListingItem from './MarkerListingItem';
import ReactDOM from 'react-dom';

function OSMMarkerItem({ item }) {
    const [selectedListing, setSelectedListing] = useState();
    const [marker, setMarker] = useState(null);
    const [container, setContainer] = useState(null);

    useEffect(() => {
        // Create a container for the overlay if it doesn't exist
        if (!container) {
            const div = document.createElement('div');
            setContainer(div);
        }
    }, [container]);

    useEffect(() => {
        if (item.coordinates && !marker && window.leafletMap) {
            const customIcon = L.icon({
                iconUrl: '/pin.png',
                iconSize: [60, 60],
                iconAnchor: [30, 60],
                popupAnchor: [0, -60],
            });

            const newMarker = L.marker([item.coordinates.lat, item.coordinates.lng], {
                icon: customIcon,
            }).addTo(window.leafletMap);

            newMarker.on('click', () => {
                setSelectedListing(item);
            });

            setMarker(newMarker);

            return () => {
                if (marker) {
                    marker.remove();
                }
            };
        }
    }, [item, marker]);

    useEffect(() => {
        if (selectedListing && marker && container) {
            const popup = L.popup({
                closeButton: false,
                autoClose: false,
                className: 'custom-overlay',
            }).setLatLng([selectedListing.coordinates.lat, selectedListing.coordinates.lng]);

            ReactDOM.render(
                <div className="relative">
                    <MarkerListingItem
                        closeHandler={() => {
                            setSelectedListing(null);
                            marker.closePopup();
                        }}
                        item={selectedListing}
                    />
                    <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-4 mt-2">
                        <div className="bg-purple-600 rounded-full p-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="36"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                        </div>
                        <a
                            href="tel:9851331644"
                            className="text-blue-600 font-bold text-lg hover:text-blue-800 mt-2"
                        >
                            9851 331644
                        </a>
                    </div>
                </div>,
                container
            );

            popup.setContent(container);
            marker.bindPopup(popup).openPopup();
        }
    }, [selectedListing, marker, container]);

    return (
        <div>
            <style jsx global>{`
                .custom-overlay {
                    background: transparent;
                    border: none;
                    box-shadow: none;
                }
                .leaflet-popup-content-wrapper {
                    background: transparent;
                    border: none;
                    box-shadow: none;
                }
                .leaflet-popup-content {
                    margin: 0;
                    background: transparent;
                }
                .leaflet-popup-tip-container {
                    display: none;
                }
            `}</style>
        </div>
    );
}

export default OSMMarkerItem;

//site API key fixed again start to run 
