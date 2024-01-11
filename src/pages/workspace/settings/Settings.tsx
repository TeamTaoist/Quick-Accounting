import styled from "@emotion/styled";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";

const Settings = () => {
  return (
    <WorkspaceLayout>
      <SettingsContainer>
        <WorkspaceForm>
          <InputSection>
            <label htmlFor="">Workspace name</label>
            <input type="text" placeholder="workspace name" />
          </InputSection>
        </WorkspaceForm>
        <MultiSigner>
          <h3>Multi-signer</h3>
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
