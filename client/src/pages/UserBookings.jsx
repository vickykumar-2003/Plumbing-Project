import { useState, useEffect } from 'react';
import api from '../api';
import './Dashboard.css';
import { useAuth } from '../context/AuthContext';
import LiveTrackingMap from '../components/LiveTrackingMap';

// Haversine formula for distance (in km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (
    lat1 == null ||
    lon1 == null ||
    lat2 == null ||
    lon2 == null
  ) {
    return null;
  }

  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return (R * c).toFixed(1);
};

const UserBookings = () => {
  const { socket, socketStatus, user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Technician location
  const [techLocations, setTechLocations] = useState({});
  const [customerLocation, setCustomerLocation] = useState(null);

  // Review states
  const [showReview, setShowReview] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // =====================================================
  // FETCH BOOKINGS
  // =====================================================

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');

      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD + CUSTOMER LOCATION
  // =====================================================

  useEffect(() => {
    fetchBookings();

    // Get customer's location once
    // for distance calculation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCustomerLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => {
          console.log(
            'Customer location denied temporarily.',
            err
          );
        }
      );
    }
  }, []);

  // =====================================================
  // SOCKET.IO
  // =====================================================

  useEffect(() => {
    if (!socket) return;

    // Technician location update
    const handleTechnicianLocation = (data) => {
      setTechLocations((prev) => ({
        ...prev,
        [data.technicianId]: {
          lat: data.lat,
          lng: data.lng,
          updatedAt: data.updatedAt
        }
      }));
    };

    // Booking status update
    const handleBookingUpdate = () => {
      fetchBookings();
    };

    socket.on(
      'technician:location:update',
      handleTechnicianLocation
    );

    socket.on(
      'booking-update',
      handleBookingUpdate
    );

    return () => {
      socket.off(
        'technician:location:update',
        handleTechnicianLocation
      );

      socket.off(
        'booking-update',
        handleBookingUpdate
      );
    };
  }, [socket]);

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================


  const submitReview = async () => {
  try {
    if (!selectedBooking) {
      alert("Booking not selected");
      return;
    }

    const bookingId =
      selectedBooking._id ||
      selectedBooking.id ||
      selectedBooking.bookingId;

    if (!bookingId) {
      console.log("Selected Booking:", selectedBooking);
      alert("Booking ID not found");
      return;
    }

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      alert("Please write your feedback");
      return;
    }

    const { data } = await api.post("/reviews", {
      bookingId: bookingId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    alert(data.message || "Review submitted successfully!");

    setShowReview(false);
    setSelectedBooking(null);
    setRating(0);
    setComment("");

    fetchBookings();

  } catch (error) {
    console.error("Review submission error:", error);

    alert(
      error.response?.data?.message ||
      "Failed to submit review"
    );
  }
};

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="dashboard-page overflow-x-hidden">

      {/* HEADER */}
      <div className="dashboard-header">

        <h1 className="section-title">
          My{" "}
          <span className="text-primary">
            Bookings
          </span>{" "}
          & Tracking
        </h1>

        <p>
          Review your booking history and track
          active technicians in real-time.
        </p>

      </div>


      {/* BOOKING LIST */}
      <div
        className="dashboard-list-card"
        style={{
          width: '100%',
          maxWidth: '1000px'
        }}
      >

        <h2 className="card-title">
          Booking History
        </h2>

        {bookings.length === 0 ? (

          <div className="empty-state card">

            <div className="empty-icon">
              📝
            </div>

            <p>
              You haven't booked any services yet.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Service Details</th>
                  <th>Booking Date</th>
                  <th>Status & Tracking</th>
                </tr>

              </thead>


              <tbody>

                {bookings.map((booking) => {

                  // Technician ID
                  const techId =
                    booking.technicianId?._id ||
                    booking.technicianId;

                  // Technician location
                  const techLoc =
                    techId
                      ? techLocations[techId]
                      : null;

                  // Tracking active?
                  const isTrackingActive =
                    [
                      'CONFIRMED',
                      'ASSIGNED',
                      'ON THE WAY',
                      'WORK IN PROGRESS'
                    ].includes(
                      booking.status?.toUpperCase()
                    ) ||
                    techLoc !== null;

                  // Distance
                  let distance = null;

                  if (
                    techLoc &&
                    customerLocation
                  ) {
                    distance =
                      calculateDistance(
                        customerLocation.lat,
                        customerLocation.lng,
                        techLoc.lat,
                        techLoc.lng
                      );
                  }

                  return (

                    <tr key={booking._id}>

                      {/* =================================
                          SERVICE DETAILS
                      ================================= */}

                      <td>

                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '1.05rem',
                            color: 'var(--gray-900)'
                          }}
                        >
                          {booking.serviceType}
                        </div>

                        <div
                          style={{
                            fontSize: '0.85rem',
                            color: 'var(--gray-600)',
                            marginTop: '4px'
                          }}
                        >
                          {booking.address}
                        </div>

                        {booking.message && (

                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'var(--gray-500)',
                              marginTop: '4px',
                              fontStyle: 'italic'
                            }}
                          >
                            "{booking.message}"
                          </div>

                        )}

                      </td>


                      {/* =================================
                          BOOKING DATE
                      ================================= */}

                      <td
                        style={{
                          verticalAlign: 'top'
                        }}
                      >
                        {new Date(
                          booking.createdAt
                        ).toLocaleString()}
                      </td>


                      {/* =================================
                          STATUS + TRACKING
                      ================================= */}

                      <td
                        style={{
                          verticalAlign: 'top'
                        }}
                      >

                        {/* STATUS */}
                        <span
                          className={`badge badge-${booking.status
                            .replace(/\s+/g, '-')
                            .toLowerCase()}`}
                        >
                          {booking.status}
                        </span>


                        {/* =================================
                            REVIEW BUTTON
                        ================================= */}

                        {booking.status === "Completed" && (

                          <div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBooking(
                                  booking
                                );

                                setRating(0);
                                setComment("");
                                setShowReview(true);
                              }}
                              style={{
                                marginTop: "12px",
                                padding: "8px 15px",
                                border: "none",
                                borderRadius: "8px",
                                background: "#f59e0b",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "600"
                              }}
                            >
                              ⭐ Give Review
                            </button>

                          </div>

                        )}


                        {/* =================================
                            LIVE TRACKING
                        ================================= */}

                        {isTrackingActive && (

                          <div
                            style={{
                              marginTop: '15px',
                              borderRadius: '12px',
                              overflow: 'hidden',
                              border: '1px solid #e0e0e0',
                              background: '#fff',
                              boxShadow:
                                '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                          >

                            {/* LIVE HEADER */}

                            {techLoc ? (

                              <div
                                style={{
                                  background: '#28872b',
                                  color: 'white',
                                  padding: '12px 15px',
                                  textAlign: 'center',
                                  fontWeight: 'bold',
                                  fontSize: '18px'
                                }}
                              >
                                🚚 Technician On The Way
                                <br />

                                <span
                                  style={{
                                    fontSize: '12px'
                                  }}
                                >
                                  ETA: Calculating...
                                </span>

                              </div>

                            ) : (

                              <div
                                style={{
                                  background: '#f5f7fa',
                                  color: '#333',
                                  padding: '12px 15px',
                                  textAlign: 'center',
                                  fontWeight: '600',
                                  fontSize: '15px',
                                  borderBottom:
                                    '1px solid #e0e0e0'
                                }}
                              >
                                🕒 Waiting for Technician
                                Location...
                              </div>

                            )}


                            {/* TECHNICIAN DETAILS */}

                            {techLoc && (

                              <div
                                style={{
                                  padding: '15px',
                                  background: '#fafafa',
                                  borderBottom:
                                    '1px solid #eee'
                                }}
                              >

                                <p
                                  style={{
                                    margin: '0 0 5px'
                                  }}
                                >
                                  <strong>
                                    Technician:
                                  </strong>{" "}
                                  {booking
                                    .technicianId?.name ||
                                    'Assigned Technician'}
                                </p>


                                <p
                                  style={{
                                    margin: '0 0 5px'
                                  }}
                                >
                                  <strong>
                                    Status:
                                  </strong>{" "}
                                  {socketStatus ===
                                  'Connected'
                                    ? '🟢 LIVE (Connected)'
                                    : `🔴 ${socketStatus}`}
                                </p>


                                {distance && (

                                  <p
                                    style={{
                                      margin: '0 0 5px'
                                    }}
                                  >
                                    <strong>
                                      Distance:
                                    </strong>{" "}
                                    {distance} km away
                                  </p>

                                )}


                                <p
                                  style={{
                                    margin: '0',
                                    fontSize: '12px',
                                    color: '#666'
                                  }}
                                >
                                  <strong>
                                    Last Updated:
                                  </strong>{" "}
                                  {new Date(
                                    techLoc.updatedAt
                                  ).toLocaleTimeString()}
                                </p>

                              </div>

                            )}


                            {/* MAP */}

                            <div
                              style={{
                                position: 'relative'
                              }}
                            >

                              <LiveTrackingMap
                                techLoc={techLoc}
                                customerLoc={
                                  customerLocation
                                }
                              />

                            </div>

                          </div>

                        )}

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =================================================
          REVIEW MODAL
      ================================================= */}

      {showReview && (

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
            boxSizing: "border-box"
          }}
        >

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "15px",
              width: "90%",
              maxWidth: "450px",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.2)"
            }}
          >

            {/* TITLE */}

            <h2
              style={{
                marginBottom: "10px"
              }}
            >
              Rate Your Technician
            </h2>

            <p
              style={{
                color: "#666"
              }}
            >
              How was your service?
            </p>


            {/* TECHNICIAN NAME */}

            {selectedBooking?.technicianId && (

              <p
                style={{
                  marginTop: "12px",
                  marginBottom: "10px"
                }}
              >
                <strong>
                  Technician:
                </strong>{" "}
                {selectedBooking
                  .technicianId
                  ?.name ||
                  "Assigned Technician"}
              </p>

            )}


            {/* STAR RATING */}

            {/* ⭐ STAR RATING */}

