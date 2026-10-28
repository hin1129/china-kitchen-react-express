// import React from 'react'

// const MyHome = () => {
//     return (
//         <div>
//             <p>MyHome</p><br />
//             <p>MyHome</p><br />
//             <p>MyHome</p><br />
//             <p>MyHome</p><br />
//             <p>MyHome</p><br />
//             <p>MyHome</p><br />
//             <p>MyHome</p><br />
//         </div>
//     )
// }

// export default MyHome
import React from 'react';
import { Link } from 'react-router-dom';


const MyHome = () => {

    return (

        <div className="container mt-5">

            <div className="text-center">
                <h1>China Kitchen</h1>
                <p className="lead">
                    Chinese takeaway offering
                    collection and local delivery.
                </p>
                <Link to="/takeaway" className="btn btn-danger btn-lg mt-3">Order Online</Link>
            </div>


            <hr className="my-5" />


            <div className="row">
                <div className="col-md-4">
                    <h4>Collection</h4>
                    <p>
                        Order online and collect
                        directly from the restaurant.
                    </p>
                </div>

                <div className="col-md-4">
                    <h4>Local Delivery</h4>
                    <p>
                        Delivery is available
                        within selected local
                        postcode areas.
                    </p>
                </div>

                <div className="col-md-4">
                    <h4>Freshly Prepared</h4>
                    <p>
                        Browse our menu and
                        choose from a range of
                        Chinese dishes.
                    </p>
                </div>
            </div>


            <hr className="my-5" />

            <div>
                <h3>Opening Hours</h3>
                <p>
                    Add your real restaurant
                    opening hours here.
                </p>
                <h3>Contact</h3>
                <p>
                    Add your real restaurant
                    phone number and address here.
                </p>
            </div>

        </div>
    );
};

export default MyHome;