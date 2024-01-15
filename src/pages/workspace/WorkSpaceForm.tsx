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
  ChainMenuItem,
  SelectBox,
} from "./WorkSpaceForm.style";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getOwnedSafes,
  OwnedSafes,
} from "@safe-global/safe-gateway-typescript-sdk";
import useAsync from "../../hooks/useAsync";
import CHAINS from "../../utils/chain";

const WorkSpaceForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [age, setAge] = useState("");
  const [selectChainId, setSelectChanId] = useState(137);

  const [data, error, loading] = useAsync<OwnedSafes>(
    () => {
      return getOwnedSafes(
        String(selectChainId),
        "0x8C913aEc7443FE2018639133398955e0E17FB0C1" // hardcode, just for test, it should be the user's address
      );
    },
    [selectChainId],
    false
  );
  console.log(data, error, loading);
  const safeList = loading ? [] : data?.safes || [];

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };
  const createWorkspace = () => {
    navigate("/assets");
  };

  const onSelectChain = (e: any) => {
    setSelectChanId(e.target.value);
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
            <SelectBox>
              <Select value={selectChainId} onChange={onSelectChain}>
                {CHAINS.map((item) => (
                  <MenuItem value={item.chainId} key={item.chainId}>
                    <ChainMenuItem>
                      <img src={item.logoPath} alt="" />
                      {item.chainName}
                    </ChainMenuItem>
                  </MenuItem>
                ))}
              </Select>
              <Select fullWidth value={age} onChange={handleChange}>
                {safeList.map((item) => (
                  <MenuItem value={item} key={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </SelectBox>
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
