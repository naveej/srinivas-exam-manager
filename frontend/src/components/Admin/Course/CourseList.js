import {BiEditAlt} from "react-icons/bi";
import {Link} from "react-router-dom";
const CourseList = ({name,duration,totalSem,courseId}) => {
    return(
        <tr>
                <td>{name}</td>
                <td>{duration} years</td>
                <td>{totalSem} Semesters</td>
                <td><Link to={'/courses/course-details/'+courseId}>view</Link></td>
                <td>
                    <button className="course-edit-btn btn-outlined flex">
                        <BiEditAlt size={15} color="var(--primary-color) :hover{color:var(--white)}"/>
                        <span>Edit</span>
                    </button>
                </td>
        </tr>
    )
}

export default CourseList;