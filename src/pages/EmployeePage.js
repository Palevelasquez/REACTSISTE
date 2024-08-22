// src/components/EmployeePage.js
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Modal, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Axios from 'axios';
import Swal from 'sweetalert2';
import MenuItem from '@mui/material/MenuItem';

const UPLOAD_URL = 'http://localhost:5000/uploads/';

const EmployeePage = () => {
    // Define your state hooks inside the functional component
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [newEmployee, setNewEmployee] = useState({
        Nombre: '',
        ApellidoPaterno: '',
        ApellidoMaterno: '',
        CargoID: '',
        Correo: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(''); // Definir imagePreview

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await Axios.get('http://localhost:5000/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleAddOpen = () => {
        setNewEmployee({
            Nombre: '',
            ApellidoPaterno: '',
            ApellidoMaterno: '',
            cargo: '',
            Correo: '',
        });
        setImageFile(null);
        setOpenAddModal(true);
    };

    const handleEditOpen = (employee) => {
        setCurrentEmployee(employee);
        setOpenEditModal(true);
    };

    const handleImageOpen = (imageUrl) => {
        setImagePreview(imageUrl); // Establecer URL de imagen en el estado
        setOpenImageModal(true);  // Abrir modal de imagen
    };

    const handleCloseAdd = () => {
        setOpenAddModal(false);
    };

    const handleCloseEdit = () => {
        setOpenEditModal(false);
        setCurrentEmployee(null);
    };

    const handleCloseImage = () => {
        setOpenImageModal(false);
        setImagePreview('');
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentEmployee(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSaveAdd = async () => {
        if (!newEmployee.cargo) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo obligatorio',
                text: 'El campo "Cargo" es obligatorio.',
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('Nombre', newEmployee.Nombre);
            formData.append('ApellidoPaterno', newEmployee.ApellidoPaterno);
            formData.append('ApellidoMaterno', newEmployee.ApellidoMaterno);
            formData.append('CargoID', newEmployee.CargoID);  // Usa el ID del cargo
            formData.append('Correo', newEmployee.Correo);
            if (imageFile) {
                formData.append('Foto', imageFile);
            }

            await Axios.post('http://localhost:5000/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Empleado agregado',
                text: 'El empleado ha sido agregado con éxito.',
            });

            fetchEmployees();
            handleCloseAdd();
        } catch (error) {
            console.error('Error adding employee:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo agregar el empleado.',
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás recuperar este empleado!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await Axios.delete(`http://localhost:5000/employees/${id}`);
                Swal.fire(
                    'Eliminado!',
                    'El empleado ha sido eliminado.',
                    'success'
                );
                fetchEmployees();
            } catch (error) {
                console.error('Error deleting employee:', error);
                Swal.fire(
                    'Error!',
                    'No se pudo eliminar el empleado.',
                    'error'
                );
            }
        }
    };

    const handleSaveEdit = async () => {
        try {
            const formData = new FormData();
            formData.append('Nombre', currentEmployee.Nombre);
            formData.append('ApellidoPaterno', currentEmployee.ApellidoPaterno);
            formData.append('ApellidoMaterno', currentEmployee.ApellidoMaterno);
            formData.append('Cargo', currentEmployee.Cargo);
            formData.append('Correo', currentEmployee.Correo);
            if (imageFile) {
                formData.append('Foto', imageFile);
            }

            await Axios.put(`http://localhost:5000/employees/${currentEmployee.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            Swal.fire(
                'Actualizado!',
                'El empleado ha sido actualizado.',
                'success'
            );

            fetchEmployees();
            handleCloseEdit();
        } catch (error) {
            console.error('Error updating employee:', error);
            Swal.fire(
                'Error!',
                'No se pudo actualizar el empleado.',
                'error'
            );
        }
    };

    const columns = [
        {
            field: 'Foto',
            headerName: 'Foto',
            width: 100,
            renderCell: (params) => (
                params.value ? (
                    <div style={{ cursor: 'pointer' }}>
                        <img
                            src={`${UPLOAD_URL}${params.value}`} // Asegúrate de que UPLOAD_URL esté configurado correctamente
                            alt="Foto"
                            style={{ width: 40, borderRadius: '50%' }}
                            onClick={() => handleImageOpen(`${UPLOAD_URL}${params.value}`)}
                        />
                    </div>
                ) : (
                    <span>No disponible</span>
                )
            ),
        },
        { field: 'Nombre', headerName: 'Nombre', width: 150 },
        { field: 'ApellidoPaterno', headerName: 'Apellido Paterno', width: 150 },
        { field: 'ApellidoMaterno', headerName: 'Apellido Materno', width: 150 },
        { field: 'cargo', headerName: 'Cargo', width: 150 },
        { field: 'Correo', headerName: 'Correo', width: 200 },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 150,
            renderCell: (params) => (
                <div>
                    <IconButton color="warning" onClick={() => handleEditOpen(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Lista de Empleados</h1>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddOpen}>
                Añadir empleado
            </Button>
            <div className="card mt-4">
                <div className="card-header bg-primary text-white">
                    Empleados
                </div>
                <div className="card-body">
                    <div style={{ height: 600, width: '100%' }}>
                        <DataGrid rows={employees} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
                    </div>
                </div>
            </div>

            {/* Modal para añadir empleado */}
            <Modal open={openAddModal} onClose={handleCloseAdd}>
                <div style={{ padding: 20, backgroundColor: 'white', borderRadius: 8, margin: 'auto', marginTop: 100, width: '80%' }}>
                    <h2>Agregar Empleado</h2>
                    <TextField
                        label="Nombre"
                        name="Nombre"
                        value={newEmployee.Nombre}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Apellido Paterno"
                        name="ApellidoPaterno"
                        value={newEmployee.ApellidoPaterno}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Apellido Materno"
                        name="ApellidoMaterno"
                        value={newEmployee.ApellidoMaterno}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                    select
                    label="Cargo"
                    name="CargoID"
                    value={newEmployee.CargoID || ''}
                    onChange={handleAddChange}
                    fullWidth
                    margin="normal"
                    >
                        {departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>
                                {dept.nombre}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Correo"
                        name="Correo"
                        value={newEmployee.Correo}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ marginTop: 20 }}
                    />
                    <div style={{ marginTop: 20 }}>
                        <Button variant="contained" color="primary" onClick={handleSaveAdd}>
                            Guardar Empleado
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Modal para editar empleado */}
            <Modal open={openEditModal} onClose={handleCloseEdit}>
                <div style={{ padding: 20, backgroundColor: 'white', borderRadius: 8, margin: 'auto', marginTop: 100, width: '80%' }}>
                    <h2>Editar Empleado</h2>
                    <TextField
                        label="Nombre"
                        name="Nombre"
                        value={currentEmployee?.Nombre || ''}
                        onChange={handleEditChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Apellido Paterno"
                        name="ApellidoPaterno"
                        value={currentEmployee?.ApellidoPaterno || ''}
                        onChange={handleEditChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Apellido Materno"
                        name="ApellidoMaterno"
                        value={currentEmployee?.ApellidoMaterno || ''}
                        onChange={handleEditChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Cargo"
                        name="cargo"
                        value={currentEmployee?.cargo || ''}
                        onChange={handleEditChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Correo"
                        name="Correo"
                        value={currentEmployee?.Correo || ''}
                        onChange={handleEditChange}
                        fullWidth
                        margin="normal"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ marginTop: 20 }}
                    />
                    <div style={{ marginTop: 20 }}>
                        <Button variant="contained" color="primary" onClick={handleSaveEdit}>
                            Guardar Cambios
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Modal para ver imagen en tamaño completo */}
        <Modal open={openImageModal} onClose={handleCloseImage}>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
            }}>
        <div style={{
            position: 'relative',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'hidden',
            textAlign: 'center'
        }}>
        <button
            onClick={handleCloseImage}
            style={{
                position: 'absolute',
                top: '10px',
                right: '1px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '24px',
                color: 'white'
            }}
        >
            &times;
        </button>
        <img
            src={imagePreview}
            alt="Previsualización"
            style={{
                maxWidth: '100%',
                maxHeight: '80vh', // Ajusta la altura máxima según sea necesario
                objectFit: 'contain'
            }}
        />
        </div>
    </div>
            </Modal>
        </div>
    );
};

export default EmployeePage;