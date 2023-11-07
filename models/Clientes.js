import {DataTypes} from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../config/db.js'


const Cliente = db.define('Clientes', {
    ClienteID: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CorreoElectronico: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Telefono: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Contrasena:{
        type: DataTypes.STRING,
        allowNull: false    
    },
}, {
    timestamps: false, // genera columnas y actualizar en el momento 
    //Hash de usuarios
    hooks: {
        beforeCreate: async function(usuario){
            const salt = await bcrypt.genSalt(10);
            usuario.Contrasena= await bcrypt.hash(usuario.Contrasena, salt); 
        }
    }
})

//Contrasena(comparar la contraseña hasheada en la bd, con la contra que ingresa el usuario)
Cliente.prototype.verificaPassword = function(contrasena){
    return bcrypt.compareSync(contrasena, this.Contrasena)
}
export default Cliente;

