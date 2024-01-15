import Header from "../../components/layout/header/Header";
// import "./workSpaceForm.scss";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import { InputLabel, TextField } from "@mui/material";
import {
  Button,
  CreateSafe,
  Safe,
  WorkspaceContainer,
  WorkspaceForm,
} from "./WorkSpaceForm.style";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWorkspace } from "../../store/useWorkspace";
import { useLoading } from "../../store/useLoading";
import Loading from "../../utils/Loading";

const WorkSpaceForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { createWorkspace } = useWorkspace();
  const { isLoading } = useLoading();

  const [workspaceName, setWorkspaceName] = useState("");
  const [safe, setSafe] = useState("");

  const handleChange = (e: SelectChangeEvent) => {
    setSafe(e.target.value);
  };
  const formData = {
    chain_id: 1,
    name: workspaceName,
    vault_wallet: safe,
  };
  const handleCreateWorkspace = () => {
    createWorkspace(formData, navigate);
  };

  return (
    <Header>
      {isLoading && <Loading />}
      <WorkspaceContainer>
        <WorkspaceForm>
          <h3>{t("workspaceForm.FormTitle")}</h3>
          <p>{t("workspaceForm.FormDescription")}</p>

          <Safe className="safe">
            <InputLabel
              htmlFor="Workspace name"
              sx={{ pb: 1, color: "#111", fontSize: "18px" }}
            >
              {t("workspaceForm.WorkspaceName")}
            </InputLabel>
            <TextField
              id="outlined-basic"
              variant="outlined"
              placeholder="Eenter your workspace name"
              size="small"
              sx={{ minWidth: "100%" }}
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              inputProps={{
                maxLength: 10,
              }}
            />
            <CreateSafe>
              <p>{t("workspaceForm.AddASafe")}</p>
              <a href="https://safe.global/" target="_blank" rel="noreferrer">
                {t("workspaceForm.CreateASafe")} &gt;&gt;
              </a>
            </CreateSafe>
            {/* select */}
            <FormControl sx={{ minWidth: "100%" }} size="small">
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={safe}
                onChange={handleChange}
              >
                <MenuItem
                  value="0xB1eFff6F17eD9a8c7b14851805A625eeCF35004C"
                  sx={{
                    "&:hover": { backgroundColor: "var(--hover-bg)" },
                    "&.Mui-selected": { backgroundColor: "var(--hover-bg)" },
                  }}
                >
                  0xB1eFff6F17eD9a8c7b14851805A625eeCF35004C
                </MenuItem>
              </Select>
            </FormControl>
            <Button onClick={handleCreateWorkspace}>
              {t("workspaceForm.FormSubmitBtn")}
            </Button>
          </Safe>
        </WorkspaceForm>
      </WorkspaceContainer>
    </Header>
  );
};

export default WorkSpaceForm;
