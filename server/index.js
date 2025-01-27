import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';  // Добавьте этот импорт
import DBAdaptre, { DB_ERROR_TYPE_CLIENT } from './adapters/DBAdapter.js';

dotenv.config({
    path: './.env'
});

const {
    TM_APP_HOST,
    TM_APP_PORT,
    TM_DB_HOST,
    TM_DB_PORT,
    TM_DB_NAME,
    TM_DB_USER_LOGIN,
    TM_DB_USER_PASSWORD
} = process.env;

const serverApp = express();

// Добавьте CORS middleware
serverApp.use(express.json());
serverApp.use(cors({
    origin: 'http://localhost:3000', // URL вашего React-приложения
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const dbAdapter = new DBAdaptre({
    dbHost: TM_DB_HOST,
    dbPort: TM_DB_PORT,
    dbName: TM_DB_NAME,
    dbUserLogin: TM_DB_USER_LOGIN,
    dbUserPassword: TM_DB_USER_PASSWORD
});


// middleware - логирование запросов 
serverApp.use('*', (req, res, next) => { 
    console.log(
        new Date().toISOString(), 
        req.method, 
        req.originalUrl
    );
    next();
});



serverApp.use('/api/v1/menu', express.json());
// serverApp.use('/api/v1/dishes', express.json());

serverApp.get('/api/v1/menu', async (req, res) => {
    console.log('Получен запрос на /api/v1/menu');
    try {
        const [dbmenu] = await Promise.all([
            dbAdapter.getmenu()
        ]);

        const menu = dbmenu.map(
            ({ menu_id, dish_id, num_menu, date, name, type }) => ({
                menuID: menu_id,
                dishID: dish_id,
                menuNUM: num_menu,
                menuDate: date,
                dish_name: name,
                dish_type: type
            })
        );

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.json({ menu });
    } catch (err){
        res.statusCode = 500;
        res.statusMessage = 'Interla server error';
        res.json({ 
            timestamp: new Date().toISOString(),
            statusCode: 500,
            message: `get menu erroe: ${err.message || err}`
         });
    }
});


serverApp.post('/api/v1/menu/add-dish', async (req, res) => {
    //console.log('Request Body:', req.body); 
    try {
       
        const { menuID, dishID } = req.body; // Извлечение данных из тела запроса
        
        await dbAdapter.add_dish_menu({
            menuID,
            dishID
        });

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.json({ menuID });
        
       
    } catch (err){
        switch (err.type) {
            case DB_ERROR_TYPE_CLIENT:
                res.statusCode = 500;
                res.statusMessage = 'Bed request';
                break;
            default:
                res.statusCode = 500;
                res.statusMessage = 'Interla server error';
        }

        res.json({ 
            timestamp: new Date().toISOString(),
            statusCode: 500,
            message: `add dish menu erroe: ${err.message || err}`
         });
    }
});


serverApp.post('/api/v1/menu/replace-dish', async (req, res) => {
    //console.log('Request Body:', req.body); 
    try {
       
        const { old_menuID, old_dishID, new_menuID, new_dishID } = req.body; // Извлечение данных из тела запроса
        
        await dbAdapter.replace_dish_menu({
            old_menuID, 
            old_dishID, 
            new_menuID, 
            new_dishID
        });


        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.json({ old_menuID, old_dishID, new_menuID, new_dishID });
        
       
    } catch (err){
        switch (err.type) {
            case DB_ERROR_TYPE_CLIENT:
                res.statusCode = 500;
                res.statusMessage = 'Bed request';
                break;
            default:
                res.statusCode = 500;
                res.statusMessage = 'Interla server error';
        }

        res.json({ 
            timestamp: new Date().toISOString(),
            statusCode: 500,
            message: `replace dish menu erroe: ${err.message || err}`
         });
    }
});

serverApp.post('/api/v1/menu/delete-dish', async (req, res) => {
    console.log('Request Body:', req.body); 
    try {
       
        const { menuID, dishID } = req.body; // Извлечение данных из тела запроса
        
        await dbAdapter.delite_menu_dish({
            menuID,
            dishID
        });

        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.json({ menuID });
        
       
    } catch (err){
        switch (err.type) {
            case DB_ERROR_TYPE_CLIENT:
                res.statusCode = 500;
                res.statusMessage = 'Bed request';
                break;
            default:
                res.statusCode = 500;
                res.statusMessage = 'Interla server error';
        }

        res.json({ 
            timestamp: new Date().toISOString(),
            statusCode: 500,
            message: `add dish menu erroe: ${err.message || err}`
         });
    }
});

serverApp.listen (Number (TM_APP_PORT), TM_APP_HOST, async () => { 
    try {
        await dbAdapter.connect();
    } catch (err) {
        console.log('Task Manager app is shutting down'); 
        process.exit(100);
    }
        console.log(`TM App Server started (${TM_APP_HOST}:${TM_APP_PORT})`);
    });

    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing HTTP and DB servers');
        serverApp.close(async () => {
            await dbAdapter.disconnect();
            console.log('HTTP and DB servers closed');
    });
});