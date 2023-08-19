const Employee = require('../models/employee');
const Admin = require('../models/admin');
// this is welcome page
module.exports.welcome = async function (req, res) {
    res.render('signIn', {
        title: "Sign In"
    });
}

// login for employee and admin
module.exports.LoginEmployee = async function (req, res) {
    try {
        if (req.body.role == "employee") {
            req.flash('success', 'SignIn in successfully');
            res.cookie('id', req.body.email );
            return res.redirect('/employee/perfromancelist');
        } else {
            req.flash('success', 'SignIn in successfully');
            res.cookie('id', req.body.email );
            return res.redirect('/admin_employee/employee_dashboard');

        }

    } catch (error) {
        return res.send("<h1>Login Password doesnot match</h1>");
    }
}


// make employee as  admin
module.exports.registerAdmin = async function (req, res) {
    try {
        const adminPresent = await Admin.findOne({email : req.body.email});
        if(adminPresent != null){
            req.flash('error', 'Admin Registered Already !!');
        }else{
            const registerAdmin = await Admin.create(req.body);
            req.flash('success', 'Admin Registered successfully');
        }
        
        return res.redirect('/admin_employee/employee_dashboard');
    } catch (error) {
        return res.send("<h1>Error during registation of admin !!</h1>");
    }
}

// destroy session
module.exports.destroySession = async function(req , res){
    req.logout();
    req.flash('success' , "Sign Out SuccessFully !!");
    return res.redirect('/');
}