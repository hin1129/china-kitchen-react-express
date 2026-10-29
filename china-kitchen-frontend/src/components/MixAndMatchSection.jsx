import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';

const MixAndMatchSection = ({
    items,
    quantities,
    riceOptions,
    handleQuantityChange,
    handleRiceOptionChange,
    handleAddToCartMixAndMatch,
}) => {
    return (
        <div>
            <h3 className="mt-4">Mix & Match</h3>

            <Table striped hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Dish</th>
                        <th>Base Price</th>
                        <th>Rice Option</th>
                        <th>Quantity</th>
                        <th>Add</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item) => {
                        const key = `Mix & Match-${item.id}`;
                        const quantity = quantities[key] || 0;
                        const availableRiceOptions = item.riceOptions || [];
                        const defaultRice = availableRiceOptions[0]?.type || '';
                        const rice = riceOptions[key] || defaultRice;
                        const isOutOfStock = item.inStock === false;

                        return (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>
                                    {item.name}
                                    {isOutOfStock && (
                                        <span style={{ color: 'red' }}> (Out of stock)</span>
                                    )}
                                </td>
                                <td>£{Number(item.price).toFixed(2)}</td>

                                <td>
                                    <Form.Select
                                        value={rice}
                                        onChange={(event) =>
                                            handleRiceOptionChange(key, event.target.value)
                                        }
                                        disabled={isOutOfStock || availableRiceOptions.length === 0}
                                    >
                                        {availableRiceOptions.map((riceOption) => (
                                            <option key={riceOption.type} value={riceOption.type}>
                                                {riceOption.type}
                                                {Number(riceOption.extraCost || 0) > 0
                                                    ? ` (+£${Number(riceOption.extraCost).toFixed(2)})`
                                                    : ''}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </td>

                                <td style={{ minWidth: '70px', maxWidth: '80px' }}>
                                    <Form.Control
                                        type="number"
                                        value={quantity}
                                        min="0"
                                        onChange={(event) =>
                                            handleQuantityChange(key, event.target.value)
                                        }
                                        disabled={isOutOfStock}
                                    />
                                </td>

                                <td>
                                    <Button
                                        variant="success"
                                        onClick={() => handleAddToCartMixAndMatch(item)}
                                        disabled={
                                            quantity === 0 ||
                                            isOutOfStock ||
                                            availableRiceOptions.length === 0
                                        }
                                    >
                                        Add
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

export default MixAndMatchSection;
