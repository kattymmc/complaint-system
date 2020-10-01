const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },   
    lastname: {
        type: String,
        required: true
    },
    telephone: {
        type: Number,
        required: true
    },
    address: {
        street: {type: String},
        number: {type: Number},
        district: {type: String}
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },role: {
        type: String,
        required: true
    }
}, {
    timestamps: true 
});// name, email, password createdAt, updatedAt

//Cifrar contraseña
UserSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(10); //Se ejecutara el hash 10 veces, await porque es asincrono
    return await bcrypt.hash(password, salt);
};

//Para comparar la contraseña ingrasada con la de bd, devuelve true, false
UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password)
};


module.exports = model('User', UserSchema); //nombre y el schema en el que estara basado