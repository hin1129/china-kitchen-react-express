import mongoose from 'mongoose';

// Optional rice options for Mix & Match items
const RiceOptionSchema = new mongoose.Schema(
    {
        type: { type: String, required: true },
        extraCost: { type: Number, default: 0 }
    },
    { _id: false }
);

// Shared schema for all items
const ItemSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        riceOptions: {
            type: [RiceOptionSchema],
            default: undefined // allows it to be missing completely
        },
        inStock: { type: Boolean, default: true }
    },
    { _id: false }
);

// For category sections like Appetisers, Soup
const CategorySchema = new mongoose.Schema(
    {
        categoryName: { type: String, required: true },
        items: { type: [ItemSchema], required: true }
    },
    { _id: false }
);

// Final Menu schema with explicit setMeals and mixAndMatch
const MenuSchema = new mongoose.Schema({
    categories: { type: [CategorySchema], required: true },
    setMeals: { type: [ItemSchema], required: true },
    mixAndMatch: { type: [ItemSchema], required: true }
});

const MenuDB = mongoose.model('Menu', MenuSchema);
export default MenuDB