import express, { response } from 'express'
export const router = express.Router()
import Menu from '../models/menu.model.js'

router.get(`/takeaway`, (request, response) => {
    Menu.findOne()
        .then((menu) => {
            console.log('MENU FROM DB:', JSON.stringify(menu, null, 2));

            response.status(200).json(menu);
        })
        .catch((error) => { response.status(400).json('error: ' + error) })
})