<div style={{ margin: "15px 0" }}>

  {[1, 2, 3, 4, 5].map((star) => (
    <button
      key={star}
      type="button"
      onClick={() => setRating(star)}
      style={{
        background: "none",
        border: "none",
        padding: "0 4px",
        fontSize: "32px",
        cursor: "pointer",
        color: star <= rating ? "#f59e0b" : "#222",
        transition: "0.2s",
      }}
    >
      ★
    </button>
  ))}

  <div
    style={{
      marginTop: "5px",
      fontWeight: "600",
      color: "#555",
    }}
  >
    {rating === 0
      ? "Select your rating"
      : `${rating}/5`}
  </div>

</div>


            {/* FEEDBACK */}

            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "8px"
              }}
            >
              Your Feedback
            </label>

            <textarea
              placeholder="Write your feedback..."
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              rows="5"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                resize: "none",
                boxSizing: "border-box",
                fontSize: "14px"
              }}
            />


            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px"
              }}
            >

              {/* SUBMIT */}

              <button
                type="button"
                onClick={submitReview}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#28872b",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Submit Review
              </button>


              {/* CANCEL */}

              <button
                type="button"
                onClick={() => {
                  setShowReview(false);
                  setSelectedBooking(null);
                  setRating(5);
                  setComment("");
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#ddd",
                  color: "#333",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default UserBookings;