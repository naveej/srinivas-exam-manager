const db = require('../db');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.postNewCourse = async (req, res) => {
    const { duration, name, semesters } = req.body;
    const deptId = req.deptId;
    const err = validationResult(req).errors;
    if (err.length > 0) {
        return res.status(400).send(err);
    }
    const totalSemesters = semesters.length;
    const checkCourse = await db.execute(`select course_name from course where course_name='${name}'`);
    if (checkCourse[0].length > 0) {
        return res.status(403).send('course Already exists');
    }
    const courseSql = 'insert into course(dept_id,course_name,course_duration,course_sem) values(?,?,?,?)';
    db.execute(courseSql, [deptId, name, duration, totalSemesters])
        .then(() => {
            return db.execute(`select course_id from course where course_name='${name}'`)
        })
        .then(([result]) => {
            semesters.forEach(sem => {
                sem.subjects.forEach(sub => {
                    const semSql = `insert into semester(dept_id,course_id,sem_name,subj_name,subj_code) values(?,?,?,?,?)`;
                    return db.execute(semSql, [deptId, result[0].course_id, sem.semName, sub.name, sub.code])
                })
            })
        })
        .then((result) => {
            res.status(200).send({ success: true, result })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ success: false, err });
        })
}

exports.postNewDepartment = async (req, res) => {
    const { departmentName, firstName, lastName, dob, email, gender, address, phone, password } = req.body;
    const err = validationResult(req).errors;
    if (err.length > 0) {
        return res.status(400).send({ success: false, err });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 4);
        db.execute(`insert into department(dept_name) values(?)`, [departmentName])
            .then(() => {
                return db.execute(`select dept_id from department where dept_name='${departmentName}'`);
            })
            .then(([result]) => {
                const deptId = result[0].dept_id;
                const adminSql = `insert into admin(dept_id,first_name,last_name,gender,dob,email,address,phone,password) values(?,?,?,?,?,?,?,?,?)`;
                return db.execute(adminSql, [deptId, firstName, lastName, gender, dob, email, address, phone, hashedPassword])
            })
            .then(() => {
                res.send({ success: true, msg: 'Inserted Successfully' })
            })
            .catch(err => {
                // console.log(err);
                return res.status(500).send({ success: false, err });
            })
    } catch (err) {
        // console.log(err);
        return res.status(500).send({ success: false, err });
    }
}

exports.getDepartments = async (req, res) => {
    try {
        const result = await db.execute('select department.dept_id,dept_name,first_name from department JOIN admin ON department.dept_id=admin.dept_id');
        res.send(result[0]);
    } catch (err) {
        res.status(500).send({ success: false, err })
    }
}

exports.getCourses = async (req, res) => {
    const deptId = req.deptId;
    try {
        const result = await db.execute(`select course_id,course_name,course_sem,course_duration from course where dept_id=${deptId}`);
        res.send(result[0]);
    } catch (err) {
        console.log(err);
        res.status(404).send({ success: false });
    }
}

exports.getCourseDetails = async (req, res) => {
    const deptId = req.deptId;
    try {
        const result = await db.execute(`select sem_id,sem_name,subj_code,subj_name from semester where dept_id=${deptId} AND course_id=${req.body.courseId} order by sem_name`);
        res.send(result[0]);
    } catch (err) {
        console.log(err);
        res.status(404).send({ success: false });
    }
}

exports.postNewCoordinator = async (req, res) => {
    const { departmentName, firstName, lastName, dob, email, gender, address, phone, password } = req.body;
    const err = validationResult(req).errors;
    if (err.length > 0) {
        return res.status(400).send({ success: false, err });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 4);
        db.execute(`select dept_id from department where dept_name='${departmentName}'`)
            .then(([result]) => {
                const deptId = result[0].dept_id;
                const coordSql = `insert into exam_coord(dept_id,first_name,last_name,gender,dob,email,address,phone,password) values(?,?,?,?,?,?,?,?,?)`;
                return db.execute(coordSql, [deptId, firstName, lastName, gender, dob, email, address, phone, hashedPassword])
            })
            .then(() => {
                res.send({ success: true, msg: 'Inserted Successfully' })
            })
            .catch(err => {
                // console.log(err);
                return res.status(500).send({ success: false, err });
            })
    } catch (err) {
        // console.log(err);
        return res.status(500).send({ success: false, err });
    }
}

exports.getExamCoordinators = async (req, res) => {
    try {
        const result = await db.execute('select dept_name,first_name,coord_id from exam_coord join department on exam_coord.dept_id=department.dept_id');
        res.send(result[0]);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

exports.getStaffApproveList = async (req, res) => {
    const deptId = req.deptId;
    try {
        const sql = `select staff_id,first_name,last_name,joining_year from staff where dept_id=${deptId} and status='pending'`;
        const result = await db.execute(sql);
        res.send(result[0]);
    } catch (err) {
        res.status(500).send(err);
        console.log(err);
    }
}

exports.getApproveStaffDetail = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.execute(`select * from staff join department on staff.dept_id=department.dept_id where staff_id='${id}'`);
        res.status(200).send(result[0]);
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false })
    }
}

exports.postApproveStaff = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.execute(`update staff set status='approved' where staff_id='${id}'`);
        res.status(200).send({ success: true, data: result });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false })
    }
}

exports.postRejectStaff = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.execute(`delete from staff where staff_id='${id}'`);
        res.status(200).send({ success: true, data: result[0] });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false })
    }
}

exports.postNewTimeTable = (req, res) => {
    const { courseName, semester, timetable, tId } = req.body;
    const deptId = req.deptId;

    const sql = `insert into timetable(dept_id,course_id,semester,t_id,subj_name,subj_code,exam_date,exam_time,status) values(?,(select course_id from course where course_name=?),?,?,?,?,?,?,?)`;
    try {
        timetable.forEach(async ({ subjectName, subjectCode, examDate, examTime }) => {
            await db.execute(sql, [deptId, courseName, semester, tId, subjectName, subjectCode, examDate, examTime, 'pending']);
        })
        res.status(200).send({ success: true, result: 'Inserted Successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false })
    }
}

exports.getTimetables = async (req, res) => {
    const deptId = req.deptId;
    const sql = `select course_name,t_id,semester,count(subj_name) as total_subjects,date_format(convert_tz(created_at,@@session.time_zone,'+05:30'),'%d %b-%Y %l:%i %p') created_at,status from timetable join course on timetable.course_id=course.course_id where timetable.dept_id=${deptId} group by t_id order by created_at desc;`;
    try {
        const result = await db.execute(sql);
        res.status(200).send(result[0]);
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false })
    }
}