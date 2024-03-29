const router = require('express').Router();
const facultyContoller = require('../Controllers/facultyController');
const isAuth = require('../middleware/isAuth');

router.post('/teaching/subjects',isAuth,facultyContoller.getFacultySubjects);
router.post('/marksattendance/add',isAuth,facultyContoller.postMarksAttendance);

module.exports = router;