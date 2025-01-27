import axios from 'axios';

const BASE_URL = 'http://localhost:7777/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const MenuService = {
    async getMenu() {
        try {
            const response = await api.get('/menu');
            return response.data.menu;
        } catch (error) {
            console.error('Ошибка получения меню:', error);
            throw error;
        }
    },

    async addDishToMenu(menuID, dishID) {
        try {
            const response = await api.post('/menu/add-dish', { 
                menuID: Number(menuID), 
                dishID: Number(dishID) 
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка добавления блюда:', error);
            throw error;
        }
    },

    async replaceDishInMenu(old_menuID, old_dishID, new_menuID, new_dishID) {
        try {
            const response = await api.post('/menu/replace-dish', {
                old_menuID: Number(old_menuID),
                old_dishID: Number(old_dishID),
                new_menuID: Number(new_menuID),
                new_dishID: Number(new_dishID)
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка замены блюда:', error);
            throw error;
        }
    },

    async deleteDishFromMenu(menuID, dishID) {
        try {
            const response = await api.post('/menu/delete-dish', {
                menuID: Number(menuID), 
                dishID: Number(dishID) 
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка удаления блюда:', error);
            throw error;
        }
    }
};

export default api;
