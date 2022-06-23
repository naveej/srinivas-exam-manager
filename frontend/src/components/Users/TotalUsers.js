import "./TotalUsers.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UserList from "./UserList";
import {CircularProgress} from "@mui/material";
import axios from "axios";
import {useContextData} from "../../hooks/useContextData";
import {useFetchCourses} from "../../hooks/useFetchCourses";
import Filter from "../UI/Filter/Filter";
import { FaSearch } from "react-icons/fa";
import {VscFilePdf} from "react-icons/vsc"

const TotalUsers = ({type}) => {
  const [users, setUsers] = useState([]);
  const [semFilter,setSemFilter] = useState([]);
  const[sem,setSem] = useState("");
  const [course, setCourse] = useState("");
  const [loading,setLoading] = useState(false);
  const {user} = useContextData();
  const location = useLocation();

  const filterCourses = useFetchCourses(user.deptId);

  useEffect(() => {
    setLoading(true);
    setUsers([]);

    const fetchUsers = async() => {
      try {
        const result = await axios.post(`/users/${type}`)
        setUsers(result.data);
        setLoading(false);
      } catch(err) {
        console.log(err);
      }
    }
    fetchUsers();
  },[location.pathname,type])

  const fetchSemesters = async (courseName) => {
    try {
      const resp = await axios.post('/semesters',{courseName});
      const data = await resp?.data;
      const semData = new Array(data.course_sem).fill('');
      setSemFilter(semData);
    } catch (error) {
        console.log(error);
    }
  };

  const handleCourseChange = async(e) => {
    const courseValue = e.target.value;
    fetchSemesters(courseValue);
    setCourse(courseValue);
    try {
      setLoading(true);
      const result = await axios.post(`/users/${type}/`,{courseValue,semester:sem});
      setUsers(result.data);
      setLoading(false);
    } catch(err) {
      console.log('approve error',err);
      setLoading(false);
    }
  }

  let showDOJ = true;
  if(type!=="student" || type !=="exam_coord") showDOJ = false;

  const handleSemesterChange = async(e) =>{
    const semester = e.target.value;
    setSem(semester);
    try {
      setLoading(true);
      const result = await axios.post(`/users/student/semfilter`,{semester,courseName:course});
      setUsers(result.data);
      setLoading(false);
    } catch(err) {
      console.log('approve error',err);
      setLoading(false);
    }
  }

  const handleHallticket = async () =>{
    try {
      const data = {
        courseName:course,
        semester:sem
      }
      const result = await axios.post('staff/halltickets',data,{responseType:"arraybuffer"});
      const arr = new Uint8Array(result.data);
      const blob = new Blob([arr], { type: 'application/pdf' });
      const objectUrl = window.URL.createObjectURL(blob);
      console.log(result.data);
      window.open(objectUrl);
      setLoading(false);
    } catch(err) {
        console.log(err);
        setLoading(false);
    }
  }

  const UpdateEligibility = async(index,value,regno) =>{
    const newState = [...users];
    newState[index].eligibility = value;
    setUsers([...newState]);
    try {
      const result = await axios.post('/staff/eligibility',{regno, eligibility:value});
      console.log(result.data);
  } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="users-main">
      {type==='student'&&<div className="users-Filter">
        <div className="users-searchBar">
          <FaSearch color="var(--light-grey)" size={20} />
          <input type="text" placeholder="Search Student Registration" />
        </div>
        <Filter 
        data={filterCourses} 
        label="Filter By Course" 
        filter="course" 
        handleCourseChange={handleCourseChange}
        />
        
        <Filter 
        data={semFilter} 
        label="Filter By Semester" 
        filter="semester" 
        handleSemesterChange={handleSemesterChange}
        />

        <div className={course&&sem? "btn-outlined flex" : "btn-outlined hallticket-disabled flex"} onClick={handleHallticket}>
          <VscFilePdf color="currentColor" size={22}/>
          <span>Generate Hall Tickets</span>
        </div>
      </div>}

      <table className="users-table-wrapper">
        <thead className="thead">
          <tr>
            <th>{type==="student" ? "RegNo" : type==="faculty" ? "Faculty ID" : type==="staff" ? "Staff ID" : "Coord ID"}</th>
            <th>Name</th>
            {type!=="student" && <th>Email</th>}
            {showDOJ && <th>DOJ</th>}
            {type==="student" && <th>Course</th>}
            {type==="student" && <th>Batch</th>}
            {type==="student" && <th>Semester</th>}
            <th>Details</th>
            {type==="student" && <th>Eligiblity</th>}
          </tr>
        </thead>
        {!loading&&<tbody>
          {users.map((obj,i) =>{
              return <UserList 
              key={Math.random()+Date.now()} 
              data={obj} 
              type={type}
              updateEligibility={UpdateEligibility}
              index={i}/>
          })}
        </tbody>}
      </table>
      {loading&&<div style={{marginTop:80}} className="flex"><CircularProgress size={45}/></div>}
    </div>
  );
};

export default TotalUsers;
