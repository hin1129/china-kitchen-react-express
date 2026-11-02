import Menu from "../models/menu.model.js";

const badRequest = (message) => {
  const error = new Error(message);

  error.statusCode = 400;

  return error;
};

const findDish = (menu, requestedId) => {
  const target = String(requestedId);

  for (const category of menu.categories || []) {
    const dish = category.items?.find((item) => String(item.id) === target);

    if (dish) {
      return {
        dish,
        type: "normal",
      };
    }
  }

  const setMeal = menu.setMeals?.find((item) => String(item.id) === target);

  if (setMeal) {
    return {
      dish: setMeal,

      type: "normal",
    };
  }

  const mix = menu.mixAndMatch?.find((item) => String(item.id) === target);

  if (mix) {
    return {
      dish: mix,

      type: "mix",
    };
  }

  return null;
};

export const calculateServerOrder = async (requestedItems) => {
  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    throw badRequest("Your cart is empty");
  }

  if (requestedItems.length > 100) {
    throw badRequest("Too many items in cart");
  }

  const menu = await Menu.findOne();

  if (!menu) {
    const error = new Error("Menu could not be loaded");

    error.statusCode = 500;

    throw error;
  }

  const validatedItems = [];

  let subtotal = 0;

  for (const requestedItem of requestedItems) {
    const quantity = Number(requestedItem.quantity);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      throw badRequest("Invalid item quantity");
    }

    const found = findDish(menu, requestedItem.dishId);

    if (!found) {
      throw badRequest("One of the dishes no longer exists");
    }

    const { dish, type } = found;

    if (dish.inStock === false) {
      throw badRequest(`${dish.name} is out of stock`);
    }

    let unitPrice = Number(dish.price);

    let rice = null;

    let displayName = dish.name;

    if (type === "mix") {
      const riceOptions = dish.riceOptions || [];

      rice = requestedItem.rice || riceOptions[0]?.type || "Boiled Rice";

      const selectedRice = riceOptions.find((option) => option.type === rice);

      if (riceOptions.length > 0 && !selectedRice) {
        throw badRequest("Invalid rice option");
      }

      unitPrice += Number(selectedRice?.extraCost || 0);

      displayName = `${dish.name} + ${rice}`;
    }

    subtotal += unitPrice * quantity;

    validatedItems.push({
      dishId: String(dish.id),

      name: displayName,

      rice,

      price: Number(unitPrice.toFixed(2)),

      quantity,
    });
  }

  return {
    items: validatedItems,

    subtotal: Number(subtotal.toFixed(2)),
  };
};
