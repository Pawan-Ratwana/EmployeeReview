const express = require('express');
const router = express.Router();
const passport = require('passport');
const index = require('../controller/index');
router.get('/', index.welcome);
// router.post('/login' , index.LoginEmployee);
router.post('/login' ,passport.authenticate('local',{failureRedirect:'/'}), index.LoginEmployee);
router.post('/assign_admin', index.registerAdmin);// to be deleted
router.get('/destroy_session',index.destroySession );
router.use('/employee' , require('./employee'));
router.use('/admin_employee' ,require('./adminEmployee'));
router.use('/admin_performance' , require('./adminPerformanceReview'));
module.exports = router;