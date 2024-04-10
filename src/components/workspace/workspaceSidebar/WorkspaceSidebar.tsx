import {
  PaymentRequest,
  RequestBtn,
  SafeAddress,
  SidebarContainer,
  SidebarLinkList,
  WorkspaceInfo,
} from "./WorkspaceSidebar.style";
import add from "../../../assets/workspace/plus-white.svg";
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
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NewPaymentRequest from "../../../pages/workspaceDashboard/newPaymentRequest/NewPaymentRequest";
import { useWorkspace } from "../../../store/useWorkspace";
import { useSafeStore } from "../../../store/useSafeStore";
import { clientToSigner } from "../../../utils/ethProvider";
import { useConnectorClient, useSwitchChain, useAccount } from "wagmi";
import { useLoading } from "../../../store/useLoading";
import { toast } from "react-toastify";
import { useSharePaymentRequest } from "../../../store/useSharePaymentRequest";
import CopyBox from "../../copy";
import styled from "@emotion/styled";
import { BuildVersion } from "../../userDashboard/userSidebar/UserSidebar";
import Version from "../../version";
import { IconButton, SvgIcon, Typography } from "@mui/material";
import { getChainLogo } from "../../../utils/chain";

export interface SidebarProps {
  hideSidebar: boolean;
}

