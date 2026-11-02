import React from 'react';
import { Link } from 'react-router-dom';

const MyHome = () => (
  <main className="home-page">
    <section className="hero-section home-background-hero">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <p className="eyebrow">LOCAL CHINESE TAKEAWAY · BRIGHTON</p>
        <h1>Comforting Chinese food, made for your night in.</h1>
        <p className="hero-copy">Order your favourites online for collection or local delivery from China Kitchen.</p>
        <div className="hero-actions">
          <Link to="/takeaway" className="primary-cta">View menu</Link>
          <Link to="/aboutus" className="secondary-cta">About China Kitchen</Link>
        </div>
        <div className="hero-notes"><span>Collection</span><i /><span>Local delivery</span><i /><span>Secure online payment</span></div>
      </div>
    </section>

    <section className="home-intro section-shell">
      <div className="section-heading">
        <p className="eyebrow dark">HOW TO ORDER</p>
        <h2>Four simple steps to place your order.</h2>
      </div>
      <div className="feature-grid four-steps">
        <article className="feature-card"><span className="feature-number">01</span><h3>Choose your dishes</h3><p>Browse the menu and add your favourites to your basket.</p><Link to="/takeaway">Browse menu <span aria-hidden="true">→</span></Link></article>
        <article className="feature-card"><span className="feature-number">02</span><h3>Create an account</h3><p>Create an account or sign in before continuing to checkout.</p><Link to="/signup">Sign up <span aria-hidden="true">→</span></Link></article>
        <article className="feature-card"><span className="feature-number">03</span><h3>Select collection or delivery</h3><p>Choose how you would like to receive your takeaway and select an available time.</p></article>
        <article className="feature-card"><span className="feature-number">04</span><h3>Pay & place your order</h3><p>Review your order, pay securely online and receive your confirmation.</p></article>
      </div>
    </section>

    <section className="menu-callout">
      <div className="container menu-callout-grid menu-callout-no-image">
        <div className="menu-copy">
          <p className="eyebrow dark">CHINA KITCHEN</p>
          <h2>Your local Chinese takeaway in Brighton.</h2>
          <p>From familiar favourites to rice dishes and set meals, find something for everyone in one easy online order.</p>
          <div className="menu-links"><Link to="/takeaway" className="primary-cta dark-button">English menu</Link><Link to="/takeawaychinese" className="text-link">中文菜單 →</Link></div>
        </div>
      </div>
    </section>
  </main>
);
export default MyHome;
