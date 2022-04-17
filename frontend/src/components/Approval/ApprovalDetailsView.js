import { useEffect } from "react";
import { Avatar, Camera, Tick, Plus, Back } from "../../Assets";
import { useContextData } from "../../hooks/useContextData";
import { useNavigate } from "react-router-dom";
import "./ApprovalDetailsView.css";

const StudentApprovalView = () => {
  const navigate = useNavigate();

  const {
    approve,
    setApprove,
    approveText,
    setApproveText,
    rejectText,
    setRejectText,
  } = useContextData();

  // const [approve, setApprove] = useState("");
  // const [approveText, setApproveText] = useState("Approve");
  // const [rejectText, setRejectText] = useState("Reject");

  const ApproveBtn = document.querySelector(".green");
  const ApproveSVG = document.querySelector(".green img");
  const RejectBtn = document.querySelector(".red");
  const RejectSVG = document.querySelector(".red img");

  useEffect(() => {
    if (approve !== "") {
      if (approve === "Approve") {
        RejectBtn.style.display = "none";
        ApproveBtn.style.marginRight = "0px";
        ApproveBtn.style.backgroundColor = "transparent";
        ApproveBtn.style.cursor = "default";
        ApproveBtn.style.color = "var(--strong-green)";
        ApproveSVG.style.filter = "var(--svg-green)";
        setApproveText("Approved");
      }
      if (approve === "Reject") {
        ApproveBtn.style.display = "none";
        RejectBtn.style.marginRight = "0px";
        RejectBtn.style.backgroundColor = "transparent";
        RejectBtn.style.cursor = "default";
        RejectBtn.style.color = "var(--strong-red)";
        RejectSVG.style.filter = "var(--svg-red)";
        setRejectText("Rejected");
      }
    }
  }, [approve]);

  return (
    <div className="ApprovalDetailsView content">
      <div className="approve-user-info flex">
        <div className="back-btn flex" onClick={() => navigate(-1)}>
          <img src={Back} alt="back" width="30px" /> <span>Back</span>
        </div>
        <div className="approve-user-avatar flex">
          <div className="approve-avatar">
            <img src={Avatar} width="60px" alt="avatar" />
            <div
              className="approve-camera"
              onClick={() => {
                document.querySelector("#imagePicker").click();
              }}
            >
              <img src={Camera} width="20px" alt="camera" />
              <input
                type="file"
                id="imagePicker"
                style={{ display: "none" }}
                accept="image/png, image/jpeg"
              />
            </div>
          </div>
        </div>

        <div className="approve-user-title flex">
          <span className="approve-user-name">John Doe</span>
          <span className="approve-user-data">BCA 3rd Year</span>
        </div>
      </div>

      <div className="approve-buttons flex">
        <button
          className="approve-btn green flex"
          onClick={() => {
            setApprove("Approve");
          }}
        >
          <img src={Tick} alt="Tick" width="25px" /> {approveText}
        </button>
        <button
          className="approve-btn red flex"
          onClick={() => {
            setApprove("Reject");
          }}
        >
          <img src={Plus} alt="Times" width="25px" /> {rejectText}
        </button>
      </div>

      <div className="approve-form flex">
        <div className="approve-details">
          <div className="approveRow">
            <span>First Name</span> John
          </div>
          <div className="approveRow">
            <span>Last Name</span> Doe
          </div>
          <div className="approveRow">
            <span>Phone</span> 9584625345
          </div>
          <div className="approveRow">
            <span>Email</span> johndoe@gmail.com
          </div>
          <div className="approveRow">
            <span>Date of Birth</span> 15/04/2022
          </div>
          <div className="approveRow">
            <span>Gender</span> Male
          </div>
          <div className="approveRow">
            <span>Blood Group</span> B positive
          </div>
          <div className="approveRow">
            <span>Aadhar No.</span> 1234 5678 9123 4567
          </div>
          <div className="approveRow">
            <span>Religion</span> Hindu
          </div>
          <div className="approveRow">
            <span>Caste</span> GanjaGang
          </div>
          <div className="approveRow">
            <span>Place of Birth</span> Mangalore
          </div>
          <div className="approveRow">
            <span>District of Birth</span> Dakshina Kannada
          </div>
          <div className="approveRow">
            <span>Country of Birth</span> India
          </div>
          <div className="approveRow">
            <span>Identity Mark</span> tatoo
          </div>
          <div className="approveRow">
            <span>Registratoin No.</span> 3SU19SA011
          </div>
          <div className="approveRow">
            <span>Pincode</span> 575028
          </div>
          <div className="approveRow">
            <span>Address</span> Mangalore, Karnataka, India sasda ada da sdad
            asdasdasdd
          </div>
        </div>

        <h3>Father's Details</h3>
        <div className="approve-details">
          <div className="approveRow">
            <span>First Name</span> John Doe
          </div>
          <div className="approveRow">
            <span>Occupation</span> Developer
          </div>
          <div className="approveRow">
            <span>Mobile No.</span> 9584625345
          </div>
          <div className="approveRow">
            <span>Email</span> johndoe@gmail.com
          </div>
        </div>

        <h3>Mother's Details</h3>
        <div className="approve-details">
          <div className="approveRow">
            <span>First Name</span> Jane Doe
          </div>
          <div className="approveRow">
            <span>Occupation</span> Developer
          </div>
          <div className="approveRow">
            <span>Mobile No.</span> 9584625345
          </div>
          <div className="approveRow">
            <span>Email</span> johndoe@gmail.com
          </div>
        </div>

        <h3>Guardian's Details</h3>
        <div className="approve-details">
          <div className="approveRow">
            <span>First Name</span> Jane Doe
          </div>
          <div className="approveRow">
            <span>Occupation</span> Developer
          </div>
          <div className="approveRow">
            <span>Mobile No.</span> 9584625345
          </div>
          <div className="approveRow">
            <span>Email</span> johndoe@gmail.com
          </div>
        </div>

        <h3>Admission Details</h3>
        <div className="approve-details">
          <div className="approveRow">
            <span>Department</span> CCIS
          </div>
          <div className="approveRow">
            <span>Course</span> BCA
          </div>
          <div className="approveRow">
            <span>Joining Academic Year</span> 2005
          </div>
          <div className="approveRow">
            <span>Degree Year</span> 2010
          </div>
          <div className="approveRow">
            <span>Degree Batch</span> A
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentApprovalView;
