import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';

function MixAndMatchSectionChinese({ items, quantities, riceOptions, onQtyChange, onRiceChange, onAdd }) {
    return (
        <div>
            <h3 className="mt-4">Mix & Match</h3>
            <Table striped hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Dish</th>
                        <th>Base Price</th>
                        <th>Rice</th>
                        <th>Qty</th>
                        <th>Add</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => {
                        const key = `Mix & Match-${item.id}`;
                        const quantity = quantities[key] || 0;
                        const rice = riceOptions[key] || 'Boiled Rice';

                        return (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>£{item.price.toFixed(2)}</td>
                                <td>
                                    <Form.Select
                                        value={rice}
                                        onChange={(e) => onRiceChange(key, e.target.value)}
                                    >
                                        <option value="Boiled Rice">Boiled Rice</option>
                                        <option value="Egg Fried Rice">Egg Fried Rice (+£0.20)</option>
                                    </Form.Select>
                                </td>
                                <td style={{ minWidth: '70px', maxWidth: '80px' }}>
                                    <Form.Control
                                        type="number"
                                        value={quantity}
                                        min="0"
                                        onChange={(e) => onQtyChange(key, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Button variant="success" onClick={() => onAdd(item)}>
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
}

export default MixAndMatchSectionChinese;
