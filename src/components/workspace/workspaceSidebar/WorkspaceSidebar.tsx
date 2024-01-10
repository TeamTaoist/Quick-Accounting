import {
  PaymentRequest,
  RequestBtn,
  SidebarContainer,
  SidebarLinkList,
  WorkspaceInfo,
} from "./WorkspaceSidebar.style";
import arrow from "../../../assets/workspace/arrow.svg";
import add from "../../../assets/workspace/add.svg";
import share from "../../../assets/workspace/share.svg";
import { useState } from "react";
import SidebarLink from "../SidebarLink";
import assets from "../../../assets/workspace/assets.svg";
import category from "../../../assets/workspace/category.svg";
import paymentRequest from "../../../assets/workspace/payment-request.svg";
import queue from "../../../assets/workspace/queue.svg";
import bookkeeping from "../../../assets/workspace/bookkeeping.svg";
import reports from "../../../assets/workspace/reports.svg";
import { Link } from "react-router-dom";

const WorkspaceSidebar = () => {
  return (
    <>
      <SidebarContainer>
        <WorkspaceInfo>
          <div>
            <h5>workspace name</h5>
            <p>0xB1234···004C</p>
          </div>
          <img src={arrow} alt="" />
        </WorkspaceInfo>
        {/* payment request btn and share btn */}
        <PaymentRequest>
          <Link to="/payment-request">
            <RequestBtn>
              <img src={add} alt="" />
              <span>New</span>
            </RequestBtn>
          </Link>
          <Link to={"/new-workspace-payment-request"}>
            <RequestBtn>
              <img src={share} alt="" />
              <span>Share</span>
            </RequestBtn>
          </Link>
        </PaymentRequest>
        {/* sidebar list */}
        <SidebarLinkList className="">
          <SidebarLink icon={assets} name="Assets" to="/assets" />
          <SidebarLink icon={category} name="Category" to="/category" />
          <SidebarLink
            icon={paymentRequest}
            name="Payment request"
            to="/payment-request"
          />
          <SidebarLink icon={queue} name="Queue （Signing）" to="/queue" />
          <SidebarLink
            icon={bookkeeping}
            name="Bookkeeping"
            to="/bookkeeping"
          />
          <SidebarLink icon={reports} name="Reports" to="/reports" />
        </SidebarLinkList>
      </SidebarContainer>
      {/* {children} */}
    </>
  );
};

export default WorkspaceSidebar;
