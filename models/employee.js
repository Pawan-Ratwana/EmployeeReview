const mongoose = require('mongoose');
const employee = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique:true,
        },
        password: {
            type: String,
            require: true,
            unique:true
        },
        mobile:{
            type:String,
            require : true,
            unique:true
        },
        city :{
            type:String,
            require : true
        },
        role: {
            type: String,
            enum: ['employee', 'admin'],
            default: 'employee'
        },
        performances : {
            type : mongoose.Schema.Types.ObjectId,
            ref : `performance`
        },
        feedback :[{
            type : String
        }],
        like:{
            type:Boolean,
            default:false
        }
    }, { timestamps: true }
);
const Employee = mongoose.model('employee', employee);
module.exports = Employee;