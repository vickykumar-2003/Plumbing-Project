import { useState, useEffect, useRef } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const TechnicianDashboard = () => {
    const { user, socket, socketStatus } = useAuth();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingJobId, setUpdatingJobId] = useState(null);

    const [trackingJobId, setTrackingJobId] = useState(null);
    const [gpsStatus, setGpsStatus] = useState("🔴 GPS Stopped");

    const [coords, setCoords] = useState(null);
    const watchIdRef = useRef(null);

    // --------------------------------------------------
    // FETCH TECHNICIAN JOBS
    // --------------------------------------------------

    useEffect(() => {
        fetchJobs();
    }, []);

    // --------------------------------------------------
    // REAL-TIME BOOKING UPDATES
    // --------------------------------------------------

    useEffect(() => {
        if (!socket) return;

        const handleNewBooking = () => {
            fetchJobs();
        };

        const handleBookingUpdate = () => {
            fetchJobs();
        };

        socket.on("new-booking", handleNewBooking);
        socket.on("booking-update", handleBookingUpdate);

        return () => {
            socket.off("new-booking", handleNewBooking);
            socket.off("booking-update", handleBookingUpdate);
        };
    }, [socket]);

    // --------------------------------------------------
    // FETCH JOBS
    // --------------------------------------------------

    const fetchJobs = async () => {
        try {
            const { data } = await api.get(
                "/bookings/technician/my-jobs"
            );

            setJobs(data);
        } catch (err) {
            console.error("Fetch technician jobs error:", err);
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------------------------
    // UPDATE JOB STATUS
    // --------------------------------------------------

    const updateJobStatus = async (job, newStatus) => {
        try {
            setUpdatingJobId(job._id);

            const { data } = await api.put(
                `/bookings/${job._id}/status`,
                {
                    status: newStatus,
                }
            );

            // Update job immediately in UI
            setJobs((previousJobs) =>
                previousJobs.map((item) =>
                    item._id === job._id
                        ? {
                              ...item,
                              status: data.booking.status,
                          }
                        : item
                )
            );

            // If completed, stop live tracking
            if (newStatus === "Completed") {
                if (trackingJobId === job._id) {
                    stopTracking();
                }
            }

            alert(`Job status updated to "${newStatus}"`);
        } catch (error) {
            console.error("Status update error:", error);

            alert(
                error.response?.data?.message ||
                    "Unable to update job status"
            );
        } finally {
            setUpdatingJobId(null);
        }
    };

    // --------------------------------------------------
    // STATUS BUTTON
    // --------------------------------------------------

    const renderStatusAction = (job) => {
        const status = job.status;

        // Pending / Assigned
        if (status === "Pending" || status === "Assigned") {
            return (
                <button
                    onClick={() =>
                        updateJobStatus(job, "Accepted")
                    }
                    disabled={updatingJobId === job._id}
                    style={{
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        padding: "10px 16px",
                        borderRadius: "6px",
                        cursor:
                            updatingJobId === job._id
                                ? "not-allowed"
                                : "pointer",
                        fontWeight: "bold",
                        marginRight: "8px",
                    }}
                >
                    {updatingJobId === job._id
                        ? "Updating..."
                        : "✅ Accept Job"}
                </button>
            );
        }

        // Accepted
        if (status === "Accepted") {
            return (
                <button
                    onClick={() =>
                        updateJobStatus(job, "On The Way")
                    }
                    disabled={updatingJobId === job._id}
                    style={{
                        background: "#f59e0b",
                        color: "#fff",
                        border: "none",
                        padding: "10px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    🚗 On The Way
                </button>
            );
        }

        // On The Way
        if (status === "On The Way") {
            return (
                <button
                    onClick={() =>
                        updateJobStatus(job, "Arrived")
                    }
                    disabled={updatingJobId === job._id}
                    style={{
                        background: "#8b5cf6",
                        color: "#fff",
                        border: "none",
                        padding: "10px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    📍 Arrived
                </button>
            );
        }

        // Arrived
        if (status === "Arrived") {
            return (
                <button
                    onClick={() =>
                        updateJobStatus(
                            job,
                            "Work In Progress"
                        )
                    }
                    disabled={updatingJobId === job._id}
                    style={{
                        background: "#0891b2",
                        color: "#fff",
                        border: "none",
                        padding: "10px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    🔧 Start Work
                </button>
            );
        }

        // Work In Progress
        if (status === "Work In Progress") {
            return (
                <button
                    onClick={() =>
                        updateJobStatus(job, "Completed")
                    }
                    disabled={updatingJobId === job._id}
                    style={{
                        background: "#16a34a",
                        color: "#fff",
                        border: "none",
                        padding: "10px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    ✅ Work Done
                </button>
            );
        }

        // Completed
        if (status === "Completed") {
            return (
                <span
                    style={{
                        color: "#16a34a",
                        fontWeight: "bold",
                    }}
                >
                    ✅ Job Completed
                </span>
            );
        }

        return null;
    };

    // --------------------------------------------------
    // LIVE LOCATION
    // --------------------------------------------------

    const startTracking = (job) => {
        if (!navigator.geolocation) {
            alert(
                "Geolocation is not supported by your browser."
            );
            return;
        }

        setGpsStatus("🟡 Acquiring GPS...");
        setTrackingJobId(job._id);

        watchIdRef.current =
            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } =
                        position.coords;

                    setCoords({
                        latitude,
                        longitude,
                    });

                    setGpsStatus("🟢 GPS Active");

                    if (socket) {
                        socket.emit(
                            "technician:location:update",
                            {
                                technicianId:
                                    user.id || user._id,
                                bookingId: job._id,
                                customerId:
                                    job.userId?._id ||
                                    job.userId,
                                latitude,
                                longitude,
                                timestamp: new Date(),
                            }
                        );
                    }
                },
                (err) => {
                    console.error(
                        "Location error:",
                        err
                    );

                    setGpsStatus(
                        "🔴 Tracking Failed - Check Permissions"
                    );
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 10000,
                    timeout: 5000,
                }
            );
    };

    const stopTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(
                watchIdRef.current
            );

            watchIdRef.current = null;
        }

        setTrackingJobId(null);
        setCoords(null);
        setGpsStatus("🔴 GPS Stopped");
    };

    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (loading) {
        return (
            <div className="p-6">
                Loading technician jobs...
            </div>
        );
    }

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "0 auto",
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <h2
                style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                }}
            >
                👨‍🔧 Technician Portal
            </h2>

            {/* GPS STATUS */}

            <div
                style={{
                    background: "#111",
                    color: "#fff",
                    padding: "20px",
                    borderRadius: "12px",
                    marginBottom: "30px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "15px",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <h3
                        style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                        }}
                    >
                        📍 Live Location Status
                    </h3>

                    <p
                        style={{
                            color: "#aaa",
                            fontSize: "14px",
                            marginTop: "5px",
                        }}
                    >
                        {gpsStatus} | Socket:{" "}
                        {socketStatus}
                    </p>

                    {coords && (
                        <p
                            style={{
                                fontSize: "12px",
                                marginTop: "10px",
                                color: "var(--primary)",
                            }}
                        >
                            Lat:{" "}
                            {coords.latitude.toFixed(6)}{" "}
                            | Lng:{" "}
                            {coords.longitude.toFixed(6)}
                        </p>
                    )}
                </div>

                {trackingJobId && (
                    <button
                        onClick={stopTracking}
                        style={{
                            background:
                                "var(--danger)",
                            color: "#fff",
                            padding: "10px 20px",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Stop Live Location
                    </button>
                )}
            </div>

            <h3
                style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "15px",
                }}
            >
                Active Assignments
            </h3>

            {jobs.length === 0 ? (
                <p>
                    No active jobs assigned to you
                    at the moment.
                </p>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                    }}
                >
                    {jobs.map((job) => (
                        <div
                            key={job._id}
                            style={{
                                border: "1px solid #ddd",
                                padding: "20px",
                                borderRadius: "12px",
                                background:
                                    trackingJobId ===
                                    job._id
                                        ? "#fff8f5"
                                        : "#fff",
                                width: "100%",
                                boxSizing: "border-box",
                            }}
                        >
                            {/* HEADER */}

                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                    justifyContent:
                                        "space-between",
                                    marginBottom: "10px",
                                }}
                            >
                                <strong>
                                    Booking #
                                    {job._id.slice(-6)}
                                </strong>

                                <span
                                    className={`badge badge-${job.status
                                        .replace(
                                            /\s+/g,
                                            "-"
                                        )
                                        .toLowerCase()}`}
                                    style={{
                                        whiteSpace:
                                            "nowrap",
                                    }}
                                >
                                    {job.status}
                                </span>
                            </div>

                            {/* CUSTOMER DETAILS */}

                            <p
                                style={{
                                    margin: "0",
                                    fontSize: "14px",
                                }}
                            >
                                <strong>
                                    Client:
                                </strong>{" "}
                                {job.name} ({job.phone})
                            </p>

                            <p
                                style={{
                                    margin:
                                        "5px 0",
                                    fontSize: "14px",
                                }}
                            >
                                <strong>
                                    Address:
                                </strong>{" "}
                                {job.address}
                            </p>

                            <p
                                style={{
                                    margin: "0",
                                    fontSize: "14px",
                                }}
                            >
                                <strong>
                                    Service:
                                </strong>{" "}
                                {job.serviceType}
                            </p>

                            {/* STATUS ACTION */}

                            <div
                                style={{
                                    marginTop: "18px",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                    alignItems:
                                        "center",
                                }}
                            >
                                {renderStatusAction(
                                    job
                                )}

                                {/* LIVE LOCATION */}

                                {[
                                    "Accepted",
                                    "On The Way",
                                    "Arrived",
                                    "Work In Progress",
                                ].includes(
                                    job.status
                                ) &&
                                    trackingJobId !==
                                        job._id && (
                                        <button
                                            onClick={() =>
                                                startTracking(
                                                    job
                                                )
                                            }
                                            disabled={
                                                trackingJobId !==
                                                null
                                            }
                                            style={{
                                                background:
                                                    trackingJobId
                                                        ? "#ccc"
                                                        : "var(--primary)",
                                                color:
                                                    "#fff",
                                                border:
                                                    "none",
                                                padding:
                                                    "10px 16px",
                                                borderRadius:
                                                    "6px",
                                                cursor:
                                                    trackingJobId
                                                        ? "not-allowed"
                                                        : "pointer",
                                                fontWeight:
                                                    "bold",
                                            }}
                                        >
                                            📍 Start Live
                                            Location
                                        </button>
                                    )}

                                {trackingJobId ===
                                    job._id && (
                                    <span
                                        style={{
                                            color:
                                                "var(--success)",
                                            fontWeight:
                                                "bold",
                                            fontSize:
                                                "14px",
                                        }}
                                    >
                                        🟢 Live location
                                        active
                                    </span>
                                )}
                            </div>

                            {/* STATUS FLOW */}

                            <div
                                style={{
                                    marginTop: "18px",
                                    padding: "12px",
                                    background: "#f8f9fa",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    color: "#555",
                                }}
                            >
                                <strong>
                                    Job Flow:
                                </strong>

                                <div
                                    style={{
                                        marginTop:
                                            "8px",
                                    }}
                                >
                                    Assigned → Accepted
                                    → On The Way →
                                    Arrived → Work In
                                    Progress → Completed
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TechnicianDashboard;