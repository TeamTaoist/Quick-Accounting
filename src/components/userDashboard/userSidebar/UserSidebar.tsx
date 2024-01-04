import "./userSidebar.scss";
import addressCard from "../../../assets/dashboard/address-card.svg";
import file from "../../../assets/dashboard/file.svg";

const UserSidebar = () => {
  return (
    <div className="user-sidebar">
      {/* user address */}
      <div className="user-address">
        <div className="address">
          <img src={addressCard} alt="" />
          <p>0x4dgf...2915</p>
        </div>
        <button className="disconnect">Disconnect</button>
      </div>
      {/* user payment request */}
      <div className="payment-request">
        <ul>
          <li>
            <img className="file" src={file} alt="" />
            <span>My payment request</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserSidebar;
