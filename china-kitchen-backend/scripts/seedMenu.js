import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import Menu from '../models/menu.model.js';

dotenv.config();

const seedMenu = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);

        const menuData = JSON.parse(fs.readFileSync('./data/Menu.json', 'utf-8'));
        const { categories, setMeals, mixAndMatch } = menuData;

        // starting fresh each time
        await Menu.deleteMany({});
        // await Menu.create(menuData);
        // await Menu.create({
        //     categories,
        //     setMeals: setMealCategory.items,
        //     mixAndMatch: mixAndMatchCategory.items
        // });
        await Menu.create({
            categories,
            setMeals,
            mixAndMatch
        });

        console.log(' Menu seeded successfully!');
        mongoose.disconnect();
    }
    catch (error) {
        console.error(' Seeding failed:', error);
        process.exit(1);
    }
};

seedMenu();