const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    people_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    zipcode: {type: String, required: false},
    street: {type: String, required: true},
    house_number: {type: String, required: true},//accept less number ok letter 23C
    complement: {type: String, required: true},
    district: {type: String, required: false},//bairro
    city: {type: String, required: false},
    state: {type: String, required: false},
},
{
    timestamps: true
});

mongoose.model('Addresses', addressSchema);