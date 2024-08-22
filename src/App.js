import React from 'react';
import ReactDOM from 'react-dom'; // Importa ReactDOM aquí
import MainLayout from './MainLayout';
import EmployeePage from './pages/EmployeePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import EmployeeTable from './components/EmployeeTable';
import './App.css';
import {useState} from "react"
import Axios from "axios"


function App() {

  const [Nombre, setNombre] = useState("");
  const [ApellidoPaterno, setApellidoPaterno] = useState(0);
  const [ApellidoMaterno, setApellidoMaterno] = useState("");
  const [Cargo, setCargo] = useState("");
  const [Correo, setCorreo] = useState(0);
  const [Foto, setFoto] = useState(0);

  const add = ()=>{
    const formData = new FormData();
      formData.append('Nombre', Nombre);
      formData.append('ApellidoPaterno', ApellidoPaterno);
      formData.append('ApellidoMaterno', ApellidoMaterno);
      formData.append('Cargo', Cargo);
      formData.append('Correo', Correo);
      formData.append('Foto', Foto); // Aquí, 'Foto' es el archivo seleccionado
      Axios.post("http://localhost:5000/create", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(() => {
        alert("Empleado Registrado");
    });
}


  return (
    <MainLayout>
      <EmployeePage/>
    </MainLayout>
  );
}

// Este bloque debe estar fuera de la función App
if (document.getElementById('employee-table')) {
  ReactDOM.render(<EmployeeTable />, document.getElementById('employee-table'));
}

export default App;
