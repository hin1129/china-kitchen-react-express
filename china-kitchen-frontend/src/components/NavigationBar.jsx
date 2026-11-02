import React from 'react';
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const NavigationBar = ({ logInState, currentUser, handleLogout }) => (
  <Navbar collapseOnSelect expand="md" sticky="top" className="site-navbar">
    <Container className="nav-shell">
      <Navbar.Brand as={NavLink} to="/" className="brand-lockup">
        <span className="brand-mark">CK</span>
        <span><strong>China Kitchen</strong><small>Brighton</small></span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" className="nav-toggle" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ms-auto align-items-md-center nav-links">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/takeaway" className="nav-link">Menu</NavLink>
          <NavLink to="/takeawaychinese" className="nav-link">中文菜單</NavLink>
          <NavLink to="/aboutus" className="nav-link">About</NavLink>
          <NavLink to="/commentlist" className="nav-link">Reviews</NavLink>
          {logInState ? (
            <NavDropdown title={currentUser?.fullName || 'Account'} id="responsive-nav-dropdown" align="end">
              <NavDropdown.Item as={NavLink} to="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/my-orders">My Orders</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/postcomment">Leave a review</NavDropdown.Item>
              {currentUser?.role === 'admin' && <>
                <NavDropdown.Divider />
                <NavDropdown.Item as={NavLink} to="/admin/orders">Admin Orders</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/admin/menu">Admin Menu</NavDropdown.Item>
              </>}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Sign out</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <NavDropdown title="Account" id="account-nav-dropdown" align="end">
              <NavDropdown.Item as={NavLink} to="/signin">Sign in</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/signup">Sign up</NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);
export default NavigationBar;
