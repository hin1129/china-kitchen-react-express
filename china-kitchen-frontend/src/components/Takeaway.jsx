import React from 'react'
import { Table, Row, Col, ListGroup } from 'react-bootstrap'

const Takeaway = () => {
    return (
        <>
            {/* left */}
            <Row>
                <Col sm={6}>
                    <h3>Menu</h3>
                    <Table striped hover responsive>

                        {/* Appetisers */}
                        <thead>
                            <h4>Appetisers</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
                                <th>Price (£)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Mixed Hors D'oeuvres - For 2 people<br />(Dry Honey Spare Ribs, Prawn on Toast, Spring Rools, Seaweed)</td>
                                <td>10.00</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Mixed Vegetarian Platter - For 2 people<br />(Salt&Pepper Aubergine, Satay Bean Curd on Skewers, Spring Rools, Seaweed)</td>
                                <td>9.00</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Crispy Seaweed</td>
                                <td>4.60</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>Vegetarian Spring Roll</td>
                                <td>3.00</td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>Crispy Pancake Roll</td>
                                <td>3.20</td>
                            </tr>
                            <tr>
                                <td>6</td>
                                <td>Mini Spring Roll</td>
                                <td>3.00</td>
                            </tr>
                            <tr>
                                <td>7</td>
                                <td>Sesame Prawn on Toast</td>
                                <td>5.40</td>
                            </tr>
                            <tr>
                                <td>8</td>
                                <td>Salt & Pepper Crispy Shredded Beef</td>
                                <td>6.00</td>
                            </tr>
                            <tr>
                                <td>9</td>
                                <td>Satay Chicken on Skewers</td>
                                <td>6.00</td>
                            </tr>
                            <tr>
                                <td>10</td>
                                <td>Satay Bean Curd on Skewers</td>
                                <td>5.00</td>
                            </tr>
                            <tr>
                                <td>11</td>
                                <td>Barbecue Spare Ribs</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>12</td>
                                <td>Korean Fried Chicken Wings</td>
                                <td>6.00</td>
                            </tr>
                            <tr>
                                <td>13</td>
                                <td>Dry Honey Spare Ribs</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>14</td>
                                <td>Salt & Pepper Spare Ribs</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>15</td>
                                <td>Salt & Pepper King Prawns</td>
                                <td>6.40</td>
                            </tr>
                            <tr>
                                <td>16</td>
                                <td>Salt & Pepper Squid</td>
                                <td>6.30</td>
                            </tr>
                            <tr>
                                <td>17</td>
                                <td>Salt & Pepper Chicken</td>
                                <td>5.50</td>
                            </tr>
                            <tr>
                                <td>18</td>
                                <td>Salt & Pepper Chicken Wings</td>
                                <td>5.80</td>
                            </tr>
                            <tr>
                                <td>19</td>
                                <td>Salt & Pepper Aubergine</td>
                                <td>5.00</td>
                            </tr>
                            <tr>
                                <td>20</td>
                                <td>Salt & Pepper Bean Curd</td>
                                <td>5.00</td>
                            </tr>
                            <tr>
                                <td>21</td>
                                <td>Salt & Pepper Chips</td>
                                <td>4.50</td>
                            </tr>
                            <tr>
                                <td>22</td>
                                <td>Grilled Pork Dumpings</td>
                                <td>5.80</td>
                            </tr>
                            <tr>
                                <td>23</td>
                                <td>Crispy Chicken Gyoza</td>
                                <td>5.60</td>
                            </tr>
                            <tr>
                                <td>24</td>
                                <td>Prawn Crackers</td>
                                <td>2.60</td>
                            </tr>
                            <tr>
                                <td>25</td>
                                <td>Crispy Vegetarian Gyoza</td>
                                <td>5.40</td>
                            </tr>
                        </tbody>
                    </Table >

                    <Table striped hover responsive>
                        {/* Soup */}
                        <thead>
                            <h4>Soup</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
                                <th>Price (£)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>26</td>
                                <td>Won Ton Soup</td>
                                <td>4.50</td>
                            </tr>
                            <tr>
                                <td>27</td>
                                <td>Hot & Sour Soup</td>
                                <td>4.00</td>
                            </tr>
                            <tr>
                                <td>28</td>
                                <td>Chicken & Sweetcorn Soup</td>
                                <td>4.00</td>
                            </tr>
                            <tr>
                                <td>29</td>
                                <td>Chicken & Mushroom Soup</td>
                                <td>4.00</td>
                            </tr>
                            <tr>
                                <td>30</td>
                                <td>Chicken & Noodle Soup</td>
                                <td>4.00</td>
                            </tr>
                        </tbody>
                    </Table >

                    <Table striped hover responsive>
                        {/* Duck */}
                        <thead>
                            <h4>Duck</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
                                <th>Price (£)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>31</td>
                                <td>Crispy Aromatic Duck<br />(Served with Pancakes, Cucumbers,<br /> Spring Onion, Hoi Sin Sauce)<br />Quarter (with 6 Pancakes)<br />Half (with 12 Pancakes)</td>
                                <td><br /><br /><br />10.00<br />19.00</td>
                            </tr>
                            <tr>
                                <td>32</td>
                                <td>Roast Duck Cantonese Style</td>
                                <td>7.20</td>
                            </tr>
                            <tr>
                                <td>33</td>
                                <td>Stir Fried Duck with Special Soy Sauce</td>
                                <td>7.20</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Table striped hover responsive>
                        {/* Roast Pork */}
                        <thead>
                            <h4>Roast Pork</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
                                <th>Price (£)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>34</td>
                                <td>Char Siu Roast Pork</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>35</td>
                                <td>Stir Fried Char Siu Roast Pork with Special Soy Sauce</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>36</td>
                                <td>Char Siu Roast Pork Szechuan Style</td>
                                <td>6.20</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Table striped hover responsive>
                        {/* Chicken */}
                        <thead>
                            <h4>Chicken</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
                                <th>Price (£)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>37</td>
                                <td>Chicken with Green Pepper in Black Bean Sauce</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>38</td>
                                <td>Chicken with Satay Sauce</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>39</td>
                                <td>Chicken Szechuan Style</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>40</td>
                                <td>Chicken with Cashew Nuts in Yellow Bean Sauce</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>41</td>
                                <td>Chicken with Ginger & Spring Onion</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>42</td>
                                <td>Chicken with Mushrooms</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>43</td>
                                <td>Chicken with Cashew Nuts</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>44</td>
                                <td>Chicken with Bamboo Shoots & Water Chestnuts</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>45</td>
                                <td>Chicken with Pineapple</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>46</td>
                                <td>Grilled Chicken with Lemon Sauce</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>47</td>
                                <td>Kung Po Chicken</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>48</td>
                                <td>Chicken with Mange Tout</td>
                                <td>6.20</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Table striped hover responsive>
                        {/* Beef */}
                        <thead>
                            <h4>Beef</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
                                <th>Price (£)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>49</td>
                                <td>Beef with Green Pepper in Black Bean Sauce</td>
                                <td>6.40</td>
                            </tr>
                            <tr>
                                <td>50</td>
                                <td>Beef with Satay Sauce</td>
                                <td>6.40</td>
                            </tr>
                            <tr>
                                <td>51</td>
                                <td>Beef Szechuan Style</td>
                                <td>6.40</td>
                            </tr>
                            <tr>
                                <td>52</td>
                                <td>Beef with Ginger & Spring Onion</td>
                                <td>6.40</td>
                            </tr>
                            <tr>
                                <td>53</td>
                                <td>Beef with Mushrooms</td>
                                <td>6.40</td>
                            </tr>
                            <tr>
                                <td>54</td>
                                <td>Beef with Black Pepper Sauce</td>
                                <td>6.40</td>
                            </tr>
                            <tr>
                                <td>55</td>
                                <td>Beef with Cantonese Sauce</td>
                                <td>6.40</td>
                            </tr>
                            <tr>
                                <td>56</td>
                                <td>Beef with Mange Tout</td>
                                <td>6.40</td>
                            </tr>
                            <tr>
                                <td>57</td>
                                <td>Crispy Fried Shredded Chilli Beef</td>
                                <td>6.50</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Table striped hover responsive>
                        {/* King Prawn */}
                        <thead>
                            <h4>King Prawn</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
                                <th>Price (£)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>58</td>
                                <td>King Prawn with Green Pepper in Black Bean Sauce</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>59</td>
                                <td>King Prawn with Satay Sauce</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>60</td>
                                <td>King Prawn Szechuan Style</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>61</td>
                                <td>King Prawn with Ginger & Spring Onion</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>62</td>
                                <td>King Prawn with Cashew Nuts in Yellow Bean Sauce</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>63</td>
                                <td>King Prawn with Mushrooms</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>64</td>
                                <td>King Prawn with Cashew Nuts</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>65</td>
                                <td>King Prawn Garlic & Butter Sauce</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>66</td>
                                <td>Kung Po King Prawn</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>67</td>
                                <td>King Prawn with Mange Tout</td>
                                <td>7.00</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Table striped hover responsive>
                        {/* Sweet & Sour */}
                        <thead>
                            <h4>Sweet & Sour</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
                                <th>Price (£)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>68</td>
                                <td>Sweet & Sour Prawn Balls with Sweet & Sour Sauce</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>69</td>
                                <td>Sweet & Sour King Prawn Hong Kong Style</td>
                                <td>6.59</td>
                            </tr>
                            <tr>
                                <td>70</td>
                                <td>Sweet & Sour Chicken Balls with Sweet & Sour Sauce</td>
                                <td>6.60</td>
                            </tr>
                            <tr>
                                <td>71</td>
                                <td>Sweet & Sour Chicken Hong Kong Style</td>
                                <td>6.30</td>
                            </tr>
                            <tr>
                                <td>72</td>
                                <td>Sweet & Sour Pork Hong Kong Style</td>
                                <td>6.30</td>
                            </tr>
                            <tr>
                                <td>73</td>
                                <td>Sweet & Sour Spare Ribs</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>74</td>
                                <td>Sweet & Sour Mixed Vegatables</td>
                                <td>5.20</td>
                            </tr>
                            <tr>
                                <td>75</td>
                                <td>Sweet & Sour Sauce</td>
                                <td>2.40</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Table striped hover responsive>
                        {/* Curry */}
                        <thead>
                            <h4>Curry</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
                                <th>Price (£)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>76</td>
                                <td>House Special Curry<br />(Prawns & Mixed Meats)</td>
                                <td>6.40</td>
                            </tr>
                            <tr>
                                <td>77</td>
                                <td>King Prawn Curry</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>78</td>
                                <td>Chicken Curry</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>79</td>
                                <td>Beef Curry</td>
                                <td>6.40</td>
                            </tr>
                            <tr>
                                <td>80</td>
                                <td>Mixed Vegatables Curry</td>
                                <td>5.20</td>
                            </tr>
                            <tr>
                                <td>81</td>
                                <td>Mushroom Curry</td>
                                <td>5.00</td>
                            </tr>
                            <tr>
                                <td>82</td>
                                <td>Curry Sauce</td>
                                <td>2.40</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Table striped hover responsive>
                        {/* Chow Mein */}
                        <thead>
                            <h4>Chow Mein</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
                                <th>Price (£)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>83</td>
                                <td>Assorted Mixed Meat with Chow Mein<br />(Prawns, Mixed Meats, Vegetables with Sauce)</td>
                                <td>7.20</td>
                            </tr>
                            <tr>
                                <td>84</td>
                                <td>Special Chow Mein</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>85</td>
                                <td>King Prawn Chow Mein</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>86</td>
                                <td>Chicken Chow Mein</td>
                                <td>6.00</td>
                            </tr>
                            <tr>
                                <td>87</td>
                                <td>Beef Chow Mein</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>88</td>
                                <td>Vegatable Chow Mein</td>
                                <td>5.50</td>
                            </tr>
                            <tr>
                                <td>89</td>
                                <td>Plain Chow Mein with Beansprouts & Onion</td>
                                <td>5.00</td>
                            </tr>
                            <tr>
                                <td>90</td>
                                <td>Singapore Noodles<br />(Rice Noodles)</td>
                                <td>6.50</td>
                            </tr>
                            <tr>
                                <td>91</td>
                                <td>Vegetarian Singapore Noodles<br />(Rice Noodles)</td>
                                <td>6.30</td>
                            </tr>
                            <tr>
                                <td>92</td>
                                <td>Beef Ho Fun<br />(Flat Noodles)</td>
                                <td>8.50</td>
                            </tr>
                            <tr>
                                <td>93</td>
                                <td>Special Beef Ho Fun with Black Bean Sauce<br />(Flat Noodles)</td>
                                <td>8.50</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Table striped hover responsive>
                        {/* Rice */}
                        <thead>
                            <h4>Rice</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
                                <th>Price (£)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>94</td>
                                <td>Assorted Mixed Meat with Egg Fried Rice<br />(Prawns, Mixed Meats, Vegetables with Sauce)</td>
                                <td>7.20</td>
                            </tr>
                            <tr>
                                <td>95</td>
                                <td>Special Fried Rice</td>
                                <td>5.80</td>
                            </tr>
                            <tr>
                                <td>96</td>
                                <td>China Kitchen House Special Fried Rice</td>
                                <td>6.00</td>
                            </tr>
                            <tr>
                                <td>97</td>
                                <td>Singapore Fried Rice</td>
                                <td>6.00</td>
                            </tr>
                            <tr>
                                <td>98</td>
                                <td>King Prawn Fried Rice</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>99</td>
                                <td>Chicken Fried Rice</td>
                                <td>5.50</td>
                            </tr>
                            <tr>
                                <td>100</td>
                                <td>Beef Fried Rice</td>
                                <td>5.50</td>
                            </tr>
                            <tr>
                                <td>101</td>
                                <td>Vegetable Fried Rice</td>
                                <td>5.00</td>
                            </tr>
                            <tr>
                                <td>102</td>
                                <td>Egg Fried Rice</td>
                                <td>4.50</td>
                            </tr>
                            <tr>
                                <td>103</td>
                                <td>Boiled Rice</td>
                                <td>3.20</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Table striped hover responsive>
                        {/* Chop Suey */}
                        <thead>
                            <h4>Chop Suey</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
                                <th>Price (£)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>104</td>
                                <td>House Special Chop Suey<br />(Prawns & Mixed Meats)</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>105</td>
                                <td>King Prawn Chop Suey</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>106</td>
                                <td>Chicken Chop Suey</td>
                                <td>5.80</td>
                            </tr>
                            <tr>
                                <td>107</td>
                                <td>Beef Chop Suey</td>
                                <td>5.80</td>
                            </tr>
                            <tr>
                                <td>108</td>
                                <td>Roast Pork Chop Suey</td>
                                <td>5.80</td>
                            </tr>
                            <tr>
                                <td>109</td>
                                <td>Mushroom Chop Suey</td>
                                <td>5.20</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Table striped hover responsive>
                        {/* Egg Fu Yung & Side */}
                        <thead>
                            <h4>Egg Fu Yung & Side</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
                                <th>Price (£)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>110</td>
                                <td>House Special Egg Fu Yung<br />(Prawns & Mixed Meats)</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>111</td>
                                <td>Chicken Egg Fu Yung</td>
                                <td>5.80</td>
                            </tr>
                            <tr>
                                <td>112</td>
                                <td>King Prawn Egg Fu Yung</td>
                                <td>7.00</td>
                            </tr>
                            <tr>
                                <td>113</td>
                                <td>Mushroom Egg Fu Yung</td>
                                <td>5.30</td>
                            </tr>
                            <tr>
                                <td>114</td>
                                <td>Plain Omeletter & Chips</td>
                                <td>5.90</td>
                            </tr>
                            <tr>
                                <td>115</td>
                                <td>Roast Chicken & Chips</td>
                                <td>6.20</td>
                            </tr>
                            <tr>
                                <td>116</td>
                                <td>Chips</td>
                                <td>3.00</td>
                            </tr>
                            <tr>
                                <td>117</td>
                                <td>Crispy Noodles</td>
                                <td>2.80</td>
                            </tr>
                            <tr>
                                <td>118</td>
                                <td>Barcecue Sauce</td>
                                <td>2.40</td>
                            </tr>
                            <tr>
                                <td>119</td>
                                <td>Satay Sauce</td>
                                <td>2.80</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Table striped hover responsive>
                        {/* Vegetarian */}
                        <thead>
                            <h4>Vegetarian</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
                                <th>Price (£)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>120</td>
                                <td>Stir Fried Mixed Vegetables with Cashew Nuts</td>
                                <td>5.80</td>
                            </tr>
                            <tr>
                                <td>121</td>
                                <td>Stir Fried Mixed Vegetables</td>
                                <td>5.20</td>
                            </tr>
                            <tr>
                                <td>122</td>
                                <td>Stir Fried Mixed Vegetables with Black Bean Sauce</td>
                                <td>5.20</td>
                            </tr>
                            <tr>
                                <td>123</td>
                                <td>Stir Fried Chinese Cabbage in Vinegar</td>
                                <td>5.50</td>
                            </tr>
                            <tr>
                                <td>124</td>
                                <td>Aubergine with Green Pepper in Black Bean Sauce</td>
                                <td>5.20</td>
                            </tr>
                            <tr>
                                <td>125</td>
                                <td>Aubergine Szechuan Style</td>
                                <td>5.20</td>
                            </tr>
                            <tr>
                                <td>126</td>
                                <td>Stir Fried Beansprouts with Mange Tout</td>
                                <td>5.20</td>
                            </tr>
                            <tr>
                                <td>127</td>
                                <td>Stir Fried Beansprouts</td>
                                <td>4.80</td>
                            </tr>
                            <tr>
                                <td>128</td>
                                <td>Stir Fried Broccoli</td>
                                <td>5.20</td>
                            </tr>
                            <tr>
                                <td>129</td>
                                <td>Stir Fried Mushroom</td>
                                <td>4.80</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Table striped hover responsive>
                        {/* Bean Curd  */}
                        <thead>
                            <h4>Bean Curd</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
                                <th>Price (£)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>130</td>
                                <td>Bean Curd with Ginger & Spring Onion</td>
                                <td>5.20</td>
                            </tr>
                            <tr>
                                <td>131</td>
                                <td>Bean Curd with Green Pepper in Black Bean Sauce</td>
                                <td>5.20</td>
                            </tr>
                            <tr>
                                <td>132</td>
                                <td>Bean Curd with Satay Sauce</td>
                                <td>5.20</td>
                            </tr>
                            <tr>
                                <td>133</td>
                                <td>Bean Curd Szechuan Style</td>
                                <td>5.20</td>
                            </tr>
                            <tr>
                                <td>134</td>
                                <td>Kung Po Bean Curd</td>
                                <td>5.20</td>
                            </tr>
                            <tr>
                                <td>135</td>
                                <td>Bean Curd with Sweet & Sour Sauce</td>
                                <td>5.20</td>
                            </tr>
                            <tr>
                                <td>136</td>
                                <td>Bean Curd with Cashew Nuts in Yellow Bean Sauce</td>
                                <td>5.20</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>

                {/* right */}
                <Col>
                    <h3>Mix & Match</h3>
                    <Row>
                        <Col >
                            <ListGroup as="ul" >
                                <h4>Rice</h4>
                                <p>Pick 1 of the below</p>
                                <ListGroup.Item as="li">Boiled rice</ListGroup.Item>
                                <ListGroup.Item as="li">Egg fried rice</ListGroup.Item>
                            </ListGroup>
                        </Col>

                        <Col>
                            <ListGroup as="ol" numbered>
                                <h4>Dishes</h4>
                                <p>Combined with 1 of the below options</p>
                                <ListGroup.Item as="li">Deep Fried Chicken Katsu with Curry Sauce</ListGroup.Item>
                                <ListGroup.Item as="li">Sweet & Sour Chicken Hong Kong Style</ListGroup.Item>
                                <ListGroup.Item as="li">Roast Duck</ListGroup.Item>
                                <ListGroup.Item as="li">Roast Pork</ListGroup.Item>
                                <ListGroup.Item as="li">Pork with Green Pepper in Black Bean Sauce</ListGroup.Item>
                                <ListGroup.Item as="li">Stir Fried Pork with Chilli</ListGroup.Item>
                                <ListGroup.Item as="li">Salt & Pepper Pork</ListGroup.Item>
                                <ListGroup.Item as="li">Scrambled Egg with Beef</ListGroup.Item>
                                <ListGroup.Item as="li">Tomato Beef</ListGroup.Item>
                                <ListGroup.Item as="li">Stir Fried Beef with Chilli</ListGroup.Item>
                                <ListGroup.Item as="li">Beef with Black Pepper Sauce</ListGroup.Item>
                                <ListGroup.Item as="li">Beef Brisket Hong Kong Style</ListGroup.Item>
                                <ListGroup.Item as="li">Sea Spicy Aubergines with Minced Pork</ListGroup.Item>
                                <ListGroup.Item as="li">Mapo Tofu with Minced Beef</ListGroup.Item>
                                <ListGroup.Item as="li">Double Cooked Pork Slices </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                    <hr />

                    <Table striped hover responsive bordered>
                        <thead>
                            <h4>Appetisers</h4>
                            <tr>
                                <th>Dish number</th>
                                <th>Dish name</th>
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
                                <td>For 2 persons<br />Mixed Vegetarian Platter (For 2 persons)<br />Beef with Ginger & Spring Onions<br />Kong Po Chicken<br />Stir Fried Mixed Vegetables<br />Special Fried Rice</td>
                                <td>26.80</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>

            </Row>
            <hr />
        </>
    )
}

export default Takeaway