import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminMenu = () => {
    const [menu, setMenu] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [priceInputs, setPriceInputs] = useState({});
    const [savingItemId, setSavingItemId] = useState('');

    const fetchMenu = async () => {
        try {
            setError('');
            const response = await axios.get('http://localhost:8000/takeaway');
            setMenu(response.data);

            const nextPriceInputs = {};
            for (const category of response.data.categories || []) {
                for (const item of category.items || []) {
                    nextPriceInputs[item.id] = Number(item.price).toFixed(2);
                }
            }
            for (const item of response.data.setMeals || []) {
                nextPriceInputs[item.id] = Number(item.price).toFixed(2);
            }
            for (const item of response.data.mixAndMatch || []) {
                nextPriceInputs[item.id] = Number(item.price).toFixed(2);
            }
            setPriceInputs(nextPriceInputs);
        }
        catch (error) {
            console.error(error);
            setError('Failed to load menu');
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const updateStock = async (itemId, currentStatus) => {
        try {
            setError('');
            setSuccess('');
            setSavingItemId(itemId);

            await axios.put(
                `http://localhost:8000/admin/menu/${encodeURIComponent(itemId)}/stock`,
                { inStock: !currentStatus },
                { withCredentials: true }
            );

            await fetchMenu();
            setSuccess(`Stock updated for item ${itemId}.`);
        }
        catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Failed to update stock');
        }
        finally {
            setSavingItemId('');
        }
    };

    const updatePrice = async (itemId) => {
        const rawPrice = priceInputs[itemId];
        const price = Number(rawPrice);

        if (rawPrice === '' || !Number.isFinite(price) || price <= 0 || price > 500) {
            setError('Price must be greater than £0 and no more than £500.');
            return;
        }

        try {
            setError('');
            setSuccess('');
            setSavingItemId(itemId);

            await axios.put(
                `http://localhost:8000/admin/menu/${encodeURIComponent(itemId)}/price`,
                { price },
                { withCredentials: true }
            );

            await fetchMenu();
            setSuccess(`Price updated for item ${itemId}.`);
        }
        catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Failed to update price');
        }
        finally {
            setSavingItemId('');
        }
    };

    if (!menu && error) {
        return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
    }

    if (!menu) {
        return <div className="container mt-4"><p>Loading menu...</p></div>;
    }

    const renderItem = (item) => {
        const isSaving = savingItemId === item.id;
        const currentPrice = Number(item.price).toFixed(2);
        const enteredPrice = priceInputs[item.id] ?? currentPrice;
        const priceChanged = Number(enteredPrice) !== Number(item.price);

        return (
            <div key={item.id} className="card mb-2">
                <div className="card-body">
                    <div className="row align-items-center g-3">
                        <div className="col-md-5">
                            <div className="text-muted small">Dish ID: {item.id}</div>
                            <strong>{item.name}</strong>
                            <div className="mt-1">Current price: <strong>£{currentPrice}</strong></div>
                            <div className={item.inStock ? 'text-success mt-1' : 'text-danger mt-1'}>
                                {item.inStock ? 'In Stock' : 'Out of Stock'}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label" htmlFor={`price-${item.id}`}>Price</label>
                            <div className="input-group">
                                <span className="input-group-text">£</span>
                                <input
                                    id={`price-${item.id}`}
                                    className="form-control"
                                    type="number"
                                    min="0.01"
                                    max="500"
                                    step="0.01"
                                    value={enteredPrice}
                                    disabled={isSaving}
                                    onChange={(event) => setPriceInputs(previous => ({
                                        ...previous,
                                        [item.id]: event.target.value
                                    }))}
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={isSaving || !priceChanged}
                                    onClick={() => updatePrice(item.id)}
                                >
                                    {isSaving ? 'Saving...' : 'Save Price'}
                                </button>
                            </div>
                        </div>

                        <div className="col-md-3 text-md-end">
                            <button
                                type="button"
                                className={item.inStock ? 'btn btn-outline-danger' : 'btn btn-outline-success'}
                                disabled={isSaving}
                                onClick={() => updateStock(item.id, item.inStock)}
                            >
                                {isSaving ? 'Saving...' : item.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mt-4 mb-5">
            <h2>Admin - Menu Management</h2>
            <p className="text-muted">Change dish prices and availability.</p>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

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
