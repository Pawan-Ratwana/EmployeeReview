const mongoose = require('mongoose');
async function main(){
    await mongoose.connect('mongodb+srv://EmployeeReview:2NpRNLA360Xy9qRw@cluster0.knr4a.mongodb.net/employee_Review?retryWrites=true&w=majority')
        console.log('connection successfull !!');
}
main().catch((error)=>{console.log("connection not successfull !!");});