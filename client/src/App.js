import React from 'react';
import { Container } from 'react-bootstrap';
import MenuManagement from './components/MenuManagement';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Container fluid>
            <h1 className="text-center my-4">Управление Меню Ресторана</h1>
            <MenuManagement />
        </Container>
    );
}

export default App;
