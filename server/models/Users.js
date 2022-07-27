const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let userSchema = new Schema({
    Uid:{
        type: String
    },
    Nombre: {
        type: String
    },
    Email: {
        type: String,
        unique: true
    },
    Celular: {
        type: String
    },
    Ciudad:{
        type: String
    },
    Direccion:{
        type: String
    },
    Emprendimiento_id:{
        type: String
    },
},
{
    collection: 'users'
})     
module.exports = mongoose.model('User', userSchema)