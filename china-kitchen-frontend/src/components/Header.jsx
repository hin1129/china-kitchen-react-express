import React, { useState, useEffect } from 'react'
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

const Header = () => {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        // update every second
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        // stop if component unmounted
        return () => { clearInterval(interval) }
    }, [])

    // background video/pic
    return (
        <>
            <header>
                <h1>China Kitchen</h1>
                <h2>{currentTime.toLocaleTimeString()}</h2>
            </header>

            {/* <Container>
                <Row>
                    <Col xs={6} md={4}>
                        <Image src="../../public/brighton2.jpg" rounded />
                    </Col>
                </Row>
            </Container> */}
        </>
    )
}

export default Header