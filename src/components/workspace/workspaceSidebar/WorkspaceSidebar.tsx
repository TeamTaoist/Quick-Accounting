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
import { clientToSigner } from "../../../utils/ethProvider";
import {
  type Config,
  useConnectorClient,
  useSwitchChain,
  useAccount,
} from "wagmi";
import { useLoading } from "../../../store/useLoading";
import { toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSharePaymentRequest } from "../../../store/useSharePaymentRequest";

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
  return (
    <>
      <SidebarContainer>
        <WorkspaceInfo>
          <div>
            <h5>{workspace.name}</h5>
            <p>{recipientFormate(workspace.vault_wallet)}</p>
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
          {/* <CopyToClipboard
            text={`${window.location.origin}/share/${shareLink}`}
            onCopy={handleCopy}
          > */}
          <RequestBtn onClick={handleCreateShareLink}>
            <img src={share} alt="" />
            <span>{t("workspace.Share")}</span>
          </RequestBtn>
          {/* </CopyToClipboard> */}
          {/* </Link> */}
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
