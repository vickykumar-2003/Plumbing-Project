import { Link } from 'react-router-dom';
import './ServiceCard.css';

const ServiceCard = ({ service }) => {
  const { icon, title, category, description, image } = service;

  return (
    <div className="service-card">
      <div className="service-image-header">
        <img src={image} alt={title} className="service-image" />
        <div className={`service-category-badge ${category === 'Plumbing' ? 'plumbing' : 'electrical'}`}>
          <span className="service-icon">{icon}</span>
          <span className="service-category">{category}</span>
        </div>
      </div>
      <div className="service-card-body">
        <h3 className="service-title">{title}</h3>
        <p className="service-desc">{description}</p>
        <div className="service-footer">
          <Link to="/signup" className="btn btn-primary btn-sm">Book Now</Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