const WorkspaceSidebar = () => {
  const { t } = useTranslation();
  const { id } = useParams<string>();
  const [newPaymentsVisible, setNewPaymentsVisible] = useState(false);
  const { getWorkspaceDetails, workspace } = useWorkspace();
  const { initSafeSDK, safeApiService, getSafeInfo } = useSafeStore();
  const { data: client } = useConnectorClient();
  const { switchChainAsync } = useSwitchChain();
  const { setLoading } = useLoading();

  useEffect(() => {
    getWorkspaceDetails(Number(id));
  }, [getWorkspaceDetails, id]);
  const { isConnected, address } = useAccount();
  console.log(isConnected, address);
  const { getPaymentRequestShareCode } = useSharePaymentRequest();

  const handleSwitchChain = async () => {
    setLoading(true);
    try {
      await switchChainAsync({ chainId: workspace.chain_id });
    } catch (error) {
      console.error(error);
      toast.error(
        `Please switch to the chain ${workspace.chain_id} and use the workspace`,
        { autoClose: false }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workspace.ID) {
      const init = async () => {
        if (!client) {
          console.log(client);

          return;
        }

        const signer = await clientToSigner(client);

        let network: any = null;
        try {
          network = await signer?.provider?.getNetwork();
        } catch (error) {
          await handleSwitchChain();
          return;
        }
        if (network?.chainId !== BigInt(workspace.chain_id)) {
          await handleSwitchChain();
          return;
        }
        signer &&
          initSafeSDK(workspace.chain_id, signer, workspace.vault_wallet);
      };
      init();
    }
  }, [workspace?.chain_id, workspace?.vault_wallet, client]);

  useEffect(() => {
    workspace?.vault_wallet &&
      safeApiService &&
      getSafeInfo(workspace?.vault_wallet);
  }, [workspace?.vault_wallet, safeApiService]);

  const recipientFormate = (n: string) => {
    return `${n.slice(0, 6)}...${n.slice(-4)}`;
  };
  // share link
  const [shareLink, setShareLink] = useState<string>("");

  const handleCreateShareLink = () => {
    getPaymentRequestShareCode(id).then((res) => {
      if (res) {
        setShareLink(res);
        navigator.clipboard.writeText(`${window.location.origin}/share/${res}`);
      }
    });
  };
  const [hideSidebar, setHideSidebar] = useState(false);
  const handleSidebar = () => {
    setHideSidebar(!hideSidebar);
  };
  return (
    <>
      <SidebarContainer hideSidebar={hideSidebar}>
        <SidebarHeader hideSidebar={hideSidebar}>
          <Typography color="#64748B" fontSize="14px" fontWeight={400}>
            WORKSPACE
          </Typography>

          <IconButton onClick={handleSidebar}>
            <SvgIcon
              sx={{
                width: "16px",
                height: "16px",
                transform: hideSidebar ? "rotate(180deg)" : "rotate(0)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.33333 11.3334L4 8.00008L7.33333 4.66675"
                  stroke="#94A3B8"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 11.3334L8.66663 8.00008L12 4.66675"
                  stroke="#94A3B8"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SvgIcon>
          </IconButton>
        </SidebarHeader>

        <WorkspaceInfo hideSidebar={hideSidebar}>
          <Workspace key={workspace.ID}>
            {workspace.avatar === "" ? (
              <p>{workspace.name.slice(0, 1)}</p>
            ) : (
              <img src={workspace.avatar} alt={workspace.name} />
            )}
            <ChainLogo src={getChainLogo(workspace.chain_id)} alt="" />
          </Workspace>

          {!hideSidebar && (
            <div>
              <h5>{workspace.name}</h5>
              <SafeAddress>
                <CopyBox text={workspace.vault_wallet}>
                  <span>{recipientFormate(workspace.vault_wallet)}</span>
                  <SvgIcon
                    sx={{ color: "#94A3B8", width: "12px", height: "12px" }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.75 1H4.3C4.1 1 3.9 1.1 3.75 1.25C3.6 1.4 3.5 1.6 3.5 1.8V8.2C3.5 8.4 3.6 8.6 3.75 8.75C3.9 8.9 4.1 9 4.3 9H9.2C9.4 9 9.6 8.9 9.75 8.75C9.9 8.6 10 8.4 10 8.2V3.25L7.75 1Z"
                        stroke="currentColor"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.5 3.7998V10.1998C1.5 10.3998 1.6 10.5998 1.75 10.7498C1.9 10.8998 2.1 10.9998 2.3 10.9998H7.2"
                        stroke="currentColor"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.5 1V3.5H10"
                        stroke="currentColor"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </SvgIcon>
                </CopyBox>
              </SafeAddress>
            </div>
          )}
          {/* arrow btn for hide the sidebar */}
        </WorkspaceInfo>
        {/* payment request btn and share btn */}
        <PaymentRequest>
          <span>
            <RequestBtn
              hideSidebar={hideSidebar}
              onClick={() => setNewPaymentsVisible(true)}
            >
              <img src={add} alt="" />
              {!hideSidebar && <span>{t("workspace.New")}</span>}
            </RequestBtn>
          </span>
          <RequestBtn hideSidebar={hideSidebar} onClick={handleCreateShareLink}>
            <img src={share} alt="" />
            {!hideSidebar && <span>{t("workspace.Share")}</span>}
          </RequestBtn>
        </PaymentRequest>
        {/* sidebar list */}
        <SidebarLinkList className="">
          <SidebarLink
            icon={assets}
            name={t("workspace.Assets")}
            to={`/workspace/${id}/assets`}
            hideSidebar={hideSidebar}
          />
          <SidebarLink
            icon={category}
            name={t("workspace.Category")}
            to={`/workspace/${id}/category`}
            hideSidebar={hideSidebar}
          />
          <SidebarLink
            icon={paymentRequest}
            name={t("workspace.PaymentRequest")}
            to={`/workspace/${id}/payment-request`}
            hideSidebar={hideSidebar}
          />
          <SidebarLink
            icon={queue}
            name={t("workspace.Queue")}
            to={`/workspace/${id}/queue`}
            hideSidebar={hideSidebar}
          />
          <SidebarLink
            icon={bookkeeping}
            name={t("workspace.Bookkeeping")}
            to={`/workspace/${id}/bookkeeping`}
            hideSidebar={hideSidebar}
          />
          <SidebarLink
            icon={reports}
            name={t("workspace.Reports")}
            to={`/workspace/${id}/reports`}
            hideSidebar={hideSidebar}
          />
          <SidebarLink
            icon={setting}
            name={t("workspace.Settings")}
            to={`/workspace/${id}/settings`}
            hideSidebar={hideSidebar}
          />
        </SidebarLinkList>
      </SidebarContainer>
      {!hideSidebar && (
        <BuildVersion>
          <Version />
        </BuildVersion>
      )}
      {newPaymentsVisible && (
        <NewPaymentRequest onClose={() => setNewPaymentsVisible(false)} />
      )}
    </>
  );
};

export default WorkspaceSidebar;

const SidebarHeader = styled.div<SidebarProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  img {
    width: 16px;
    transform: ${({ hideSidebar }) => hideSidebar && "rotate(180deg)"};
    cursor: pointer;
  }
  p {
    display: ${({ hideSidebar }) => (hideSidebar ? "none" : "flex")};
  }
`;

const Workspace = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--clr-gray-200);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  p {
    font-size: 14px;
    font-weight: 400;
    text-transform: uppercase;
  }
`;

const ChainLogo = styled.img`
  width: 16px;
  height: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(40%, 10%);
  border-radius: 50%;
`;
