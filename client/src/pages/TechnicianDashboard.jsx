import { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const TechnicianDashboard = () => {
    const { user, socket } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trackingJobId, setTrackingJobId] = useState(null);
    const [statusText, setStatusText] = useState('🔴 Disconnected');

    // GPS State
    const [coords, setCoords] = useState(null);
    const watchIdRef = useRef(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    // Real-time: auto-refresh when new booking comes or booking is updated
    useEffect(() => {
        if (socket) {
            socket.on('new-booking', () => fetchJobs());
            socket.on('booking-update', () => fetchJobs());
        }
        return () => {
            if (socket) {
                socket.off('new-booking');
                socket.off('booking-update');
            }
        };
    }, [socket]);

    const fetchJobs = async () => {
        try {
            // Need a backend endpoint for this or we just use admin bookings filtered
            // For now, let's assume /bookings returns all if admin, or we need a new route.
            // Wait, their backend currently filters by tech id implicitly if accessed by tech? 
            // Let's use the explicit route or standard GET /bookings
            const { data } = await api.get('/bookings/technician/my-jobs');
            setJobs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const startTracking = (job) => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setStatusText('🟡 Connecting...');
        setTrackingJobId(job._id);

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ latitude, longitude });
                setStatusText('🟢 Live Tracking');

                if (socket) {
                    socket.emit('technician:location:update', {
                        technicianId: user.id || user._id,
                        bookingId: job._id,
                        customerId: job.userId?._id || job.userId,
                        latitude,
                        longitude,
                        timestamp: new Date()
                    });
                }
            },
            (err) => {
                console.error("Location error:", err);
                setStatusText('🔴 Tracking Failed - Check Permissions');
            },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
    };

    const stopTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setTrackingJobId(null);
        setCoords(null);
        setStatusText('🔴 Disconnected');
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>👨‍🔧 Technician Portal</h2>

            <div style={{ background: '#111', color: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>📍 Live Location Status</h3>
                    <p style={{ color: '#aaa', fontSize: '14px', marginTop: '5px' }}>{statusText}</p>
                    {coords && (
                        <p style={{ fontSize: '12px', marginTop: '10px', color: 'var(--primary)' }}>
                            Lat: {coords.latitude.toFixed(6)} | Lng: {coords.longitude.toFixed(6)}
                        </p>
                    )}
                </div>
                {trackingJobId && (
                    <button onClick={stopTracking} style={{ background: 'var(--danger)', color: '#fff', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                        Stop Live Location
                    </button>
                )}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>Active Assignments</h3>

            {jobs.length === 0 ? <p>No active jobs assigned to you at the moment.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {jobs.map(job => (
                        <div key={job._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '12px', background: trackingJobId === job._id ? '#fff8f5' : '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <strong>Booking #{job._id.slice(-6)}</strong>
                                <span className={`badge badge-${job.status.replace(/\s+/g, '-').toLowerCase()}`}>{job.status}</span>
                            </div>
                            <p style={{ margin: '0', fontSize: '14px' }}><strong>Client:</strong> {job.name} ({job.phone})</p>
                            <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Address:</strong> {job.address}</p>
                            <p style={{ margin: '0', fontSize: '14px' }}><strong>Service:</strong> {job.serviceType}</p>

                            <div style={{ marginTop: '15px' }}>
                                {trackingJobId === job._id ? (
                                    <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '14px' }}>Broadcast active to customer 🟢</span>
                                ) : (
                                    <button
                                        onClick={() => startTracking(job)}
                                        disabled={trackingJobId !== null}
                                        style={{ background: trackingJobId ? '#ccc' : 'var(--primary)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: trackingJobId ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                                    >
                                        Start Live Location
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TechnicianDashboard;
