import Header from "../../components/layout/header/Header";
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
  FormHeader,
  Item,
} from "./WorkSpaceForm.style";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getOwnedSafes,
  OwnedSafes,
} from "@safe-global/safe-gateway-typescript-sdk";
import useAsync from "../../hooks/useAsync";
import CHAINS from "../../utils/chain";
import { useWorkspace } from "../../store/useWorkspace";
import { useLoading } from "../../store/useLoading";
import Loading from "../../utils/Loading";
import { useAccount } from "wagmi";
import cancelBtn from "../../assets/auth/x.svg";
import CheckIcon from "@mui/icons-material/Check";
import rightArrow from "../../assets/asset-right-arrow.svg";

const WorkSpaceForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { createWorkspace } = useWorkspace();
  const { isLoading } = useLoading();
  const { address } = useAccount();

  const [safe, setSafe] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [selectChainId, setSelectChanId] = useState(CHAINS[0].chainId);

  const [data, error, loading] = useAsync<OwnedSafes>(
    () => {
      return getOwnedSafes(String(selectChainId), address!);
    },
    [selectChainId, address],
    false
  );
  console.log(data, error, loading);
  const safeList = loading ? [] : data?.safes || [];

  const handleChange = (event: SelectChangeEvent) => {
    setSafe(event.target.value);
  };

  const formData = {
    chain_id: selectChainId,
    name: workspaceName,
    vault_wallet: safe,
  };
  const handleCreateWorkspace = () => {
    createWorkspace(formData, navigate);
    console.log("Clicked");
  };

  const onSelectChain = (e: any) => {
    setSelectChanId(e.target.value);
  };
  console.log(safe);

  return (
    <>
      {isLoading && <Loading />}
      <WorkspaceContainer>
        <WorkspaceForm>
          <FormHeader>
            <div>
              <h3>{t("workspaceForm.FormTitle")}</h3>
              <img src={cancelBtn} alt="" onClick={() => navigate(-1)} />
            </div>
            <p>{t("workspaceForm.FormDescription")}</p>
          </FormHeader>
          <Safe className="safe">
            <InputLabel
              htmlFor="Workspace name"
              sx={{
                pb: 1,
                fontSize: "14px",
                fontWeight: "500",
                color: "var(--clr-primary-900)",
              }}
            >
              {t("workspaceForm.WorkspaceName")}
            </InputLabel>
            <TextField
              id="outlined-basic"
              variant="outlined"
              placeholder="Enter your workspace name"
              size="small"
              sx={{
                width: "100%",
                "& fieldset.MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--clr-gray-300)",
                  borderRadius: "6px",
                },
                "& .MuiInputBase-input": {
                  height: "19px",
                },
              }}
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
            <CreateSafe>
              <p>{t("workspaceForm.AddASafe")}</p>
              <a href="https://safe.global/" target="_blank" rel="noreferrer">
                {t("workspaceForm.CreateASafe")} <img src={rightArrow} alt="" />
              </a>
            </CreateSafe>
            {/* select */}
            <SelectBox>
              <Select
                value={selectChainId}
                onChange={onSelectChain}
                size="small"
                sx={{
                  width: "395px",
                  height: "42px",
                }}
                MenuProps={{
                  sx: {
                    "& .MuiMenuItem-root": {
                      marginInline: "10px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      margin: "5px",
                      "&:hover": {
                        bgcolor: "var(--clr-gray-100)",
                      },
                      "&.Mui-selected": {
                        bgcolor: "var(--clr-gray-100)",
                      },
                    },
                  },
                }}
              >
                {CHAINS.map((item) => (
                  <MenuItem value={item.chainId} key={item.chainId}>
                    <ChainMenuItem>
                      <img src={item.logoPath} alt="" />
                      {item.chainName}
                    </ChainMenuItem>
                  </MenuItem>
                ))}
              </Select>
              <Select
                fullWidth
                size="small"
                value={safe}
                onChange={handleChange}
                sx={{ overflow: "hidden" }}
                renderValue={(selectedValue) => (
                  <div style={{ overflow: "hidden", fontSize: "14px" }}>
                    {selectedValue}
                  </div>
                )}
                MenuProps={{
                  sx: {
                    "& .MuiMenuItem-root": {
                      marginInline: "10px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      margin: "5px 8px",
                      "&:hover": {
                        bgcolor: "var(--clr-gray-100)",
                      },
                      "&.Mui-selected": {
                        bgcolor: "var(--clr-gray-100)",
                      },
                    },
                  },
                }}
              >
                {safeList.map((item) => (
                  <MenuItem
                    value={item}
                    key={item}
                    sx={{ paddingInline: "5px" }}
                  >
                    <Item>
                      <div
                        style={{
                          width: "14px",
                          marginRight: "10px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {safe === item && (
                          <CheckIcon
                            style={{ color: "#334155", width: "16px" }}
                          />
                        )}
                      </div>

                      {item}
                    </Item>
                  </MenuItem>
                ))}
              </Select>
            </SelectBox>
            <Button
              onClick={handleCreateWorkspace}
              disabled={!workspaceName || !safe || !workspaceName.trim()}
            >
              {t("workspaceForm.FormSubmitBtn")}
            </Button>
          </Safe>
        </WorkspaceForm>
      </WorkspaceContainer>
    </>
  );
};

export default WorkSpaceForm;
