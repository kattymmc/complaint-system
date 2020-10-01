const {Schema, model} = require('mongoose');

const ServiceSchema = new Schema({
    name: {
        type: String,
        required: true
    },    
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true 
});//createdAt, updatedAt

module.exports = model('Service', ServiceSchema); //nombre y el schema en el que estara basado