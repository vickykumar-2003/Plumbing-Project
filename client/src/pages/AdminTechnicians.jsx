import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import LiveTrackingMap from '../components/LiveTrackingMap';

const AdminTechnicians = () => {
    const { socket } = useAuth();
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [liveTechs, setLiveTechs] = useState({});

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        skills: ''
    });

    useEffect(() => {
        fetchTechnicians();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('technician:location:update', (data) => {
                setLiveTechs(prev => ({
                    ...prev,
                    [data.technicianId]: {
                        lat: data.lat,
                        lng: data.lng,
                        bookingId: data.bookingId,
                        customerName: data.customerName,
                        updatedAt: data.updatedAt
                    }
                }));
            });
        }
        return () => {
            if (socket) socket.off('technician:location:update');
        };
    }, [socket]);

    const fetchTechnicians = async () => {
        try {
            const { data } = await api.get('/technicians');
            setTechnicians(data);
        } catch (err) {
            console.error('Failed to fetch technicians', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim());
            await api.post('/technicians', { ...formData, skills: skillsArray });
            setMessage({ type: 'success', text: 'Technician added successfully!' });
            setFormData({ name: '', email: '', password: '', phone: '', skills: '' });
            fetchTechnicians();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add technician.' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this technician profile?')) return;
        try {
            await api.delete(`/technicians/${id}`);
            setMessage({ type: 'success', text: 'Deleted successfully' });
            fetchTechnicians();
        } catch (err) {
            setMessage({ type: 'error', text: 'Delete failed.' });
        }
    };

    const handleToggleAvailability = async (id, currentStatus) => {
        try {
            await api.put(`/technicians/${id}`, { isAvailable: !currentStatus });
            fetchTechnicians();
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update availability.' });
        }
    };

    if (loading) return <div className="spinner-wrapper"><div className="spinner"></div></div>;

    const activeTechIds = Object.keys(liveTechs);

    return (
        <div className="dashboard-page overflow-x-hidden">
            <div className="dashboard-header">
                <h1 className="section-title">Technician <span className="text-primary">Management & Tracking</span></h1>
                <p>Register, update and monitor your service fleet in real-time.</p>
            </div>

            {message.text && (
                <div style={{ maxWidth: '800px', margin: '0 auto 24px' }} className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* LIVE TRACKING MAP SECTION */}
            {activeTechIds.length > 0 && (
                <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
                    <h3 style={{ marginBottom: '15px', color: '#111', fontWeight: 'bold' }}>📍 Active Technician Tracking</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                        {activeTechIds.map(techId => {
                            const techInfo = technicians.find(t => t._id === techId);
                            const liveData = liveTechs[techId];
                            return (
                                <div key={techId} onClick={() => { }} style={{ cursor: 'pointer', background: '#f5f7fa', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--primary)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                                    <div><strong>Technician:</strong> <br />{techInfo?.name || 'Unknown Tech'}</div>
                                    <div><strong>Booking ID:</strong> <br />{liveData.bookingId?.slice(-6) || 'N/A'}</div>
                                    <div><strong>Customer:</strong> <br />{liveData.customerName || 'N/A'}</div>
                                    <div><strong>Status:</strong> <br /><span style={{ color: 'var(--success)' }}>🟢 LIVE</span></div>
                                    <div><strong>Updated:</strong> <br />{new Date(liveData.updatedAt).toLocaleTimeString()}</div>
                                </div>
                            )
                        })}
                    </div>
                    {/* Note: In a real multi-marker scenario, a single map with all tech markers is better. 
                        For now we'll just display the first active tech's map to prevent map collision clutter */}
                    <LiveTrackingMap techLoc={liveTechs[activeTechIds[0]]} customerLoc={null} />
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                {/* ADD TECH FORM */}
                <div className="card" style={{ padding: '20px' }}>
                    <h3 style={{ marginBottom: '15px', color: '#333' }}>Register Technician</h3>
                    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" />
                        <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" />
                        <input required type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="form-input" />
                        <input required type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input" />
                        <input required type="text" placeholder="Skills (comma separated)" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} className="form-input" />
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Add Technician</button>
                    </form>
                </div>

                {/* TECH LIST */}
                <div className="card" style={{ padding: '20px', overflowX: 'auto' }}>
                    <h3 style={{ marginBottom: '15px', color: '#333' }}>Active Fleet</h3>
                    {technicians.length === 0 ? <p>No technicians enlisted.</p> : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Info</th>
                                    <th>Skills</th>
                                    <th>Performance</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {technicians.map(tech => (
                                    <tr key={tech._id}>
                                        <td>
                                            <div style={{ fontWeight: 'bold' }}>
                                                {tech.name}
                                                {liveTechs[tech._id] && <span style={{ marginLeft: '10px', fontSize: '10px', background: 'var(--success)', color: '#fff', padding: '2px 6px', borderRadius: '10px' }}>LIVE</span>}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>{tech.phone}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>{tech.email}</div>
                                        </td>
                                        <td style={{ fontSize: '13px' }}>{tech.skills?.join(', ') || 'General'}</td>
                                        <td>
                                            <div>⭐️ {tech.rating}</div>
                                            <div style={{ fontSize: '12px' }}>{tech.completedJobs} Jobs Done</div>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleToggleAvailability(tech._id, tech.isAvailable)}
                                                style={{ background: tech.isAvailable ? '#e8f5e9' : '#ffebee', color: tech.isAvailable ? '#2e7d32' : '#c62828', padding: '4px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                                            >
                                                {tech.isAvailable ? 'AVAILABLE' : 'BUSY / OFF'}
                                            </button>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(tech._id)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminTechnicians;
