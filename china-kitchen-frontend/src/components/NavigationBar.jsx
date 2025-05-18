import React, { useState } from 'react'
import { Container, Nav, NavDropdown, Navbar, NavbarBrand, Button, Offcanvas } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'

const NavigationBar = ({ logInState, handleLogout }) => {
    return (
        // <div>
        //     <NavLink to="/" >Home</NavLink><br />
        //     <NavLink to="/takeaway" >Takeaway  Menu</NavLink><br />
        //     <NavLink to="/takeawaychinese" >Takeaway Chinese Menu</NavLink><br />
        //     {logInState ? (
        //         <>
        //             <NavLink to="/postcomment">Post comment</NavLink><br />
        //             <button onClick={handleLogout}>Logout</button><br />
        //         </>
        //     ) : (
        //         <>
        //             <NavLink to="/signup">Sign up</NavLink><br />
        //             <NavLink to="/signin">Sign in</NavLink>
        //         </>
        //     )}
        // </div>

        <Navbar className="bg-body-tertiary custom-navbar" collapseOnSelect expand="lg" Navbar sticky='top' bg="dark" data-bs-theme="dark" >
            <Container>
                <Navbar.Brand href="/">
                    <img
                        src="../public/logo192.png"
                        alt="Logo?"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />
                    {/* Logo */}
                </Navbar.Brand>

                {/* appear when minimized */}
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto justify-content-between" >
                        {/* <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href='/takeaway'>Takeaway Menu</Nav.Link>
                        <Nav.Link href='/takeawaychinese'>Takeaway Chinese Menu</Nav.Link>
                        <Nav.Link href='/aboutus'>About Us</Nav.Link> */}

                        <NavLink to="/" className="nav-link">Home</NavLink>
                        <NavLink to="/takeaway" className="nav-link">Takeaway  Menu</NavLink>
                        <NavLink to="/takeawaychinese" className="nav-link">Takeaway Chinese Menu</NavLink>
                        <NavLink to="/aboutus" className="nav-link">About Us</NavLink>
                        <NavLink to="/commentlist" className="nav-link">Comment list</NavLink>


                        <NavDropdown title="Account" id="responsive-nav-dropdown" align="end">
                            {/* <NavDropdown.Item href='/commentlist'>Comment list</NavDropdown.Item>
                            {logInState ? (
                                <>
                                    <NavDropdown.Item href="/postcomment">postcomment</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout} className="dropdown-item" id='dropdown-item-button'>Logout</NavDropdown.Item>
                                </>
                            ) : (
                                <>
                                    <NavDropdown.Item href="/signup">Sign up</NavDropdown.Item>
                                    <NavDropdown.Item href="/signin">Sign in</NavDropdown.Item>
                                </>
                            )} */}

                            {/* <NavLink to="/commentlist" className="nav-link">Comment list</NavLink> */}
                            {logInState ? (
                                <>
                                    <NavLink to="/postcomment" className="nav-link">Post comment</NavLink>
                                    <NavLink to="/shoppingchart" className="nav-link">Shopping Cart</NavLink>
                                    <NavDropdown.Divider />
                                    <NavLink onClick={handleLogout} className="nav-link" id='dropdown-item-button'>Logout</NavLink>
                                    {/* <button onClick={handleLogout} id='dropdown-item-button'>Logout</button><br /> */}

                                </>
                            ) : (
                                <>
                                    <NavLink to="/signup" className="nav-link">Sign up</NavLink>
                                    <NavLink to="/signin" className="nav-link">Sign in</NavLink>
                                </>
                            )}

                            {/* <NavLink to="/shoppingchart" className="nav-link">Shopping Cart</NavLink> */}
                        </NavDropdown>


                    </Nav>
                </Navbar.Collapse>


            </Container>
        </Navbar>
    )
}

export default NavigationBar