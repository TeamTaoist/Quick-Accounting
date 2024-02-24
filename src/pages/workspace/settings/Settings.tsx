import styled from "@emotion/styled";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useWorkspace } from "../../../store/useWorkspace";
import { useParams } from "react-router-dom";
import useAsync from "../../../hooks/useAsync";
import {
  getSafeInfo,
  SafeInfo,
} from "@safe-global/safe-gateway-typescript-sdk";
import { useSafeStore } from "../../../store/useSafeStore";
import { toast } from "react-toastify";
import CHAINS from "../../../utils/chain";
import LinkIcon from "../../../assets/link.svg";
import CopyIcon from "../../../assets/copy.svg";
import CopyBox from "../../../components/copy";

const formatSafeAddress = (address: string, chainId: number) => {
  const short = CHAINS.find((chain) => chain.chainId === chainId)?.short;
  return `${short}:${address}`;
};

const Settings = () => {
  const { t } = useTranslation();
  const { id } = useParams<string>();

  const { owners } = useSafeStore();

  const {
    updateWorkspaceName,
    workspace,
    getWorkspaceDetails,
    getUserWorkspace,
  } = useWorkspace();
  const [workspaceName, setWorkspaceName] = useState<string>(workspace.name);
  const [settingLoading, isSettingLoading] = useState<boolean>(false);
  // handle workspace name update
  useEffect(() => {
    getWorkspaceDetails(id || "");
    getUserWorkspace();
  }, [id, settingLoading, getUserWorkspace, getWorkspaceDetails]);

  const handleUpdateWorkspaceName = async (
    e: React.FormEvent<HTMLFormElement> | React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (!workspaceName) {
      toast.error("Workspace name is empty");
    } else {
      if (id) {
        updateWorkspaceName(id, workspaceName).then((res) => {
          if (res) {
            isSettingLoading(!settingLoading);
          }
        });
      }
    }
  };
  console.log(workspace);

  const safeAddress = formatSafeAddress(
    workspace.vault_wallet,
    workspace.chain_id
  );

  // network
  const chainData = CHAINS.find(
    (chain) => chain.chainId === workspace.chain_id
  );

  return (
    <SettingsContainer>
      <WorkspaceForm onSubmit={handleUpdateWorkspaceName}>
        <InputSection>
          <label htmlFor="">{t("workspaceForm.WorkspaceName")}</label>
          <input
            type="text"
            placeholder={t("workspaceForm.WorkspaceName")}
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            onBlur={handleUpdateWorkspaceName}
          />
        </InputSection>
      </WorkspaceForm>
      <NetWork>
        <h3>Network</h3>
        <div>
          <img src={chainData?.logoPath} alt="" />
          <p>{chainData?.chainName}</p>
        </div>
      </NetWork>
      <SafeAddress>
        <h3>{t("settings.SafeAddress")}</h3>
        <p className="safe">
          <a
            href={`https://app.safe.global/transactions/queue?safe=${safeAddress}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{safeAddress}</span>
            <img src={LinkIcon} alt="" className="icon" />
          </a>
        </p>
      </SafeAddress>
      <MultiSigner>
        <h3>{t("settings.MultiSigner")}</h3>
        {owners?.map((owner) => (
          <p key={owner}>
            <CopyBox text={owner}>
              <span>{owner}</span>
              <img src={CopyIcon} alt="" className="icon" />
            </CopyBox>
          </p>
        ))}
      </MultiSigner>
    </SettingsContainer>
  );
};

export default Settings;

const SettingsContainer = styled.div`
  margin-top: 135px;
  margin-left: 63px;
`;
const WorkspaceForm = styled.form`
  max-width: 350px;
`;
const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
  label {
    font-size: 20px;
  }
  input {
    padding: 13px;
    border: 1px solid var(--border-table);
    border-radius: 5px;
  }
`;
const NetWork = styled.div`
  margin-top: 30px;
  h3 {
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 14px;
  }
  div {
    display: flex;
    align-items: center;
    gap: 10px;
    img {
      width: 26px;
      height: 26px;
    }
    p {
      font-size: 18px;
      color: var(--text-secondary);
    }
  }
`;
const MultiSigner = styled.div`
  margin-top: 30px;
  h3 {
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 14px;
  }
  p {
    font-size: 18px;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }
  p div,
  a {
    display: inline-flex;
    gap: 10px;
    align-items: center;
    color: var(--text-secondary);
  }
  .icon {
    width: 20px;
  }
`;

const SafeAddress = styled(MultiSigner)``;
