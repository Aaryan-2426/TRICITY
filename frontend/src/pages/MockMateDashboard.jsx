import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import client, { bookingClient } from "../utils/axiosConfig";

export default function MockMateDashboard() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role") || "student";
  const name = localStorage.getItem("name") || "there";

  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [myBookings, setMyBookings] = useState([]);
  const [aiPlans, setAiPlans] = useState({});
  const [aiLoading, setAiLoading] = useState({});
  const [aiErrors, setAiErrors] = useState({});
  const [aiExpanded, setAiExpanded] = useState({});

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingSaving, setBookingSaving] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    navigate("/auth");
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingMessage("");
    setPaymentSuccess(false);
    setShowPayment(true);

    try {
      const token = localStorage.getItem("token");

      await bookingClient.post("/create", {
        token,
        mentorUsername: selectedMentor.username,
        date: bookingDate,
        time: bookingTime,
      });

      setBookingMessage("Booking request submitted successfully!");
      setBookingDate("");
      setBookingTime("");
    } catch (err) {
      console.error("Booking failed:", err);
      setBookingMessage(
        err.response?.data?.message || "Unable to submit booking.",
      );
    } finally {
      setBookingSaving(false);
    }
  };
  const handleDemoPayment = async () => {
    setBookingSaving(true);
    setBookingMessage("");

    try {
      const token = localStorage.getItem("token");

      await bookingClient.post("/create", {
        token,
        mentorUsername: selectedMentor.username,
        date: bookingDate,
        time: bookingTime,
      });

      setPaymentSuccess(true);
      setBookingMessage(
        "Demo payment successful! Your booking request has been submitted.",
      );

      const response = await bookingClient.get("/my-bookings", {
        params: { token },
      });

      setMyBookings(response.data);
    } catch (err) {
      console.error("Demo booking failed:", err);
      setBookingMessage(
        err.response?.data?.message || "Unable to complete the demo booking.",
      );
    } finally {
      setBookingSaving(false);
    }
  };
  const handleGeneratePlan = async (bookingId) => {
    setAiLoading((previous) => ({
      ...previous,
      [bookingId]: true,
    }));

    setAiErrors((previous) => ({
      ...previous,
      [bookingId]: "",
    }));

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/v1/ai/improvement-plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            bookingId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to generate an AI improvement plan.",
        );
      }

      setAiPlans((previous) => ({
        ...previous,
        [bookingId]: data.plan,
      }));

      setAiExpanded((previous) => ({
        ...previous,
        [bookingId]: true,
      }));
    } catch (error) {
      console.error("AI improvement plan error:", error);

      setAiErrors((previous) => ({
        ...previous,
        [bookingId]: error.message,
      }));
    } finally {
      setAiLoading((previous) => ({
        ...previous,
        [bookingId]: false,
      }));
    }
  };

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await client.get("/mentors");
        setMentors(response.data);
      } catch (err) {
        console.error("Failed to fetch mentors:", err);
        setError("Unable to load mentors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
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
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchMyBookings();
  }, []);

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
          <h3>MockMate</h3>
          <button onClick={() => navigate("/home")}>Dashboard</button>
          {role === "student" ? (
            <>
              <a href="#find-mentors">Find Mentors</a>
              <a href="#my-bookings">My Bookings</a>
            </>
          ) : (
            <>
              <a href="#mentor-sessions">My Sessions</a>
              <a href="#availability">Availability</a>
            </>
          )}
          <button onClick={logout}>Logout</button>
        </aside>

        <main className="mm-main">
          {role === "student" ? (
            <>
              <section className="mm-welcome">
                <p>YOUR INTERVIEW JOURNEY STARTS HERE</p>
                <h1>Welcome, {name}!</h1>
                <p>
                  Find experienced mentors and prepare for your next interview.
                </p>
              </section>

              <section id="find-mentors" className="mm-section">
                <h2>Find Your Mock Interview Partner</h2>

                <input
                  placeholder="Search by mentor, company or skill..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {loading ? (
                  <p>Loading mentors...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : mentors.filter((mentor) =>
                    `${mentor.name} ${mentor.title} ${mentor.company} ${mentor.skills}`
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                  ).length === 0 ? (
                  <p>No mentors found. Please check back later.</p>
                ) : (
                  <div className="mm-mentor-grid">
                    {mentors
                      .filter((mentor) =>
                        `${mentor.name} ${mentor.title} ${mentor.company} ${mentor.skills}`
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                      )
                      .map((mentor) => (
                        <article className="mm-mentor-card" key={mentor._id}>
                          <div className="mm-avatar">
                            {mentor.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <h3>{mentor.name}</h3>
                          <p>{mentor.title || "Interview Mentor"}</p>
                          <p>{mentor.company || "Company not specified"}</p>
                          <span className="mm-skill">
                            {mentor.skills || "Skills not specified"}
                          </span>
                          <p className="mm-price">
                            ₹{mentor.price || 0} / session
                          </p>
                          <button
                            onClick={() => {
                              setSelectedMentor(mentor);
                              setBookingMessage("");
                            }}
                          >
                            Book a Mock Interview
                          </button>
                        </article>
                      ))}
                  </div>
                )}

                {selectedMentor && (
                  <div className="mm-section">
                    <h2>Book a Mock Interview</h2>
                    <p>Mentor: {selectedMentor.name}</p>
                    <p>Session fee: ₹{selectedMentor.price || 0} / session</p>

                    <form onSubmit={handleBooking} className="mm-profile-form">
                      <label>Interview Date</label>
                      <input
                        type="date"
                        value={bookingDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                      />

                      <label>Interview Time</label>
                      <input
                        type="time"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        required
                      />

                      <button type="submit" disabled={bookingSaving}>
                        {bookingSaving ? "Submitting..." : "Confirm Booking"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedMentor(null)}
                      >
                        Cancel
                      </button>

                      {paymentSuccess && <p>{bookingMessage}</p>}
                    </form>
                    {showPayment && (
                      <div className="mm-payment-card">
                        <h2>Review & Pay</h2>

                        <p>
                          <strong>Mentor:</strong> {selectedMentor.name}
                        </p>
                        <p>
                          <strong>Interview date:</strong>{" "}
                          {bookingDate || "Not selected"}
                        </p>
                        <p>
                          <strong>Interview time:</strong>{" "}
                          {bookingTime || "Not selected"}
                        </p>
                        <p className="mm-price">
                          Total: ₹{selectedMentor.price || 0}
                        </p>

                        <p className="mm-demo-notice">
                          Demo Payment — No real money will be charged.
                        </p>

                        {bookingMessage && !showPayment && (
                          <p className="mm-booking-message">{bookingMessage}</p>
                        )}

                        {!paymentSuccess && (
                          <button
                            onClick={handleDemoPayment}
                            disabled={bookingSaving}
                          >
                            {bookingSaving
                              ? "Processing..."
                              : `Pay ₹${selectedMentor.price || 0} & Confirm Booking`}
                          </button>
                        )}

                        {paymentSuccess && (
                          <p>Booking request submitted successfully!</p>
                        )}

                        <button
                          type="button"
                          disabled={bookingSaving}
                          onClick={() => {
                            setShowPayment(false);
                            setBookingMessage("");
                          }}
                        >
                          Back to Booking
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>

              <section id="my-bookings" className="mm-section">
                <h2>My Bookings</h2>

                {myBookings.length === 0 ? (
                  <p>No bookings yet. Book a mock interview to get started.</p>
                ) : (
                  <div className="mm-mentor-grid">
                    {myBookings.map((booking) => (
                      <article className="mm-mentor-card" key={booking._id}>
                        <h3>{booking.mentorName}</h3>

                        <p>
                          <strong>Date:</strong> {booking.date}
                        </p>

                        <p>
                          <strong>Time:</strong> {booking.time}
                        </p>

                        <p className="mm-price">₹{booking.fee} / session</p>

                        <p>
                          <strong>Status:</strong>{" "}
                          {booking.status.toUpperCase()}
                        </p>

                        {booking.status === "confirmed" && (
                          <button
                            onClick={() =>
                              navigate(`/interview/${booking._id}`)
                            }
                          >
                            Join Interview
                          </button>
                        )}
                        {booking.status === "completed" && booking.feedback && (
                          <div className="mm-feedback">
                            <button
                              onClick={() => {
                                if (aiPlans[booking._id]) {
                                  setAiExpanded((previous) => ({
                                    ...previous,
                                    [booking._id]: !previous[booking._id],
                                  }));
                                } else {
                                  handleGeneratePlan(booking._id);
                                }
                              }}
                              disabled={aiLoading[booking._id]}
                            >
                              {aiLoading[booking._id]
                                ? "Generating AI Plan..."
                                : aiPlans[booking._id]
                                  ? aiExpanded[booking._id]
                                    ? "Hide AI Improvement Plan"
                                    : "Show AI Improvement Plan"
                                  : "Get AI Improvement Plan"}
                            </button>

                            {aiErrors[booking._id] && (
                              <p>{aiErrors[booking._id]}</p>
                            )}

                            {aiExpanded[booking._id] &&
                              aiPlans[booking._id] && (
                                <div>
                                  <h3>Your Personalized Improvement Plan</h3>
                                  <div className="mm-ai-plan-content">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {aiPlans[booking._id]}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              )}
                          </div>
                        )}
                        {booking.status === "completed" && booking.feedback && (
                          <div className="mm-feedback">
                            <h3>Mentor Feedback</h3>

                            <p>
                              <strong>Rating:</strong> {booking.feedback.rating}
                              /5
                            </p>

                            <p>
                              <strong>Strengths:</strong>{" "}
                              {booking.feedback.strengths}
                            </p>

                            <p>
                              <strong>Areas to Improve:</strong>{" "}
                              {booking.feedback.weaknesses}
                            </p>

                            <p>
                              <strong>Suggestions:</strong>{" "}
                              {booking.feedback.suggestions}
                            </p>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            <>
              <section className="mm-welcome">
                <p>MENTOR WORKSPACE</p>
                <h1>Welcome, {name}!</h1>
                <p>Manage your interview sessions and help students prepare.</p>
              </section>

              <section id="mentor-sessions" className="mm-section">
                <h2>Upcoming Interview Bookings</h2>
                <p>Your student bookings will appear here.</p>
              </section>

              <section id="availability" className="mm-section">
                <h2>Availability Management</h2>
                <p>Availability scheduling will be added in the next step.</p>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
