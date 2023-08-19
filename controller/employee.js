const Employee = require('../models/employee');
const Admin = require('../models/admin');
const env = require('../config/environment');
const Performance = require('../models/performance');
module.exports.signup = async function (req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/employee/perfromancelist');
    }
    res.render('signUp', {
        title: "Sign Up"
    });
}

module.exports.register = async function (req, res) {
    try {
        var presentEmployee = await Employee.find({ email: req.body.email });
        if (presentEmployee.email === req.body.email) {
            req.flash('error', 'Email id Already registered !');
            return res.redirect('/');
        } else {
            const registerEmployee = new Employee(req.body);
            const resistered = await registerEmployee.save();
            var allAdmin = await Admin.find({});
            for (var i = 0; i < allAdmin.length; i++) {
                allAdmin[i].employeeId.push(resistered.id);
                allAdmin[i].save();
            }
            req.flash('success', 'SignUp successfully');
            return res.redirect('/');
        }
    } catch (error) {
        return res.send("<h1>Error in SignUp !!</h1>");
    }
}
module.exports.performanceReviewList = async function (req, res) {
    try {
        var allEmployee = await Employee.findOne({ email: req.cookies.id });
        var feedback = allEmployee.feedback;
        var list = [];
        for (var i = 0; i < feedback.length; i++) {
            const data = await Employee.findById(feedback[i]);
            if (data != null) {
                list.push(data);
            }
        }
        res.render('employeeDashboard', {
            title: "Employee",
            allEmployee: list
        });
    } catch (error) {
        return res.send("<h1>Error in sendiding data to Employee Dashboard !!</h1>");
    }
}



module.exports.submitFeedback = async function (req, res) {
    try {
        var addPerformance = await Performance(req.body);
        addPerformance.save();
        // find employee by id 
        const employeeById = await Employee.findById(req.body.employees);
        employeeById.like = true;
        employeeById.performances = addPerformance.id;
        await employeeById.save();
        const allAdmin = await Admin.find({});
        for (var i = 0; i < allAdmin.length; i++) {
            allAdmin[i].performance.push(addPerformance.id);
            allAdmin[i].save();
        }
        req.flash('success', 'Feedback Submitted Successfully !!');
        return res.redirect('/employee/perfromancelist');
    } catch (error) {
        return res.send("<h1>Error on Submitting Feedback !!</h1>");
    }
}
module.exports.feedbackPage = async function (req, res) {
    try {
        return res.render('submitFeedback', {
            title: "Feedback",
            id: req.params.id
        });
    } catch (error) {
        return res.send('<h1>Error on Feedback!!</h1>');
    }
}