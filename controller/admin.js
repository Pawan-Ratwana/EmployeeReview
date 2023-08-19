const Employee = require('../models/employee');
const Performance = require('../models/performance');
const Admin = require('../models/admin');
module.exports.addEmployeePage = async function (req, res) {
    // find all employee 
    var allEmployee = await Employee.find({});
    return res.render('adminEmployee', {
        title: "Admin Employee",
        allEmployee: allEmployee
    })
}
module.exports.addEmployee = async function (req, res) {
    try {
        const employeePresent = await Employee.find({ email: req.body.email });
        if (employeePresent.length > 0 && employeePresent) {
            req.flash('error', 'Already Added !!');
            return res.redirect('/admin_employee/employee_dashboard');
        } else {
            const addemployee = new Employee(req.body);
            await addemployee.save();
            // now add the employee to all admin
            var allAdmin = await Admin.findOne({ email: req.cookies.id });
            allAdmin.employeeId.push(addemployee.id);
            await allAdmin.save();
            req.flash('success', 'Employee added successfully !!');
            return res.redirect('/admin_employee/employee_dashboard');
        }
    } catch (error) {
        return res.send("Error in adding employee by admin");
    }
}

module.exports.deleteEmployee = async function (req, res) {
    try {
        var deletedEmployee = await Employee.findOne({ email: req.body.email });
        if (!deletedEmployee) {
            req.flash('error', 'Already Deleted !')
            return res.redirect('/admin_employee/employee_dashboard');
        } else {
            if (deletedEmployee.feedback.length > 0) {
                for (var i = 0; i < deletedEmployee.feedback.length; i++) {
                    await Performance.findOneAndDelete({ id: deletedEmployee.feedback[i] });
                }
            }
            var adminpart = await Admin.findOne({ email: req.cookies.id });
            adminpart.employeeId.splice(adminpart.employeeId.indexOf(deletedEmployee.id), 1);
            adminpart.performance.splice(adminpart.performance.indexOf(deletedEmployee.performances), 1);
            adminpart.save();
            await Employee.findOneAndDelete({ email: req.body.email });
            req.flash('success', 'Deleted Success fully !!');
            return res.redirect('/admin_employee/employee_dashboard');
        }
    } catch (error) {
        return res.send("Error in deleting Employee");
    }
}

module.exports.updateEmployee = async function (req, res) {
    try {
        const employeePresent = await Employee.findOne({ email: req.body.email });
        if (!employeePresent) {
            req.flash('error', 'Employee Email Not Found');
            return res.redirect('/admin_employee/employee_dashboard');
        }else{
            employeePresent.name = req.body.name;
            employeePresent.password = req.body.password;
            employeePresent.save();
            req.flash('success', 'Updated Success fully !!');
            return res.redirect('/admin_employee/employee_dashboard');
        }

    } catch (error) {
        return res.send("Error in updating Employee !!");
    }
}

//admin performance page
module.exports.adminPerformancePage = async function (req, res) {
    try {
        const loginAdmin = await Admin.findOne({ email: req.cookies.id });
        const performanceArray = loginAdmin.performance;
        const list = [];
        for (var i = 0; i < performanceArray.length; i++) {
            const data = await Performance.findById(performanceArray[i]).populate('employees');
            if (data != null) {
                list.push(data);
            }
        }
        const employeeList = await Employee.find({});
        return res.render('adminPerformance', {
            title: "AdminPerformancePage",
            list: list,
            employeeList: employeeList
        })
    } catch (error) {
        return res.send("error in admin performance panal !");
    }
}


// assign employee to participate in feedback
module.exports.assignEmployee = async function (req, res) {
    try {
        const forEmployee = await Employee.find({ email: req.body.fromEmployeeEmail });
        const assignFeedback = await Employee.find({ email: req.body.toEmployeeEmail });
        var index = assignFeedback[0].feedback.indexOf(forEmployee[0]._id.toString());
        if (index == -1) {
            assignFeedback[0].feedback.push(forEmployee[0]._id.toString());
            await assignFeedback[0].save();
            req.flash('success', 'Employee Assign Success fully !!');
        } else {
            req.flash('error', 'Employee Assign Already !!');
        }
        return res.redirect('back');
    } catch (error) {
        return res.send("Error while Assigning Employee");
    }
}