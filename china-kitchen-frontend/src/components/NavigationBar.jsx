import React, { useState } from 'react'
import { Container, Nav, NavDropdown, Navbar, NavbarBrand, Button, Offcanvas } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'

const NavigationBar = ({ logInState, handleLogout }) => {
    return (
        // <div>
        //     <NavLink to="/" >Home</NavLink><br />
        //     <NavLink to="/takeaways" >Takeaways</NavLink><br />
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
                        src="../../public/logo192.png"
                        alt="Logo"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />
                    Logo
                </Navbar.Brand>

                {/* appear when minimized */}
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto justify-content-between" >
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href='/takeaway'>Takeaway Menu</Nav.Link>
                        <Nav.Link href='/takeawaychinese'>Takeaway Chinese Menu</Nav.Link>
                        <Nav.Link href='/aboutus'>About Us</Nav.Link>

                        <NavDropdown title="Comment" id="responsive-nav-dropdown" align="end">
                            <NavDropdown.Item href='/commentlist'>Comment list</NavDropdown.Item>

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
                            )}
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>


            </Container>
        </Navbar>
    )
}

export default NavigationBar