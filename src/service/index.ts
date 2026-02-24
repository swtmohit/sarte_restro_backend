import dotenv from 'dotenv'

dotenv.config();

import {app} from '../app';
import {connectionDB} from "../config/db";

const PORT:string | number = process.env.PORT || 5000;

connectionDB().then(() =>{
    app.listen(PORT, () =>{
        console.log(`Server running on http://localhost:${PORT}`)
    })
})