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

const WorkSpaceForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [age, setAge] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };
  const createWorkspace = () => {
    navigate("/assets");
  };
  return (
    <Header>
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
                value={age}
                onChange={handleChange}
              >
                <MenuItem
                  value={10}
                  sx={{
                    "&:hover": { backgroundColor: "var(--hover-bg)" },
                    "&.Mui-selected": { backgroundColor: "var(--hover-bg)" },
                  }}
                >
                  Ten
                </MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={createWorkspace}>
              {t("workspaceForm.FormSubmitBtn")}
            </Button>
          </Safe>
        </WorkspaceForm>
      </WorkspaceContainer>
    </Header>
  );
};

export default WorkSpaceForm;
