import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'

const Header = ({ logInState, handleLogout }) => {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        // update every second
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        // stop if component unmounted
        return () => { clearInterval(interval) }
    }, [])

    return (
        <header>
            <h1>China Kitchen</h1>
            <h2>{currentTime.toLocaleTimeString()}</h2>

            <Link to="/" >Home</Link><br />
            {logInState ? (
                <>
                    <Link to="/postcomment">Post comment</Link><br />
                    <button onClick={handleLogout}>Logout</button><br />
                </>
            ) : (
                <>
                    <Link to="/signup">Sign up</Link><br />
                    <Link to="/signin">Sign in</Link>
                </>
            )}
        </header>
    )
}

export default Header