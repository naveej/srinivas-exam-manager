import "./NoData.css";
import {NoDataSvg} from "../../../Assets"
const NoData = ({text}) => {
  return (
    <div className="NoData-container flex">
        <h4>{text}</h4>
        <img src={NoDataSvg} alt="No Data" width="400px"/>
    </div>
  )
}

export default NoData;