import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminMenu = () => {
    const [menu, setMenu] = useState(null);
    const [error, setError] = useState('');

    const fetchMenu = async () => {
        try {
            const response = await axios.get('http://localhost:8000/takeaway');
            setMenu(response.data);
        } catch (error) {
            console.error(error);
            setError('Failed to load menu');
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const updateStock = async (itemId, currentStatus) => {
        try {
            await axios.put(
                `http://localhost:8000/admin/menu/${itemId}/stock`,
                { inStock: !currentStatus },
                { withCredentials: true }
            );

            fetchMenu();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to update stock');
        }
    };

    if (error) {
        return (
            <div className="container mt-4">
                <p>{error}</p>
            </div>
        );
    }

    if (!menu) {
        return (
            <div className="container mt-4">
                <p>Loading menu...</p>
            </div>
        );
    }

    const renderItem = (item) => (
        <div key={item.id} className="card mb-2">
            <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                    <strong>{item.name}</strong>
                    <br />
                    £{Number(item.price).toFixed(2)}
                    <br />
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                </div>

                <button
                    className={item.inStock ? 'btn btn-danger' : 'btn btn-success'}
                    onClick={() => updateStock(item.id, item.inStock)}
                >
                    {item.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="container mt-4">
            <h2>Admin - Menu Stock</h2>

            {menu.categories.map((category) => (
                <div key={category.categoryName} className="mb-4">
                    <h4>{category.categoryName}</h4>
                    {category.items.map(renderItem)}
                </div>
            ))}

            <h4>Set Meals</h4>
            {menu.setMeals.map(renderItem)}

            <h4 className="mt-4">Mix & Match</h4>
            {menu.mixAndMatch.map(renderItem)}
        </div>
    );
};

export default AdminMenu;
