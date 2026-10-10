
import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

const mentors = [
  {
    name: "Sarah K.",
    role: "Software Engineer",
    company: "Google",
    price: "₹299",
    initials: "SK",
    color: "#dbeafe",
  },
  {
    name: "David L.",
    role: "Product Manager",
    company: "Amazon",
    price: "₹249",
    initials: "DL",
    color: "#ede9fe",
  },
  {
    name: "Maria P.",
    role: "Consultant",
    company: "McKinsey",
    price: "₹349",
    initials: "MP",
    color: "#fce7f3",
  },
];

const benefits = [
  {
    icon: "₹",
    title: "Affordable Mock Interviews",
    description: "Practise with experienced seniors without expensive coaching fees.",
  },
  {
    icon: "✦",
    title: "Expert Mentors",
    description: "Learn from seniors who understand placements and interviews.",
  },
  {
    icon: "◎",
    title: "Skill-Based Practice",
    description: "Prepare for technical, HR and role-specific interviews.",
  },
  {
    icon: "↗",
    title: "Personalized Feedback",
    description: "Understand your strengths and what to improve next.",
  },
];

const steps = [
  {
    number: "01",
    title: "Find a Mentor",
    description: "Explore mentors by skills, experience and budget.",
  },
  {
    number: "02",
    title: "Book a Session",
    description: "Choose a suitable date and available time slot.",
  },
  {
    number: "03",
    title: "Practise & Improve",
    description: "Attend your interview and receive useful feedback.",
  },
];

