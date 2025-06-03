// import React from "react";
// import { Table, Button } from "react-bootstrap";

// const ShoppingCart = ({ cartItems, updateCart, removeItem, submitOrder }) => {
//     // Handler to update quantity, ensure number and minimum 1
//     const handleQuantityChange = (id, value) => {
//         const quantity = Math.max(1, Number(value)); // force minimum 1
//         updateCart(id, quantity);
//     };

//     return (
//         <div>
//             <h3>Shopping cartItems</h3>
//             {cartItems.length === 0 ? (
//                 <p>Your cartItems is empty.</p>
//             ) : (
//                 <Table striped bordered hover>
//                     <thead>
//                         <tr>
//                             <th>Dish Name</th>
//                             <th>Quantity</th>
//                             <th>Rice Option (if any)</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {cartItems.map((item) => (
//                             <tr key={item.id}>
//                                 <td>{item.dishName}</td>
//                                 <td>
//                                     <input
//                                         type="number"
//                                         min="1"
//                                         value={item.quantity}
//                                         onChange={(e) => handleQuantityChange(item.id, e.target.value)}
//                                         style={{ width: "60px" }}
//                                     />
//                                 </td>
//                                 <td>{item.riceOption || "N/A"}</td>
//                                 <td>
//                                     <Button variant="danger" onClick={() => removeItem(item.id)}>
//                                         Remove
//                                     </Button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>
//             )}

//             {cartItems.length > 0 && (
//                 <Button variant="success" onClick={submitOrder}>
//                     Submit Order
//                 </Button>
//             )}
//         </div>
//     );
// };

// export default ShoppingCart;




import React from "react";
import { Table, Button } from "react-bootstrap";


// retrieve data from TakeawayChinese
const ShoppingCart = ({ cartItems }) => {

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="mt-5">
            <h3>Cart Items</h3>

            {cartItems.length === 0 ? (
                <p>Your cartItems is empty</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Dish</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cartItems.map((item, index) => (
                            <tr key={index}>
                                <td>{item.dishId}</td>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>£{item.price.toFixed(2)}</td>
                                <td>£{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}

                        <tr>
                            <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</td>
                            <td style={{ fontWeight: 'bold' }}>£{totalPrice.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default ShoppingCart;