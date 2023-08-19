const express =require('express');
const router = express.Router();
const admin = require('../controller/admin');
router.get('/employee_dashboard' , admin.addEmployeePage);
router.post('/add_employee' , admin.addEmployee);
router.post('/delete_employee' , admin.deleteEmployee);
router.post('/update_employee' , admin.updateEmployee);
router.post('/assign_employee' , admin.assignEmployee);
module.exports = router;