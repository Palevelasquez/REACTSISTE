const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

 // Configuración de Multer para manejar archivos
 const storage = multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
     },
     filename: (req, file, cb) => {
         cb(null, Date.now() + path.extname(file.originalname)); // Nombre del archivo
     }
 });


const upload = multer({ storage });

// // Cors
 app.use(cors({
     origin: 'http://localhost:3000' // Permitir solicitudes solo desde esta URL
      }));

 // Middleware 
 app.use(express.json());

// Configura la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Si no tienes contraseña, déjalo vacío
    database: 'Crudprue'
});

//const getConnection = () => pool.promise();


db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Rutas
// Obtener empleados
   app.get('/employees', (req, res) => {
      db.query('SELECT * FROM Empleados', (err, results) => {
          if (err) throw err;
          res.json(results);
      });
 });



// Endpoint para agregar un nuevo empleado
app.post('/create', upload.single('Foto'), (req, res) => {
    const Nombre = req.body.Nombre;
    const ApellidoPaterno = req.body.ApellidoPaterno;
    const ApellidoMaterno = req.body.ApellidoMaterno;
    const CargoID = req.body.CargoID;
    const Correo = req.body.Correo;
    const Foto = req.file ? req.file.filename : null;

    db.query('INSERT INTO empleados (Nombre, ApellidoPaterno, ApellidoMaterno, CargoID, Correo, Foto) VALUES (?, ?, ?, ?, ?, ?)', 
    [Nombre, ApellidoPaterno, ApellidoMaterno, CargoID, Correo, Foto],
    (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error al registrar empleado');
        } else {
            res.send("¡Empleado registrado con éxito!");
        }
    });
});

//      const { Nombre, ApellidoPaterno, ApellidoMaterno, cargo, Correo } = req.body;
//      const Foto = req.file ? req.file.filename : null;
  
//     const query = 'INSERT INTO Empleados (Nombre, ApellidoPaterno, ApellidoMaterno, cargo, Correo, Foto) VALUES (?, ?, ?, ?, ?, ?)';
  
//      connection.query(query, [Nombre, ApellidoPaterno, ApellidoMaterno, cargo, Correo, Foto], (err, result) => {
//       if (err) {
//          console.error('Error al agregar empleado:', err);
//          return res.status(500).json({ error: 'Error al agregar empleado' });
//        }
//        res.status(201).json({ message: 'Empleado agregado con éxito' });
//      });
//  // });
  

app.put('/employees/:id', upload.single('Foto'), (req, res) => {
    const { id } = req.params;
    const Nombre = req.body.Nombre;
    const ApellidoPaterno = req.body.ApellidoPaterno;
    const ApellidoMaterno = req.body.ApellidoMaterno;
    const CargoID = req.body.CargoID;
    const Correo = req.body.Correo;
    const Foto = req.file ? req.file.filename : null;

    db.query('UPDATE empleados SET Nombre = ?, ApellidoPaterno = ?, ApellidoMaterno = ?, CargoID = ?, Correo = ?, Foto = ? WHERE id = ?', 
    [Nombre, ApellidoPaterno, ApellidoMaterno, CargoID, Correo, Foto, id],
    (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error al actualizar empleado');
        } else {
            res.send("¡Empleado actualizado con éxito!");
        }
    });
});

//Endpoint para eliminar un empleado
app.delete('/employees/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM empleados WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error al eliminar empleado');
        } else {
            res.send("¡Empleado eliminado con éxito!");
        }
    });
});

app.get('/cargos', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM Cargo'); // Asegúrate de que el nombre de la tabla sea correcto
        res.json(rows);
    } catch (error) {
        console.error('Error fetching cargos:', error);
        res.status(500).json({ error: 'Error fetching cargos' });
    }
});
     

    app.get('/departments', (req, res) => {
        db.query('SELECT * FROM departments', (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    });

// // Configuración de ruta para servir archivos estáticos
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

 // Iniciar el servidor
 app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

