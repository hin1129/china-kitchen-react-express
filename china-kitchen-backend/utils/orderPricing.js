// import Menu
//     from '../models/menu.model.js';


// // ==============================
// // FIND MENU ITEM
// // ==============================

// const findMenuItem =
//     (
//         menu,
//         dishId
//     ) => {


//         // Normal menu categories

//         for (
//             const category
//             of menu.categories
//         ) {

//             const item =
//                 category.items.find(
//                     (dish) =>
//                         dish.id ===
//                         dishId
//                 );


//             if (item) {

//                 return item;
//             }
//         }


//         // Set meals

//         const setMeal =
//             menu.setMeals.find(
//                 (dish) =>
//                     dish.id ===
//                     dishId
//             );


//         if (setMeal) {

//             return setMeal;
//         }


//         // Mix and Match

//         const mixAndMatch =
//             menu.mixAndMatch.find(
//                 (dish) =>
//                     dish.id ===
//                     dishId
//             );


//         if (mixAndMatch) {

//             return mixAndMatch;
//         }


//         return null;
//     };


// // ==============================
// // CALCULATE REAL CART
// // ==============================

// export const calculateOrderPricing =
//     async (cartItems) => {


//         if (
//             !cartItems ||

//             !Array.isArray(
//                 cartItems
//             ) ||

//             cartItems.length === 0
//         ) {

//             throw new Error(
//                 'Your cart is empty'
//             );
//         }


//         const menu =
//             await Menu.findOne();


//         if (!menu) {

//             throw new Error(
//                 'Menu is unavailable'
//             );
//         }


//         let subtotal = 0;


//         const validatedItems = [];


//         for (
//             const cartItem
//             of cartItems
//         ) {


//             const menuItem =
//                 findMenuItem(
//                     menu,
//                     cartItem.dishId
//                 );


//             if (!menuItem) {

//                 throw new Error(
//                     `Dish ${cartItem.dishId} does not exist`
//                 );
//             }


//             if (
//                 menuItem.inStock ===
//                 false
//             ) {

//                 throw new Error(
//                     `${menuItem.name} is currently out of stock`
//                 );
//             }


//             const quantity =
//                 Number(
//                     cartItem.quantity
//                 );


//             if (
//                 !Number.isInteger(
//                     quantity
//                 ) ||

//                 quantity <= 0
//             ) {

//                 throw new Error(
//                     `Invalid quantity for ${menuItem.name}`
//                 );
//             }


//             let unitPrice =
//                 Number(
//                     menuItem.price
//                 );


//             let rice = null;


//             // ==========================
//             // MIX AND MATCH RICE
//             // ==========================

//             if (
//                 cartItem.rice &&

//                 Array.isArray(
//                     menuItem.riceOptions
//                 )
//             ) {


//                 const riceOption =
//                     menuItem
//                         .riceOptions
//                         .find(
//                             (option) =>
//                                 option.type ===
//                                 cartItem.rice
//                         );


//                 if (!riceOption) {

//                     throw new Error(
//                         'Invalid rice option'
//                     );
//                 }


//                 rice =
//                     riceOption.type;


//                 unitPrice +=
//                     Number(
//                         riceOption
//                             .extraCost ||
//                         0
//                     );
//             }


//             subtotal +=
//                 unitPrice *
//                 quantity;


//             validatedItems.push({

//                 dishId:
//                     menuItem.id,

//                 name:
//                     menuItem.name,

//                 rice,

//                 price:
//                     Number(
//                         unitPrice
//                             .toFixed(2)
//                     ),

//                 quantity
//             });
//         }


//         subtotal =
//             Number(
//                 subtotal
//                     .toFixed(2)
//             );


//         return {

//             validatedItems,

//             subtotal
//         };
//     };

import Menu
    from '../models/menu.model.js';


const badRequest =
    message => {

        const error =
            new Error(
                message
            );

        error.statusCode =
            400;

        return error;

    };


const findDish =
    (
        menu,
        requestedId
    ) => {

        const target =
            String(
                requestedId
            );


        for (
            const category
            of menu.categories || []
        ) {

            const dish =
                category.items?.find(
                    item =>
                        String(
                            item.id
                        ) ===
                        target
                );


            if (dish) {

                return {
                    dish,
                    type:
                        'normal'
                };

            }

        }


        const setMeal =
            menu.setMeals?.find(
                item =>
                    String(
                        item.id
                    ) ===
                    target
            );


        if (setMeal) {

            return {
                dish:
                    setMeal,

                type:
                    'normal'
            };

        }


        const mix =
            menu.mixAndMatch?.find(
                item =>
                    String(
                        item.id
                    ) ===
                    target
            );


        if (mix) {

            return {
                dish:
                    mix,

                type:
                    'mix'
            };

        }


        return null;

    };


export const calculateServerOrder =
    async requestedItems => {

        if (
            !Array.isArray(
                requestedItems
            ) ||

            requestedItems.length ===
            0
        ) {

            throw badRequest(
                'Your cart is empty'
            );

        }


        const menu =
            await Menu.findOne();


        if (!menu) {

            const error =
                new Error(
                    'Menu could not be loaded'
                );

            error.statusCode =
                500;

            throw error;

        }


        const validatedItems =
            [];


        let subtotal =
            0;


        for (
            const requestedItem
            of requestedItems
        ) {

            const quantity =
                Number(
                    requestedItem.quantity
                );


            if (
                !Number.isInteger(
                    quantity
                ) ||

                quantity < 1
            ) {

                throw badRequest(
                    'Invalid item quantity'
                );

            }


            const found =
                findDish(
                    menu,
                    requestedItem.dishId
                );


            if (!found) {

                throw badRequest(
                    'One of the dishes no longer exists'
                );

            }


            const {
                dish,
                type
            } =
                found;


            if (
                dish.inStock ===
                false
            ) {

                throw badRequest(
                    `${dish.name} is out of stock`
                );

            }


            let unitPrice =
                Number(
                    dish.price
                );


            let rice =
                null;


            let displayName =
                dish.name;


            if (
                type ===
                'mix'
            ) {

                const riceOptions =
                    dish.riceOptions ||
                    [];


                rice =
                    requestedItem.rice ||
                    riceOptions[0]?.type ||
                    'Boiled Rice';


                const selectedRice =
                    riceOptions.find(
                        option =>
                            option.type ===
                            rice
                    );


                if (
                    riceOptions.length >
                    0 &&
                    !selectedRice
                ) {

                    throw badRequest(
                        'Invalid rice option'
                    );

                }


                unitPrice +=
                    Number(
                        selectedRice
                            ?.extraCost ||
                        0
                    );


                displayName =
                    `${dish.name} + ${rice}`;

            }


            subtotal +=
                unitPrice *
                quantity;


            validatedItems.push(
                {

                    dishId:
                        String(
                            dish.id
                        ),

                    name:
                        displayName,

                    rice,

                    price:
                        Number(
                            unitPrice
                                .toFixed(2)
                        ),

                    quantity

                }
            );

        }


        return {

            items:
                validatedItems,

            subtotal:
                Number(
                    subtotal
                        .toFixed(2)
                )

        };

    };