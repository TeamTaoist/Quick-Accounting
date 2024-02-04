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
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  return (
    <SettingsContainer>
      <WorkspaceForm>
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
      <MultiSigner>
        <h3>{t("settings.MultiSigner")}</h3>
        {owners?.map((owner) => (
          <p key={owner}>{owner}</p>
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
const MultiSigner = styled.div`
  margin-top: 40px;
  h3 {
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 14px;
  }
  p {
    font-size: 18px;
    color: var(--text-secondary);
  }
`;
