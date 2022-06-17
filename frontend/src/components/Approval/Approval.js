import ApprovaList from './ApprovalList/ApprovalList';
import "./Approval.css";
import { useState,useEffect } from 'react';
import axios from 'axios';
import {CircularProgress} from "@mui/material";
import {useLocation} from "react-router-dom";
import {useContextData} from "../../hooks/useContextData";
import Filter from '../UI/Filter/Filter';
import {NoData} from "../../Assets";

const Approval = ({type}) => {
  const [approveList,setApproveList] = useState([]);
  const [filterCourses,setFilterCourses] = useState([]);
  const [loading,setLoading] = useState(false);

  const userType = type==='staff'?'admin':'staff';
  const location = useLocation();
  const {user} = useContextData();

  useEffect(() => {
   const fetchApproveList = async() => {
    try {
      setLoading(true);
      const result = await axios.post(`/${userType}/approvelist/${type}`);
      setApproveList(result.data);
      setLoading(false);
    } catch(err) {
      console.log(err);
      setLoading(false);
    }
  }
  fetchApproveList();
  },[location.pathname,type,userType])

  useEffect(() => {
    const fetchCourses = async() => {
      try {
        const result = await axios.post('/courses',{deptId:user.deptId})
        setFilterCourses(result.data);
      } catch(err) {
        console.log(err)
      }
    }
    fetchCourses();
  },[user.deptId])

  const handleCourseChange = async(e) => {
    const courseName = e.target.value;
    try {
      setLoading(true);
      const result = await axios.post(`/${userType}/approvelist/${type}`,{courseName,deptId:user.deptId});
      setApproveList(result.data);
      setLoading(false);
    } catch(err) {
      console.log('approve error',err);
      setLoading(false);
    }
  }

  const handleApprove = async(id) => {
    try {
      setLoading(true);
      const result = await axios.post(`/${userType}/approve/${type}/${id}`);
      if(result.data.success) {
        setApproveList(state => {
          const newState = [...state];
          return newState.filter(item => {
            let userId=undefined;
            if(type==='student') {
               userId=item.regno;
            } else if(type==='faculty') {
               userId=item.faculty_id;
            } else {
               userId=item.staff_id;
            }
            return userId!==id
          })
        })
        setLoading(false);
      }
    } catch(err) {
      console.log('approve error',err);
      setLoading(false);
    }
  }

  const handleReject = async(id) => {
    try {
      setLoading(true);
      const result = await axios.post(`/${userType}/reject/${type}/${id}`);
      if(result.data.success) {
        setApproveList(state => {
          const newState = [...state];
          return newState.filter(item => {
            let userId=undefined;
            if(type==='student') {
               userId=item.regno;
            } else if(type==='faculty') {
               userId=item.faculty_id;
            } else {
               userId=item.staff_id;
            }
            return userId!==id
          })
        })
        setLoading(false);
      }
    } catch(err) {
      console.log('approve error',err);
      setLoading(false);
    }
  }

  return (
    <div className="approval-main content">
      <div className="approve-main-header">
      <h1 className="approve-list-header">{type.charAt(0).toUpperCase() + type.slice(1)} Approval</h1>
      {type==='student'&&<Filter 
      data={filterCourses} 
      filter="course" 
      label="Filter by Course"
      handleCourseChange={handleCourseChange}
      />}
      </div>

      <table className="approve-list-wrapper">
        <thead className="thead">
        <tr>
          {type==='student'&&<th>Profile</th>}
          <th>Name</th>
          {type==='student'&&<th>RegNo</th>}
          <th>Course</th>
          {type==='student'&&<th>Batch</th>}
          <th>Details</th>
          <th>Approval</th>
        </tr>
        </thead>
        {!loading &&<tbody>
        {approveList.length!==0 ? approveList.map(item => {
         return <ApprovaList 
         key={Math.random()}
         courseName={item.course_name}
         name={item.first_name+' '+item.last_name}
         joiningYear={item.joining_year}
         regno={item.regno}
         type={type}
         staffId={item.staff_id}
         facultyId={item.faculty_id}
         handleApprove={handleApprove}
         handleReject={handleReject}
         />
        }) 
        : 
        <tr className='approval-NoData'>
          <td colSpan="100%" className=''>
            <span>No Approval Request</span>
            <br />
            <img src={NoData} alt="No Data" width="400px"/>
          </td>
        </tr> }
        </tbody>}
      </table>
      {loading&&<div style={{marginTop:80}} className="flex"><CircularProgress size={45}/></div>}
    </div>
  )
}

export default Approval;
