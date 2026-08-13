import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Emergency = () => {
    const [formData, setFormData] = useState({
        emergencyType: 'Major Water Leakage',
        description: '',
        address: '',
        contactPhone: '',
        priority: 'HIGH'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const emergencyTypes = [
        'Major Water Leakage',
        'Burst Pipe',
        'No Water Supply',
        'Drainage Emergency',
        'Gas/Water Related Urgent Issue',
        'Other'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await api.post('/emergency', formData);
            setMessage('🚨 Emergency Dispatch requested! A technician is being assigned right now.');
            setTimeout(() => navigate('/dashboard/bookings'), 3000);
        } catch (error) {
            setMessage('Error occurred while requesting emergency service. Try calling support.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', width: '100%', margin: '40px auto', padding: '20px', background: '#ffebee', borderRadius: '8px', border: '2px solid #ef5350', boxSizing: 'border-box' }}>
            <h2 style={{ color: '#c62828', textAlign: 'center', fontWeight: 'bold' }}>🚨 EMERGENCY SERVICE REQUEST</h2>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#b71c1c' }}>
                For urgent issues requiring immediate response. Our fastest technician will be dispatched!
            </p>

            {message && <div style={{ padding: '12px', background: '#fff', color: '#c62828', borderRadius: '4px', marginBottom: '16px', fontWeight: 'bold', textAlign: 'center' }}>{message}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ fontWeight: 'bold' }}>Emergency Type</label>
                    <select
                        value={formData.emergencyType}
                        onChange={e => setFormData({ ...formData, emergencyType: e.target.value })}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    >
                        {emergencyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ fontWeight: 'bold' }}>Urgent Description</label>
                    <textarea
                        required
                        rows="3"
                        placeholder="Describe the issue urgently..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    ></textarea>
                </div>

                <div>
                    <label style={{ fontWeight: 'bold' }}>Current Location Address</label>
                    <input
                        required
                        type="text"
                        placeholder="Enter exact address"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>

                <div>
                    <label style={{ fontWeight: 'bold' }}>Contact Phone</label>
                    <input
                        required
                        type="tel"
                        placeholder="Mobile number for tech to call"
                        value={formData.contactPhone}
                        onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '14px', background: '#d32f2f', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '4px', fontSize: '18px', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? 'Dispatching...' : '🚨 DISPATCH TECHNICIAN NOW'}
                </button>
            </form>
        </div>
    );
};

export default Emergency;
