// services/MenuService.js
import api from './api';

export const MenuService = {
    async getMenu() {
        const response = await api.get('/menu');
        return response.data.menu;
    },

    async add_dish_menu({ menuID, dishID }) {
        try {
            const response = await api.post('/menu/add-dish', { 
                menuID, 
                dishID 
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка добавления блюда:', error);
            throw error;
        }
    },

    async replace_dish_menu({ 
        old_menuID, 
        old_dishID, 
        new_menuID, 
        new_dishID 
    }) {
        try {
            const response = await api.put('/menu/replace-dish', { 
                old_menuID, 
                old_dishID, 
                new_menuID, 
                new_dishID 
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка замены блюда:', error);
            throw error;
        }
    },

    async delite_menu_dish({ menuID, dishID }) {
        try {
            const response = await api.delete('/menu/delete-dish', { 
                data: { menuID, dishID } 
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка удаления блюда:', error);
            throw error;
        }
    }
};

// services/DishService.js
export const DishService = {
    async getAllDishes() {
        const response = await api.get('/dishes');
        return response.data.dishes;
    }
};
