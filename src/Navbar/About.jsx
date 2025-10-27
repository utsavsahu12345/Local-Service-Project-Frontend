import React from "react";
import "./About.css"; // Assuming you have some CSS for styling
import Experienced from "../assets/experienced.jpg";
import Quality from "../assets/Quality.jpg";
import Transparent from "../assets/transparent.jpg";
import Customer from "../assets/customer.jpg";
import { Link } from "react-router-dom";

// Reusable component for Mission/Vision boxes (kept inside the file as requested)
const InfoBox = ({ title, content }) => {
  return (
    // Bootstrap classes for styling and the left border
    <div className="p-4 bg-light mb-4 border-start border-primary border-5">
      <h2 className="h4 fw-bold mb-3">{title}</h2>
      <p>{content}</p>
    </div>
  );
};
const benefits = [
  {
    title: "Experienced Professionals",
    description:
      "Our team consists of highly skilled and experienced technicians who are experts in their fields.",
    imageUrl: Experienced,
  },
  {
    title: "Quality Workmanship",
    description:
      "We use only the best materials and employ proven techniques to ensure lasting results.",
    imageUrl: Quality,
  },
  {
    title: "Transparent Pricing",
    description:
      "We provide clear and upfront pricing with no hidden fees, so you know exactly what to expect.",
    imageUrl: Transparent,
  },
  {
    title: "Customer Satisfaction",
    description:
      "Your satisfaction is our top priority. We go the extra mile to ensure you're happy with our services.",
    imageUrl: Customer,
  },
];

const BenefitCard = ({ title, description, imageUrl }) => (
  <div className="benefit-card">
    {/* Use an <img> tag for the image */}
    <div className="card-image-wrapper">
      <img src={imageUrl} alt={title} className="card-image-actual" />
    </div>

    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);
const About = () => {
  // Data for the 'Our Story' section
  const storyContent = (
    <>
      <p>
        <strong>QuickFix Services</strong> was founded in 2018 by{" "}
        <strong>Alex Johnson</strong>, a seasoned handyman with over 15 years of
        experience in the home repair industry. Alex's vision was to create a
        reliable and professional service that homeowners could trust for all
        their home maintenance needs.
      </p>
      <p>
        Starting with a small team of skilled technicians, QuickFix Services
        quickly gained a reputation for quality workmanship and exceptional
        customer service. Today, we serve hundreds of satisfied customers across
        the city, offering a wide range of services from minor repairs to major
        renovations.
      </p>
    </>
  );

  return (
    <>
      {/* 1. Hero Section (Header) - Included directly in AboutPage */}
      <header className="hero-section">
        <div className="container hero-content">
          <h1 className="display-4 fw-bold">About QuickFix Services</h1>
          <p className="lead">
            Your trusted partner for all home repair and maintenance needs.
          </p>
        </div>
      </header>

      {/* 2. Main Content Section (Story, Mission, Vision) */}
      <div className="content-box">
        <div className="container">
          <div className="row">
            {/* Our Story Column (Takes 7/12 columns on medium/large screens) */}
            <div className="col-md-7">
              <div className="pe-md-4">
                <h2 className="h4 fw-bold mb-3">Our Story</h2>
                {storyContent}
              </div>
            </div>

            {/* Mission & Vision Column (Takes 5/12 columns) */}
            <div className="col-md-5">
              {/* Our Mission Box */}
              <InfoBox
                title="Our Mission"
                content="To provide high-quality, reliable, and affordable home repair and maintenance services that exceed customer expectations."
              />

              {/* Our Vision Box */}
              <InfoBox
                title="Our Vision"
                content="To become the leading home service provider in the region, known for our professionalism, expertise, and commitment to customer satisfaction."
              />
            </div>
          </div>
        </div>
      </div>
      <div className="why-choose-us-container">
        {/* Why Choose Us Section Header */}
        <div className="why-choose-us-header">
          <h2>Why Choose Us?</h2>
          <p>We are committed to delivering the best service and results.</p>
        </div>

        {/* Benefits Grid */}
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>

        {/* --- Ready to Get Started (Call to Action) Section --- */}
        <div className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>
            Contact us today for a free consultation and estimate. Let us handle
            your home repair needs with professionalism and care.
          </p>
          <Link
            className="cta-button"
          >
            Get a Free Quote
          </Link>
        </div>
      </div>
      <footer className="about-footer">
        <div>© 2025 Local Service. All rights reserved.</div>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </footer>
    </>
  );
};

export default About;
