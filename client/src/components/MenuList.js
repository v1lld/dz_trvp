import React, { useState, useEffect } from 'react';
import { Table, Container, Spinner, Alert, Button } from 'react-bootstrap';
import { MenuService } from '../services/api';

const MenuList = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Функция загрузки меню с расширенной обработкой
    const fetchMenus = async () => {
        try {
            setLoading(true);
            const menuData = await MenuService.getMenu();
            
            // Расширенная валидация данных
            console.log('Полученные данные меню:', menuData);
            
            if (!Array.isArray(menuData)) {
                throw new Error('Получены некорректные данные');
            }

            setMenus(menuData);
            setError(null);
        } catch (err) {
            console.error('Полная ошибка:', err);
            setError(err.message || 'Неизвестная ошибка загрузки меню');
            setMenus([]);
        } finally {
            setLoading(false);
        }
    };

    // Первичная загрузка
    useEffect(() => {
        fetchMenus();
    }, []);

    // Рендеринг строк меню с максимально гибкой обработкой
    const renderMenuRows = () => {
        if (!Array.isArray(menus) || menus.length === 0) {
            return (
                <tr>
                    <td colSpan="5" className="text-center">
                        <Alert variant="info">Меню не найдены</Alert>
                    </td>
                </tr>
            );
        }

        return menus.map((menu, index) => (
            <tr key={menu.menuID || index}>
                <td>{menu.menuID || 'Н/Д'}</td>
                <td>{menu.menuNUM || 'Н/Д'}</td>
                <td>{menu.menuDate || 'Н/Д'}</td>
                <td>{menu.dish_name || 'Н/Д'}</td>
                <td>{menu.dish_type || 'Н/Д'}</td>
            </tr>
        ));
    };

    // Визуальные состояния загрузки и ошибок
    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Загрузка меню...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    {error}
                    <Button 
                        variant="outline-primary" 
                        onClick={fetchMenus} 
                        className="ml-3"
                    >
                        Повторить загрузку
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center my-3">
                <h2>Список Меню</h2>
                <Button 
                    variant="outline-success" 
                    onClick={fetchMenus}
                >
                    Обновить
                </Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID Меню</th>
                        <th>Номер Меню</th>
                        <th>Дата</th>
                        <th>Название Блюда</th>
                        <th>Тип Блюда</th>
                    </tr>
                </thead>
                <tbody>
                    {renderMenuRows()}
                </tbody>
            </Table>
        </Container>
    );
};

export default MenuList;
