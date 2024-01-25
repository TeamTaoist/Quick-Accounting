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
import { useEffect, useState } from "react";
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
import NewPaymentRequest from "../../../pages/workspaceDashboard/newPaymentRequest/NewPaymentRequest";
import { useWorkspace } from "../../../store/useWorkspace";
import { useSafeStore } from "../../../store/useSafeStore";
import { useEthersSigner } from "../../../utils/ethProvider";

const WorkspaceSidebar = () => {
  const { t } = useTranslation();
  const { id } = useParams<string>();
  const [newPaymentsVisible, setNewPaymentsVisible] = useState(false);
  const { getWorkspaceDetails, workspace } = useWorkspace();
  const { initSafeSDK } = useSafeStore();
  const signerPromise = useEthersSigner();

  useEffect(() => {
    getWorkspaceDetails(Number(id));
  }, [getWorkspaceDetails, id]);

  useEffect(() => {
    if (workspace.ID) {
      const init = async () => {
        initSafeSDK(
          workspace.chain_id,
          await signerPromise,
          workspace.vault_wallet
        );
      };
      init();
    }
  }, [workspace?.chain_id, workspace?.vault_wallet]);

  const recipientFormate = (n: string) => {
    return `${n.slice(0, 6)}...${n.slice(-4)}`;
  };
  return (
    <>
      <SidebarContainer>
        <WorkspaceInfo>
          <div>
            <h5>{workspace.name}</h5>
            <p>{recipientFormate(workspace.creator)}</p>
          </div>
          <img src={arrow} alt="" />
        </WorkspaceInfo>
        {/* payment request btn and share btn */}
        <PaymentRequest>
          <span>
            <RequestBtn onClick={() => setNewPaymentsVisible(true)}>
              <img src={add} alt="" />
              <span>{t("workspace.New")}</span>
            </RequestBtn>
          </span>
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
      {newPaymentsVisible && (
        <NewPaymentRequest onClose={() => setNewPaymentsVisible(false)} />
      )}
      {/* {children} */}
    </>
  );
};

export default WorkspaceSidebar;
