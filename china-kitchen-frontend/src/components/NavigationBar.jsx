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


        <Navbar className="bg-body-tertiary" expand="lg" Navbar sticky='top' bg="dark" data-bs-theme="dark" >
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
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href='/takeaway'>Takeaway Menu</Nav.Link>
                        <Nav.Link href='/takeawaychinese'>Takeaway Chinese Menu</Nav.Link>
                        <Nav.Link href='/aboutus'>About Us</Nav.Link>

                        <NavDropdown title="Comment" id="basic-nav-dropdown" align="end">
                            <NavDropdown.Item href='/commentlist'>Comment list</NavDropdown.Item>
                            {logInState ? (
                                <>
                                    <NavLink to="/postcomment" className="dropdown-item">Post comment</NavLink>
                                    <NavDropdown.Divider />
                                    <button onClick={handleLogout} className="dropdown-item" id='dropdown-item-button'>Logout</button>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/signup" className="dropdown-item">Sign up</NavLink>
                                    <NavLink to="/signin" className="dropdown-item">Sign in</NavLink>
                                </>
                            )}

                            {/* {logInState ? (
                                <>
                                    <Link to="/postcomment" className="dropdown-item">Post comment</Link><br />
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                                </>
                            ) : (
                                <>
                                    <NavDropdown.Item href="/signup">Sign up</NavDropdown.Item>
                                    <NavDropdown.Item href="/signin">Sign in</NavDropdown.Item>
                                </>
                            )} */}
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>


            </Container>
        </Navbar>


    )
}

export default NavigationBar