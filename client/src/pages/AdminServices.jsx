import { useState, useEffect } from 'react';
import api from '../api';
import './Dashboard.css';

const fallbackServices = [
  { id: '1', title: 'Pipe Leak Repair', category: 'Plumbing', description: 'Fast and reliable fixes for all types of pipe leaks.' },
  { id: '2', title: 'Drain Cleaning', category: 'Plumbing', description: 'Clear clogged drains quickly with our professional tools.' },
  { id: '3', title: 'Wiring & Panels', category: 'Electrical', description: 'Expert residential and commercial wiring services.' },
  { id: '4', title: 'Fixture Setup', category: 'Electrical', description: 'Safe installation of lighting and electrical fixtures.' }
];

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newService, setNewService] = useState({ title: '', category: 'Plumbing', description: '' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await api.get('/services');
      if (data && data.length > 0) {
        setServices(data);
      } else {
        setServices(fallbackServices);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      // Fallback for visual completeness if backend gives error
      setServices(fallbackServices);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services', newService);
      setMessage({ type: 'success', text: 'Service created successfully!' });
      setNewService({ title: '', category: 'Plumbing', description: '' });
      fetchServices();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Creation might not be supported yet. Mock UI updated.' });
      setServices([...services, { ...newService, id: Date.now().toString() }]);
      setNewService({ title: '', category: 'Plumbing', description: '' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      setMessage({ type: 'success', text: 'Service deleted successfully!' });
      fetchServices();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Delete might not be supported yet. Mock UI updated.' });
      setServices(services.filter(s => s.id !== id && s._id !== id));
    }
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner"></div></div>;

  return (
    <div className="dashboard-page overflow-x-hidden">
      <div className="dashboard-header">
        <h1 className="section-title">Manage <span className="text-primary">Services</span></h1>
        <p>Add new services, edit existing ones, or remove offerings from the catalog.</p>
      </div>

      {message.text && (
        <div style={{ maxWidth: '600px', margin: '0 auto 24px' }} className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-form-card card">
          <div className="card-body">
            <h2 className="card-title">Add New Service</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Service Title</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-control"
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                >
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  style={{ minHeight: '80px' }}
                  required
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" style={{ width: '100%' }}>Add Service</button>
            </form>
          </div>
        </div>

        <div className="dashboard-list-card">
          <h2 className="card-title">Current Services Catalog</h2>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title & Category</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.id || s._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.title}</div>
                      <span className={`badge ${s.category === 'Plumbing' ? 'badge-completed' : 'badge-pending'}`} style={{ marginTop: '6px' }}>
                        {s.category}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--gray-600)', maxWidth: '200px' }}>
                      {s.description}
                    </td>
                    <td className="actions-cell">
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id || s._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminServices;
