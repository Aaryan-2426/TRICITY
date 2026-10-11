import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import client, { bookingClient } from "../utils/axiosConfig";

export default function MentorDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Mentor";

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [price, setPrice] = useState("250");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [myBookings, setMyBookings] = useState([]);

  const [feedbackBookingId, setFeedbackBookingId] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState("5");
  const [feedbackStrengths, setFeedbackStrengths] = useState("");
  const [feedbackWeaknesses, setFeedbackWeaknesses] = useState("");
  const [feedbackSuggestions, setFeedbackSuggestions] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleUploadDocument = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select a document first.");
      return;
    }

    setUploadMessage("Uploading document...");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("document", selectedFile);
      formData.append("token", token);

      const response = await fetch(
        "https://tricity-backend.onrender.com/api/v1/documents/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed.");
      }

      setUploadMessage("Document uploaded successfully!");
      setSelectedFile(null);
    } catch (error) {
      setUploadMessage(error.message || "Unable to upload document.");
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await client.get("/mentors");
        const myUsername = localStorage.getItem("username");
        const mentor = response.data.find(
          (item) => item.username === myUsername,
        );

        if (mentor) {
          setTitle(mentor.title || "");
          setCompany(mentor.company || "");
          setSkills(mentor.skills || "");
          setPrice(String(mentor.price ?? 250));
        }
      } catch (error) {
        console.error("Could not load mentor profile:", error);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await bookingClient.get("/my-bookings", {
          params: { token },
        });

        setMyBookings(response.data);
      } catch (err) {
        console.error("Failed to fetch mentor bookings:", err);
      }
    };

    fetchMyBookings();
  }, []);

  const handleBookingStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem("token");

      await bookingClient.post("/update-status", {
        token,
        bookingId,
        status,
      });

      setMyBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status } : booking,
        ),
      );
    } catch (error) {
      console.error("Failed to update booking status:", error);
      alert(
        error.response?.data?.message || "Unable to update booking status.",
      );
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    if (!feedbackBookingId) return;

    setFeedbackSaving(true);
    setFeedbackMessage("");

    try {
      const token = localStorage.getItem("token");

      await bookingClient.post("/submit-feedback", {
        token,
        bookingId: feedbackBookingId,
        rating: Number(feedbackRating),
        strengths: feedbackStrengths,
        weaknesses: feedbackWeaknesses,
        suggestions: feedbackSuggestions,
      });

      setMyBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === feedbackBookingId
            ? {
                ...booking,
                status: "completed",
                feedback: {
                  rating: Number(feedbackRating),
                  strengths: feedbackStrengths,
                  weaknesses: feedbackWeaknesses,
                  suggestions: feedbackSuggestions,
                },
              }
            : booking,
        ),
      );

      setFeedbackMessage("Feedback submitted successfully!");
      setFeedbackBookingId(null);
      setFeedbackRating("5");
      setFeedbackStrengths("");
      setFeedbackWeaknesses("");
      setFeedbackSuggestions("");
    } catch (error) {
      console.error("Feedback submission failed:", error);
      setFeedbackMessage(
        error.response?.data?.message || "Unable to submit feedback.",
      );
    } finally {
      setFeedbackSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    navigate("/auth");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      await client.put("/update-mentor-profile", {
        token,
        title,
        company,
        skills,
        price,
      });

      setMessage("Profile saved successfully!");
    } catch (error) {
      console.error("Profile save failed:", error);
      setMessage(error.response?.data?.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mm-dashboard">
      <header className="mm-topbar">
        <h2>◆ MockMate</h2>
        <div>
          <span>Welcome, {name}!</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="mm-layout">
        <aside className="mm-sidebar">
          <h3>Mentor Workspace</h3>
          <a href="#dashboard">Dashboard</a>
          <a href="#sessions">My Sessions</a>
          <a href="#availability">Availability</a>
          <a href="#profile">My Profile</a>
          <button onClick={logout}>Logout</button>
        </aside>

        <main className="mm-main" id="dashboard">
          <section className="mm-welcome">
            <p>MENTOR WORKSPACE</p>
            <h1>Welcome, {name}!</h1>
            <p>
              Help students prepare for interviews and build their confidence.
            </p>
          </section>

          <section className="mm-section">
            <h2>Your Overview</h2>

            <div className="mm-mentor-grid">
              <article className="mm-mentor-card">
                <h3>Upcoming Sessions</h3>
                <p>
                  {
                    myBookings.filter(
                      (booking) => booking.status === "confirmed",
                    ).length
                  }{" "}
                  scheduled interviews
                </p>
              </article>

              <article className="mm-mentor-card">
                <h3>Completed Sessions</h3>
                <p>
                  {
                    myBookings.filter(
                      (booking) => booking.status === "completed",
                    ).length
                  }{" "}
                  completed interviews
                </p>
              </article>

              <article className="mm-mentor-card">
                <h3>Session Fee</h3>
                <p>₹{Number(price) || 0} / session</p>
              </article>
            </div>
          </section>

          <section className="mm-section" id="sessions">
            <h2>My Sessions</h2>

            {myBookings.length === 0 ? (
              <p>No booking requests yet.</p>
            ) : (
              <div className="mm-mentor-grid">
                {myBookings.map((booking) => (
                  <article className="mm-mentor-card" key={booking._id}>
                    <h3>Student: {booking.studentUsername}</h3>

                    <p>
                      <strong>Date:</strong> {booking.date}
                    </p>

                    <p>
                      <strong>Time:</strong> {booking.time}
                    </p>

                    <p className="mm-price">₹{booking.fee} / session</p>

                    <p>
                      <strong>Status:</strong> {booking.status.toUpperCase()}
                    </p>

                    {booking.status === "pending" && (
                      <div>
                        <button
                          onClick={() =>
                            handleBookingStatus(booking._id, "confirmed")
                          }
                        >
                          Accept Booking
                        </button>

                        <button
                          onClick={() =>
                            handleBookingStatus(booking._id, "cancelled")
                          }
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}

                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => navigate(`/interview/${booking._id}`)}
                      >
                        Join Interview
                      </button>
                    )}
                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => {
                          setFeedbackBookingId(booking._id);
                          setFeedbackMessage("");
                        }}
                      >
                        Give Feedback
                      </button>
                    )}
                    {feedbackBookingId === booking._id && (
                      <form
                        onSubmit={handleSubmitFeedback}
                        className="mm-feedback-form"
                      >
                        <h3>Interview Feedback</h3>

                        <label>Rating</label>
                        <select
                          value={feedbackRating}
                          onChange={(e) => setFeedbackRating(e.target.value)}
                          required
                        >
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Very Good</option>
                          <option value="3">3 - Good</option>
                          <option value="2">2 - Needs Improvement</option>
                          <option value="1">1 - Poor</option>
                        </select>

                        <label>Strengths</label>
                        <textarea
                          value={feedbackStrengths}
                          onChange={(e) => setFeedbackStrengths(e.target.value)}
                          placeholder="What did the student do well?"
                          required
                        />

                        <label>Areas to Improve</label>
                        <textarea
                          value={feedbackWeaknesses}
                          onChange={(e) =>
                            setFeedbackWeaknesses(e.target.value)
                          }
                          placeholder="What should the student improve?"
                          required
                        />

                        <label>Suggestions</label>
                        <textarea
                          value={feedbackSuggestions}
                          onChange={(e) =>
                            setFeedbackSuggestions(e.target.value)
                          }
                          placeholder="Suggestions for the student"
                          required
                        />

                        {feedbackMessage && <p>{feedbackMessage}</p>}

                        <button type="submit" disabled={feedbackSaving}>
                          {feedbackSaving ? "Submitting..." : "Submit Feedback"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setFeedbackBookingId(null)}
                        >
                          Cancel
                        </button>
                      </form>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="mm-section" id="availability">
            <h2>Availability</h2>
            <p>Scheduling available interview slots is coming next.</p>
          </section>

          <section className="mm-section" id="profile">
            <h2>My Profile</h2>
            <p>Share your expertise so students can find the right mentor.</p>

            <form onSubmit={handleSaveProfile} className="mm-profile-form">
              <label>Professional Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Software Engineer"
                required
              />

              <label>Company</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Your company"
                required
              />

              <label>Skills</label>
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. C++, DSA, React"
                required
              />

              <label>Session Fee (₹)</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />

              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>

              {message && <p>{message}</p>}
            </form>
          </section>

          <section className="mm-section" id="credentials">
            <h2>Mentor Credentials & Resources</h2>
            <p>
              Share certificates, professional credentials, or interview
              preparation resources to help students learn more about you.
            </p>

            <div className="mm-profile-form">
              <label htmlFor="mentor-document">
                Choose a document (PDF, JPG, PNG)
              </label>
              <input
                id="mentor-document"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  setUploadMessage("");

                  if (!file) {
                    setSelectedFile(null);
                    return;
                  }

                  const allowedTypes = [
                    "application/pdf",
                    "image/jpeg",
                    "image/png",
                  ];

                  if (!allowedTypes.includes(file.type)) {
                    setSelectedFile(null);
                    setUploadMessage("Please select a PDF, JPG, or PNG file.");
                    e.target.value = "";
                    return;
                  }

                  if (file.size > 5 * 1024 * 1024) {
                    setSelectedFile(null);
                    setUploadMessage("File size must not exceed 5 MB.");
                    e.target.value = "";
                    return;
                  }

                  setSelectedFile(file);
                }}
              />
              {selectedFile && (
                <p style={{ color: "#0D9488", marginTop: "10px" }}>
                  Selected: {selectedFile.name}
                </p>
              )}

              {uploadMessage && (
                <p
                  style={{
                    color: "#DC2626",
                    background: "#FEF2F2",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    marginTop: "10px",
                    gridColumn: "1 / -1",
                  }}
                >
                  {uploadMessage}
                </p>
              )}
              <p>Maximum file size: 5 MB.</p>

              <button
                type="button"
                onClick={handleUploadDocument}
                disabled={!selectedFile}
              >
                Upload Document
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
