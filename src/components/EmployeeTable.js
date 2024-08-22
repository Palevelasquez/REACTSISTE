import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function EmployeeTable({ employees }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido Paterno</TableCell>
            <TableCell>Apellido Materno</TableCell>
            <TableCell>Cargo</TableCell>
            <TableCell>Correo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.id}</TableCell>
              <TableCell>{employee.Nombre}</TableCell>
              <TableCell>{employee.ApellidoPaterno}</TableCell>
              <TableCell>{employee.ApellidoMaterno}</TableCell>
              <TableCell>{employee.cargo}</TableCell>
              <TableCell>{employee.Correo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EmployeeTable;
