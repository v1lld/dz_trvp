import pg from 'pg';

const DB_ERROR_TYPE_CLIENT = 'DB_ERROR_TYPE_CLIENT'
const DB_ERROR_TYPE_INTERNAL = 'DB_ERROR_TYPE_INTERNAL'

export {
    DB_ERROR_TYPE_INTERNAL,
    DB_ERROR_TYPE_CLIENT
}


export default class DBAdaptre {
    #dbHost = '';
    #dbPort = -1; 
    #dbName = '';
    #dbUserLogin = '';
    #dbUserPassword ='';
    #dbClient = null;

    constructor({
        dbHost,
        dbPort,
        dbName,
        dbUserLogin,
        dbUserPassword
    }) {
        this.#dbHost = dbHost;
        this.#dbPort = dbPort;
        this.#dbName = dbName;
        this.#dbUserLogin = dbUserLogin; 
        this.#dbUserPassword = dbUserPassword;

        this.#dbClient = new pg.Client({
            host: this.#dbHost,
            port: this.#dbPort,
            database: this.#dbName,
            user: this.#dbUserLogin,
            password: this.#dbUserPassword
        });
    }

    
    async connect() {
        try {
            await this. #dbClient.connect();
            console.log('db connection established');
        } catch (err) {
            console.error(`unable to connect to db: ${err}`);
            return Promise.reject(err);
        }
    }
    
    async disconnect(){
        await this. #dbClient.end();
        console.log('db connection closed');
    }

    async getmenu() {
        try {
            const menu = await this.#dbClient.query(
                'SELECT menu_id, dish_id, num_menu, date, name, type FROM menu_dishes med JOIN menus me ON me.id = med.menu_id JOIN dishes dis ON dis.id = med.dish_id ORDER BY menu_id, dis.num;'
            );
            
            return menu.rows;
        } catch (err) {
            console.error(`DB Error: unable get menus (${err})`);
            return Promise.reject({
                type: DB_ERROR_TYPE_INTERNAL,
                error: err
            });
        }
    }


    async add_dish_menu({menuID, dishID}) {
        if(!menuID || !dishID) {
            const errMsg = `DB Error: ошибка добавления блюда (idmenu ${menuID}, iddish ${dishID})`;
            console.error(errMsg);

            return Promise.reject({
                type: DB_ERROR_TYPE_CLIENT,
                error: new Error(errMsg)
            });
        }
        

        try {
                await this.#dbClient.query(
                'INSERT INTO menu_dishes (menu_id, dish_id) VALUES ($1, $2);',
                [menuID, dishID]
            );
            
          //  return dish_menu.rows;
        } catch (err) {
            console.error(`DB Error: unable get adddish_menu (${err})`);
            return Promise.reject({
                type: DB_ERROR_TYPE_INTERNAL,
                error: err
            });
        }
    }


    async replace_dish_menu({old_menuID, old_dishID, new_menuID, new_dishID}) {
        if(!old_menuID || !new_dishID) {
            const errMsg = `DB Error: ошибка замены блюда (old_idmenu ${old_menuID}, old_iddish ${old_dishID}, new_idmenu ${new_menuID}, new_iddish ${new_dishID})`;
            console.error(errMsg);

            return Promise.reject({
                type: DB_ERROR_TYPE_CLIENT,
                error: new Error(errMsg)
            });
        }
        
        try {
                await this.#dbClient.query(
                'DELETE FROM menu_dishes WHERE menu_id = $1 AND dish_id = $2;',
                [old_menuID, old_dishID]
            );
                await this.#dbClient.query(
                'INSERT INTO menu_dishes (menu_id, dish_id) VALUES ($1, $2);',
                [new_menuID, new_dishID]
            );
          //  return dish_menu.rows;
        } catch (err) {
            console.error(`DB Error: unable get replace_dish_menu (${err})`);
            return Promise.reject({
                type: DB_ERROR_TYPE_INTERNAL,
                error: err
            });
        }
    }

    async delite_menu_dish({menuID, dishID}) {
        if(!menuID || !dishID) {
            const errMsg = `DB Error: ошибка удаления блюда (idmenu ${menuID}, iddish ${dishID})`;
            console.error(errMsg);
            
            return Promise.reject({
                type: DB_ERROR_TYPE_CLIENT,
                error: new Error(errMsg)
            });
        }
        
        try {
            await this.#dbClient.query(
                'DELETE FROM menu_dishes WHERE menu_id = $1 AND dish_id = $2;',
                [menuID, dishID]
            );
            
        } catch (err) {
            console.error(`DB Error: unable get adddish_menu (${err})`);
            return Promise.reject({
                type: DB_ERROR_TYPE_INTERNAL,
                error: err
            });
        }
    }


}