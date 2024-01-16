import styled from "@emotion/styled";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useWorkspace } from "../../../store/useWorkspace";
import { useParams } from "react-router-dom";

const Settings = () => {
  const { t } = useTranslation();
  const { id } = useParams<string>();

  const { updateWorkspaceName, workspace, getWorkspaceDetails } =
    useWorkspace();
  const [workspaceName, setWorkspaceName] = useState<string>("");
  // handle workspace name update
  useEffect(() => {
    getWorkspaceDetails(id || "");
  }, [id]);
  const handleWorkspaceNameUpdate = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedName = e.target.value;
    setWorkspaceName(updatedName);
    if (id) {
      updateWorkspaceName(id, updatedName);
    }
  };
  console.log(workspace);

  return (
    <WorkspaceLayout>
      <SettingsContainer>
        <WorkspaceForm>
          <InputSection>
            <label htmlFor="">{t("workspaceForm.WorkspaceName")}</label>
            <input
              type="text"
              placeholder={t("workspaceForm.WorkspaceName")}
              value={workspaceName}
              onChange={handleWorkspaceNameUpdate}
            />
          </InputSection>
        </WorkspaceForm>
        <MultiSigner>
          <h3>{t("settings.MultiSigner")}</h3>
          <p>0x4d4b78d37090ed3e1eae6779ba2c3d6728052915</p>
          <p>0x4d4b78d37090ed3e1eae6779ba2c3d6728052915</p>
          <p>0x4d4b78d37090ed3e1eae6779ba2c3d6728052915</p>
        </MultiSigner>
      </SettingsContainer>
    </WorkspaceLayout>
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
