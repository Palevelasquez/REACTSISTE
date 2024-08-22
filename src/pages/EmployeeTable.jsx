import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Button, Form } from 'react-bootstrap';

const EmployeeTable = () => {
    const [employees, setEmployees] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);

    useEffect(() => {
        axios.get('/create')
            .then(response => setEmployees(response.data))
            .catch(error => console.error('Error fetching employees:', error));
    }, []);

    const columns = [
        { field: 'Foto', headerName: 'Foto', width: 100, renderCell: (params) => (
            params.value ? (
                <img src={`storage/fotos/${params.value}`} alt="Foto" className="img-thumbnail rounded-circle" width="40" />
            ) : (
                <span>No disponible</span>
            )
        )},
        { field: 'Nombre', headerName: 'Nombre', width: 150 },
        { field: 'ApellidoPaterno', headerName: 'Apellido Paterno', width: 150 },
        { field: 'ApellidoMaterno', headerName: 'Apellido Materno', width: 150 },
        { field: 'cargo', headerName: 'Cargo', width: 150 },
        { field: 'Correo', headerName: 'Correo', width: 200 },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 200,
            renderCell: (params) => (
                <>
                    <Button variant="warning" onClick={() => handleEdit(params.row)}>Editar</Button>
                    <Button variant="danger" onClick={() => handleDelete(params.row.id)}>Eliminar</Button>
                </>
            ),
        },
    ];

    const handleEdit = (employee) => {
        setCurrentEmployee(employee);
        setShowEditModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
            axios.delete(`/create${id}`)
                .then(() => {
                    setEmployees(employees.filter(employee => employee.id !== id));
                })
                .catch(error => console.error('Error deleting employee:', error));
        }
    };

    return (
        <div className="container mt-4">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="#">Departamentos</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">/</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">ÁREAS</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <h1 className="mb-4">Lista de Empleados</h1>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>Añadir empleado</Button>
            <div className="card mt-3">
                <div className="card-header bg-primary text-white">
                    Empleados
                </div>
                <div className="card-body">
                    <div style={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={employees}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                        />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Empleado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Nombre" />
                        </Form.Group>
                        <Form.Group controlId="formApellidoPaterno">
                            <Form.Label>Apellido Paterno</Form.Label>
                            <Form.Control type="text" placeholder="Apellido Paterno" />
                        </Form.Group>
                        <Form.Group controlId="formApellidoMaterno">
                            <Form.Label>Apellido Materno</Form.Label>
                            <Form.Control type="text" placeholder="Apellido Materno" />
                        </Form.Group>
                        <Form.Group controlId="formCargo">
                            <Form.Label>Cargo</Form.Label>
                            <Form.Control type="text" placeholder="Cargo" />
                        </Form.Group>
                        <Form.Group controlId="formCorreo">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control type="email" placeholder="Correo" />
                        </Form.Group>
                        <Form.Group controlId="formFoto">
                            <Form.Label>Foto (opcional)</Form.Label>
                            <Form.Control type="file" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cerrar</Button>
                    <Button variant="primary">Guardar Empleado</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Empleado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" defaultValue={currentEmployee?.Nombre} />
                        </Form.Group>
                        <Form.Group controlId="formApellidoPaterno">
                            <Form.Label>Apellido Paterno</Form.Label>
                            <Form.Control type="text" defaultValue={currentEmployee?.ApellidoPaterno} />
                        </Form.Group>
                        <Form.Group controlId="formApellidoMaterno">
                            <Form.Label>Apellido Materno</Form.Label>
                            <Form.Control type="text" defaultValue={currentEmployee?.ApellidoMaterno} />
                        </Form.Group>
                        <Form.Group controlId="formCargo">
                            <Form.Label>Cargo</Form.Label>
                            <Form.Control type="text" defaultValue={currentEmployee?.cargo} />
                        </Form.Group>
                        <Form.Group controlId="formCorreo">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control type="email" defaultValue={currentEmployee?.Correo} />
                        </Form.Group>
                        <Form.Group controlId="formFoto">
                            <Form.Label>Foto (opcional)</Form.Label>
                            <Form.Control type="file" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cerrar</Button>
                    <Button variant="primary">Guardar Cambios</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EmployeeTable;
