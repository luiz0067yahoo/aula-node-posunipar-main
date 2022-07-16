const mongoose = require('mongoose');

const peoplesSchema = new mongoose.Schema({
    name: {type: String, required: true},
    aliasname: {type: String, required: false},
    phone: {type: String, required: false},
    email: {type: String, required: false},
    status: {type: String, required: false},
},
{
    timestamps: true
});

mongoose.model('Peoples', peoplesSchema);