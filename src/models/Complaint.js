const {Schema, model} = require('mongoose');

const ComplaintSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },    
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    remark: {
        type: String
    },
    user: {
        type: String,
        required: true 
    }
}, {
    timestamps: true 
});//createdAt, updatedAt

module.exports = model('Complaint', ComplaintSchema); //nombre y el schema en el que estara basado