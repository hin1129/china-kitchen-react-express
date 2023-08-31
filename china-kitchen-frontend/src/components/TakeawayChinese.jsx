import React from 'react'
import { Container, Table, Row, Col, ListGroup } from 'react-bootstrap'

const TakeawayChinese = () => {

    const categories = [
        {
            categoryName: "Appetisers",
            items: [
                { id: 1, name: "Mixed Hors D'oeuvres - For 2 people<br />(Dry Honey Spare Ribs, Prawn on Toast, Spring Rolls, Seaweed)", price: 10.00 },
                { id: 2, name: "Mixed Vegetarian Platter", price: 9.00 },
            ]
        },
        {
            categoryName: "Soup",
            items: [
                { id: 26, name: "Won Ton Soup", price: 4.50 },
                { id: 27, name: "Hot & Sour Soup", price: 4.00 },
            ]
        },
    ];

    const riceItems = ["Boiled rice", "Egg fried rice"];
    const dishItems = [
        "Deep Fried Chicken Katsu with Curry Sauce",
        "Sweet & Sour Chicken Hong Kong Style",
        "Roast Duck",
        " Roast Pork",
        "Pork with Green Pepper in Black Bean Sauce",
        "Stir Fried Pork with Chilli",
        "Salt & Pepper Pork",
        "Scrambled Egg with Beef",
        "Tomato Beef",
        "Stir Fried Beef with Chilli",
        "Beef with Black Pepper Sauce",
        "Beef Brisket Hong Kong Style#",
        "Sea Spicy Aubergines with Minced Pork",
        "Mapo Tofu with Minced Beef",
        "Double Cooked Pork Slices",
    ];

    const renderTableHeader = (category) => {
        return <thead>
            <h4>{category.categoryName}</h4>
            <tr>
                <th>Dish number</th>
                <th>Dish name</th>
                <th>Price (£)</th>
            </tr>
        </thead>
    }
    const renderCategoryTable = (category) => (
        <Table key={category.categoryName} striped hover responsive>
            {renderTableHeader(category)}
            <tbody>
                {category.items.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td dangerouslySetInnerHTML={{ __html: item.name }} />
                        <td>{item.price}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    const mixAndMatchSection = () => {
        let itemNumber = 137
        return (
            <>
                <h3>Mix & Match</h3>
                <Row>
                    <Col>
                        <ListGroup as="ul">
                            <h4>Rice</h4>
                            <p>Pick 1 of the below</p>
                            {riceItems.map((item, index) => (
                                <ListGroup.Item key={index} as="li">
                                    {item}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>

                    <Col>
                        <ListGroup as="ol">
                            <h4>Dishes</h4>
                            <p>Combined with 1 of the below options</p>
                            {dishItems.map((item, index) => (
                                <ListGroup.Item key={index} as="li" >
                                    {`${itemNumber++}. ${item}`}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
                <hr />
            </>
        );
    }

    const setMeal = () => {
        return <Table striped hover responsive bordered>
            <thead>
                <h4>Set Dinners</h4>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price (£)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>A</td>
                    <td>For 1 person<br />Sweet & Sour Chicken Balls<br />Beef with Green Pepper in Black Bean Sauce<br />Egg Fried Rice</td>
                    <td>10.80</td>
                </tr>
                <tr>
                    <td>B</td>
                    <td>For 2 persons<br />Satay Chicken on Skewers<br />Vegetarian Spring Rolls<br />Crispy Fried Shredded Chilli Beef<br />Sweet & Sour Pork Hong Kong Style<br />Chicken with Cashew Nuts<br />Special Fried Rice</td>
                    <td>25.80</td>
                </tr>
                <tr>
                    <td>C</td>
                    <td>For 2 persons<br />Mixed Platter <br />Beef with Ginger & Spring Onions<br />Kong Po Chicken<br />Stir Fried Mixed Vegetables<br />Special Fried Rice</td>
                    <td>26.80</td>
                </tr>
            </tbody>
        </Table>;
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h3>Menu</h3>
                    {categories.map(category => renderCategoryTable(category))}
                </Col>

                <Col>
                    {mixAndMatchSection()}
                    <h4>Set Dinners</h4>
                    {setMeal()}
                </Col>
            </Row>

            <hr />
        </Container>
    )

}

export default TakeawayChinese