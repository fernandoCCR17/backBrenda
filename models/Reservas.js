import {DataTypes} from 'sequelize';
import db from '../config/db.js';
import Clientes  from './models/../Clientes.js';
import  Mesas  from './models/../Mesas.js';

const Reservas = db.define('Reservas', {
    ReservaID: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    ClienteID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MesaID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    FechaHoraReserva: {
        type: DataTypes.DATE,
        allowNull: false
    },
    NumeroPersonas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Preferencias: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    EstadoReserva: {
        type: DataTypes.STRING,
        defaultValue: 'confirmado',
        allowNull: false
    },
    Comentarios: {
        type: DataTypes.TEXT,
        allowNull: false
    }
},{
    timestamps: false, // genera columnas y actualizar en el momento 
})

Reservas.belongsTo(Clientes, { foreignKey: 'ClienteID', as: 'cliente' });
Reservas.belongsTo(Mesas, { foreignKey: 'MesaID', as: 'mesa' });

export default Reservas;