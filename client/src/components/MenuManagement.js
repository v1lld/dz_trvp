import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Row, 
    Col, 
    Table, 
    Button, 
    Modal, 
    Form, 
    Alert 
} from 'react-bootstrap';
import { MenuService } from '../services/api';

const MenuManagement = () => {
    const [menus, setMenus] = useState([]);
    const [error, setError] = useState(null);

    // Модальные окна
    const [showAddModal, setShowAddModal] = useState(false);
    const [showReplaceModal, setShowReplaceModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Состояния для форм
    const [menuID, setMenuID] = useState('');
    const [dishID, setDishID] = useState('');
    const [oldMenuID, setOldMenuID] = useState('');
    const [oldDishID, setOldDishID] = useState('');
    const [newMenuID, setNewMenuID] = useState('');
    const [newDishID, setNewDishID] = useState('');

    // Загрузка меню
    const fetchMenus = async () => {
        try {
            const menuData = await MenuService.getMenu();
            setMenus(menuData);
            setError(null);
        } catch (err) {
            setError('Ошибка загрузки меню: ' + err.message);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    // Обработчики действий
    const handleAddDish = async () => {
        try {
            await MenuService.addDishToMenu(menuID, dishID);
            fetchMenus();
            setShowAddModal(false);
            // Сброс полей
            setMenuID('');
            setDishID('');
        } catch (err) {
            setError('Ошибка добавления блюда: ' + err.message);
        }
    };

    const handleReplaceDish = async () => {
        try {
            await MenuService.replaceDishInMenu(
                oldMenuID, 
                oldDishID, 
                newMenuID, 
                newDishID
            );
            fetchMenus();
            setShowReplaceModal(false);
            // Сброс полей
            setOldMenuID('');
            setOldDishID('');
            setNewMenuID('');
            setNewDishID('');
        } catch (err) {
            setError('Ошибка замены блюда: ' + err.message);
        }
    };

    const handleDeleteDish = async () => {
        try {
            await MenuService.deleteDishFromMenu(menuID, dishID);
            fetchMenus();
            setShowDeleteModal(false);
            // Сброс полей
            setMenuID('');
            setDishID('');
        } catch (err) {
            setError('Ошибка удаления блюда: ' + err.message);
        }
    };

    return (
        <Container>
            {error && (
                <Alert 
                    variant="danger" 
                    onClose={() => setError(null)} 
                    dismissible
                >
                    {error}
                </Alert>
            )}

            <Row className="mb-3">
                <Col>
                    <Button 
                        variant="success" 
                        onClick={() => setShowAddModal(true)}
                    >
                        Добавить блюдо в меню
                    </Button>
                    <Button 
                        variant="warning" 
                        onClick={() => setShowReplaceModal(true)}
                        className="ml-2"
                    >
                        Заменить блюдо в меню
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={() => setShowDeleteModal(true)}
                        className="ml-2"
                    >
                        Удалить блюдо из меню
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID Меню</th>
                                <th>ID Блюда</th>
                                <th>Номер меню</th>
                                <th>Дата</th>
                                <th>Блюда</th>
                                <th>Тип блюда</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menus.map((menu, index) => (
                                <tr key={index}>
                                    <td>{menu.menuID}</td>
                                    <td>{menu.dishID}</td>
                                    <td>{menu.menuNUM}</td>
                                    <td>{menu.menuDate}</td>
                                    <td>{menu.dish_name}</td>
                                    <td>{menu.dish_type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Модальное окно добавления блюда */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить блюдо в меню</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>ID Меню</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={menuID}
                                onChange={(e) => setMenuID(e.target.value)}
                                placeholder="Введите ID меню"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>ID Блюда</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={dishID}
                                onChange={(e) => setDishID(e.target.value)}
                                placeholder="Введите ID блюда"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleAddDish}>
                        Добавить
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Модальное окно замены блюда */}
            <Modal show={showReplaceModal} onHide={() => setShowReplaceModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Заменить блюдо в меню</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Старый ID Меню</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={oldMenuID}
                                onChange={(e) => setOldMenuID(e.target.value)}
                                placeholder="Введите старый ID меню"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Старый ID Блюда</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={oldDishID}
                                onChange={(e) => setOldDishID(e.target.value)}
                                placeholder="Введите старый ID блюда"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Новый ID Меню</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={newMenuID}
                                onChange={(e) => setNewMenuID(e.target.value)}
                                placeholder="Введите новый ID меню"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Новый ID Блюда</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={newDishID}
                                onChange={(e) => setNewDishID(e.target.value)}
                                placeholder="Введите новый ID блюда"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReplaceModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleReplaceDish}>
                        Заменить
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Модальное окно удаления блюда */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Удалить блюдо из меню</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>ID Меню</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={menuID}
                                onChange={(e) => setMenuID(e.target.value)}
                                placeholder="Введите ID меню"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>ID Блюда</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={dishID}
                                onChange={(e) => setDishID(e.target.value)}
                                placeholder="Введите ID блюда"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={handleDeleteDish}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MenuManagement;

