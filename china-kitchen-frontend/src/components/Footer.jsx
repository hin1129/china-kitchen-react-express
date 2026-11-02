import React from 'react';

const Footer = () => (
  <footer className="site-footer">
    <div className="container footer-info-grid">
      <section>
        <p className="footer-kicker">ABOUT</p>
        <h2 className="footer-brand">China Kitchen</h2>
        <p>Local Chinese takeaway serving collection and delivery from Coombe Terrace in Brighton.</p>
        <p className="footer-address">17 Coombe Terrace<br />Brighton, East Sussex<br />England, BN2 4AD</p>
      </section>
      <section>
        <p className="footer-kicker">OPENING TIMES</p>
        <div className="hours-list">
          <div><span>Monday</span><strong>17:00 – 22:30</strong></div>
          <div><span>Tuesday</span><strong>Closed</strong></div>
          <div><span>Wednesday</span><strong>17:00 – 22:30</strong></div>
          <div><span>Thursday</span><strong>17:00 – 22:30</strong></div>
          <div><span>Friday</span><strong>17:00 – 22:30</strong></div>
          <div><span>Saturday</span><strong>17:00 – 22:30</strong></div>
          <div><span>Sunday</span><strong>17:00 – 22:30</strong></div>
        </div>
      </section>
      <section className="footer-map-wrap">
        <p className="footer-kicker">FIND US</p>
        <iframe className="footer-map" title="China Kitchen, 17 Coombe Terrace, Brighton" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=China+Kitchen+17+Coombe+Terrace+Brighton+BN2+4AD&output=embed" />
      </section>
    </div>
  </footer>
);
export default Footer;
