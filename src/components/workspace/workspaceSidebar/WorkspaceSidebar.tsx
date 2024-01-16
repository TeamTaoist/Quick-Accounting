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
import setting from "../../../assets/workspace/setting.svg";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const WorkspaceSidebar = () => {
  const { t } = useTranslation();
  const { id } = useParams<string>();
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
          <Link to="/new-payment-request">
            <RequestBtn>
              <img src={add} alt="" />
              <span>{t("workspace.New")}</span>
            </RequestBtn>
          </Link>
          <Link to={"/new-workspace-payment-request"}>
            <RequestBtn>
              <img src={share} alt="" />
              <span>{t("workspace.Share")}</span>
            </RequestBtn>
          </Link>
        </PaymentRequest>
        {/* sidebar list */}
        <SidebarLinkList className="">
          <SidebarLink
            icon={assets}
            name={t("workspace.Assets")}
            to={`/workspace/${id}/assets`}
          />
          <SidebarLink
            icon={category}
            name={t("workspace.Category")}
            to={`/workspace/${id}/category`}
          />
          <SidebarLink
            icon={paymentRequest}
            name={t("workspace.PaymentRequest")}
            to={`/workspace/${id}/payment-request`}
          />
          <SidebarLink
            icon={queue}
            name={t("workspace.Queue")}
            to={`/workspace/${id}/queue`}
          />
          <SidebarLink
            icon={bookkeeping}
            name={t("workspace.Bookkeeping")}
            to={`/workspace/${id}/bookkeeping`}
          />
          <SidebarLink
            icon={reports}
            name={t("workspace.Reports")}
            to={`/workspace/${id}/reports`}
          />
          <SidebarLink
            icon={setting}
            name={t("workspace.Settings")}
            to={`/workspace/${id}/settings`}
          />
        </SidebarLinkList>
      </SidebarContainer>
      {/* {children} */}
    </>
  );
};

export default WorkspaceSidebar;
