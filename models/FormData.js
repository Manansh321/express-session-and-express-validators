const mongoose = require('mongoose');
                 
const FormDataSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    }, 
    email:  {
        type : String,
        required : true,
        unique : true,
    },
    password:  {
        type : String,
        required : true, 
    }
})

const FormDataModel = mongoose.model('log_reg_form', FormDataSchema);

module.exports = FormDataModel;
