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
        const allEmployee = await Employee.findOne({ email: req.cookies.id });

        if (!allEmployee) {
            return res.status(404).send("Employee not found");
        }

        const feedback = allEmployee.feedback;
        const list = [];

        const employeePromises = feedback.map(async feedbackId => {
            const data = await Employee.findById(feedbackId);
            if (data) {
                list.push(data);
            }
        });

        await Promise.all(employeePromises);

        res.render('employeeDashboard', {
            title: "Employee",
            allEmployee: list
        });
    } catch (error) {
        console.error("Error in performanceReviewList:", error);
        return res.status(500).send("<h1>Error in sending data to Employee Dashboard!</h1>");
    }
}





module.exports.submitFeedback = async function (req, res) {
    try {
        // Create and save a new Performance document
        var addPerformance = await Performance(req.body);
        addPerformance.save();

        // Find employee by ID and update their status
        const employeeById = await Employee.findById(req.body.employees);
        employeeById.like = true;
        employeeById.performances = addPerformance.id;
        await employeeById.save();

        // Find all admin documents and update their performance array
        const allAdmin = await Admin.find({});
        for (var i = 0; i < allAdmin.length; i++) {
            allAdmin[i].performance.push(addPerformance.id);
            allAdmin[i].save();
        }

        // Flash success message and redirect
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