export default function LandingPage() {
  return (
    <div className="mockmate">
      <nav className="mm-navbar">
        <Link to="/" className="mm-brand">
          <span className="mm-brand-icon">M</span>
          MockMate
        </Link>

        <div className="mm-nav-links">
          <a href="#home">Home</a>
          <a href="#mentors">Find Mentors</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#team">About Us</a>
        </div>

        <div className="mm-nav-actions">
          <Link to="/auth" className="mm-login">Login</Link>
          <Link to="/auth" className="mm-button mm-button-dark">
            Sign Up
          </Link>
        </div>
      </nav>

      <main>
        <section className="mm-hero" id="home">
          <div className="mm-hero-content">
            <span className="mm-eyebrow">
              YOUR NEXT OPPORTUNITY STARTS HERE
            </span>

            <h1>
              Ace Your Next Interview
              <br />
              with <span>MockMate.</span>
            </h1>

            <p>
              Affordable mock interviews with experienced seniors and
              industry mentors. Practise confidently, get honest feedback
              and take the next step towards your dream role.
            </p>

            <div className="mm-hero-actions">
              <a href="#mentors" className="mm-button mm-button-primary">
                Find a Mentor <span>→</span>
              </a>
              <Link to="/auth" className="mm-button mm-button-outline">
                Become a Mentor
              </Link>
            </div>

            <div className="mm-trust">
              <div className="mm-avatar-stack">
                <span>A</span><span>R</span><span>S</span>
              </div>
              <p><strong>Learn from your seniors.</strong><br />Prepare for your next big opportunity.</p>
            </div>
          </div>

          <div className="mm-hero-visual">
            <div className="mm-orbit mm-orbit-one" />
            <div className="mm-orbit mm-orbit-two" />

            <div className="mm-visual-card">
              <div className="mm-visual-top">
                <span className="mm-live-dot" /> MOCK INTERVIEW
                <span>•••</span>
              </div>
              <div className="mm-person-illustration">
                <div className="mm-person-circle">👨🏻‍💻</div>
                <div className="mm-person-circle mm-person-small">👩🏻‍💼</div>
              </div>
              <div className="mm-visual-caption">
                <div>
                  <strong>Practice makes progress.</strong>
                  <p>Your next interview, made easier.</p>
                </div>
                <span className="mm-caption-icon">↗</span>
              </div>
            </div>

            <div className="mm-float-card mm-float-feedback">
              <span>✦</span>
              <div><strong>Personalized feedback</strong><p>Improve with every session</p></div>
            </div>

            <div className="mm-float-card mm-float-session">
              <span>✓</span>
              <div><strong>Session booked!</strong><p>You're one step closer.</p></div>
            </div>
          </div>
        </section>

        <section className="mm-benefits mm-section">
          <div className="mm-section-heading">
            <span className="mm-eyebrow">WHY MOCKMATE?</span>
            <h2>Everything you need to <span>stand out.</span></h2>
            <p>Interview preparation that fits your goals and your budget.</p>
          </div>

          <div className="mm-benefit-grid">
            {benefits.map((benefit) => (
              <article className="mm-benefit-card" key={benefit.title}>
                <div className="mm-benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mm-how mm-section" id="how-it-works">
          <div className="mm-section-heading">
            <span className="mm-eyebrow">SIMPLE BY DESIGN</span>
            <h2>Three steps to interview <span>confidence.</span></h2>
            <p>From finding a mentor to getting actionable feedback.</p>
          </div>

          <div className="mm-steps-grid">
            {steps.map((step) => (
              <article className="mm-step-card" key={step.number}>
                <span className="mm-step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <span className="mm-step-arrow">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section className="mm-mentors mm-section" id="mentors">
          <div className="mm-section-heading">
            <span className="mm-eyebrow">LEARN FROM THE BEST</span>
            <h2>Meet your future <span>mentors.</span></h2>
            <p>Get guidance from people who have been where you want to go.</p>
          </div>

          <div className="mm-mentor-grid">
            {mentors.map((mentor) => (
              <article className="mm-mentor-card" key={mentor.name}>
                <div
                  className="mm-mentor-avatar"
                  style={{ backgroundColor: mentor.color }}
                >
                  {mentor.initials}
                </div>
                <h3>{mentor.name}</h3>
                <p className="mm-mentor-role">{mentor.role}</p>
                <p className="mm-mentor-company">{mentor.company}</p>
                <div className="mm-rating">★★★★★ <span>(Sample profile)</span></div>
                <div className="mm-mentor-bottom">
                  <div><strong>{mentor.price}</strong><span> / session</span></div>
                  <Link to="/auth" className="mm-button mm-button-dark">
                    View Profile
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="mm-demo-note">
            Sample mentor profiles for demonstration. Actual profiles will be
            provided by registered mentors.
          </p>
        </section>

        <section className="mm-team mm-section" id="team">
          <div className="mm-section-heading">
            <span className="mm-eyebrow">THE PEOPLE BEHIND THE IDEA</span>
            <h2>Built by students, <span>for students.</span></h2>
            <p>Making quality interview preparation more accessible.</p>
          </div>

          <div className="mm-team-grid">
            <article className="mm-team-card">
              <div className="mm-team-avatar">D1</div>
              <div><h3>Rithwik</h3><p>Frontend & Product Design</p></div>
            </article>
            <article className="mm-team-card">
              <div className="mm-team-avatar mm-team-avatar-alt">D2</div>
              <div><h3>Aaryan</h3><p>Backend & API Development</p></div>
            </article>
          </div>
          <p className="mm-demo-note">Replace these placeholders with your team details.</p>
        </section>

        <section className="mm-cta">
          <span className="mm-eyebrow">YOUR NEXT CHAPTER STARTS NOW</span>
          <h2>Walk into your next interview with confidence.</h2>
          <p>Find the right mentor. Practise your skills. Keep getting better.</p>
          <Link to="/auth" className="mm-button mm-button-light">
            Get Started <span>→</span>
          </Link>
        </section>
      </main>

      <footer className="mm-footer">
        <div className="mm-footer-main">
          <div className="mm-footer-about">
            <Link to="/" className="mm-brand mm-brand-light">
              <span className="mm-brand-icon">M</span> MockMate
            </Link>
            <p>Affordable mock interviews. Real guidance. Better preparation.</p>
          </div>
          <div><h4>Explore</h4><a href="#home">Home</a><a href="#mentors">Find Mentors</a><a href="#how-it-works">How It Works</a></div>
          <div><h4>Support</h4><a href="mailto:hello@mockmate.example">Contact Us</a><a href="#how-it-works">FAQs</a></div>
          <div><h4>Get Started</h4><Link to="/auth">Login</Link><Link to="/auth">Become a Mentor</Link></div>
        </div>
        <div className="mm-footer-bottom">
          <span>© {new Date().getFullYear()} MockMate. Built for better interview preparation.</span>
          <span>Learn together. Grow together.</span>
        </div>
      </footer>
    </div>
  );
}
