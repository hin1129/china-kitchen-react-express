import React from "react";

const AboutUs = () => (
  <main className="content-page about-page">
    <section className="page-hero compact-page-hero">
      <p className="eyebrow dark">ABOUT US</p>
      <h1>China Kitchen</h1>
      <p>A local Chinese takeaway in Brighton offering collection and local delivery.</p>
    </section>
    <section className="about-content-grid">
      <article className="content-card about-main-card">
        <h2>Ordering from China Kitchen</h2>
        <p>Customers can browse the menu, create an account, place orders online and track order history.</p>
      </article>
      <article className="content-card"><h3>Collection</h3><p>Order online and collect your takeaway directly from China Kitchen.</p></article>
      <article className="content-card"><h3>Delivery</h3><p>Local delivery is available to supported addresses within our delivery area.</p></article>
      <article className="content-card"><h3>Find us</h3><p>17 Coombe Terrace<br />Brighton, East Sussex<br />England, BN2 4AD</p></article>
    </section>
  </main>
);
export default AboutUs;
