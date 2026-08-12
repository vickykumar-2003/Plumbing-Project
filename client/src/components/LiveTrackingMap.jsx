import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically update map view to fit bounds
const UpdateMapBounds = ({ techLat, techLng, custLat, custLng, fallbackLat, fallbackLng }) => {
    const map = useMap();
    useEffect(() => {
        if (techLat && techLng && custLat && custLng) {
            const bounds = L.latLngBounds(
                [techLat, techLng],
                [custLat, custLng]
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (techLat && techLng) {
            map.setView([techLat, techLng], 14);
        } else if (custLat && custLng) {
            map.setView([custLat, custLng], 14);
        } else if (fallbackLat && fallbackLng) {
            map.setView([fallbackLat, fallbackLng], 14);
        }
    }, [techLat, techLng, custLat, custLng, fallbackLat, fallbackLng, map]);
    return null;
};

const LiveTrackingMap = ({ techLoc, customerLoc }) => {
    const defaultCenter = [24.6677, 83.9181]; // Fallback center (Banjari)
    const center = techLoc ? [techLoc.lat, techLoc.lng] : defaultCenter;

    // Custom DivIcons for an Uber/Swiggy like feel
    const techIcon = new L.divIcon({
        className: 'custom-tech-marker',
        html: `<div style="background: black; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">🛵</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });

    const homeIcon = new L.divIcon({
        className: 'custom-home-marker',
        html: `<div style="background: white; color: black; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid #333; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">🏠</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });

    // Coordinates for the dashed line
    const linePositions = [];
    if (techLoc && customerLoc) {
        linePositions.push([techLoc.lat, techLoc.lng]);
        linePositions.push([customerLoc.lat, customerLoc.lng]);
    }

    return (
        <div style={{ height: '300px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ddd', position: 'relative' }}>
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                {techLoc && (
                    <Marker position={[techLoc.lat, techLoc.lng]} icon={techIcon}>
                        <Popup>
                            <strong>Technician On The Way</strong><br />
                            Live 🟢
                        </Popup>
                    </Marker>
                )}

                {customerLoc ? (
                    <Marker position={[customerLoc.lat, customerLoc.lng]} icon={homeIcon}>
                        <Popup>
                            <strong>Service Location</strong>
                        </Popup>
                    </Marker>
                ) : !techLoc ? (
                    // Fallback marker if BOTH techLoc and customerLoc are missing
                    <Marker position={defaultCenter} icon={homeIcon}>
                        <Popup>
                            <strong>Expected Service Region</strong><br />
                            Will update when technician gets online.
                        </Popup>
                    </Marker>
                ) : null}

                {/* The Dashed Connecting Line */}
                {linePositions.length === 2 && (
                    <Polyline
                        positions={linePositions}
                        pathOptions={{ color: '#333', dashArray: '10, 10', weight: 4, opacity: 0.7 }}
                    />
                )}

                <UpdateMapBounds
                    techLat={techLoc?.lat}
                    techLng={techLoc?.lng}
                    custLat={customerLoc?.lat}
                    custLng={customerLoc?.lng}
                    fallbackLat={defaultCenter[0]}
                    fallbackLng={defaultCenter[1]}
                />
            </MapContainer>
        </div>
    );
};

export default LiveTrackingMap;
