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

const WorkSpaceForm = () => {
  const [age, setAge] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <Header>
      <WorkspaceContainer>
        <WorkspaceForm>
          <h3>Set up a workspace</h3>
          <p>
            A workspace is where you send, swap, and offramp crypto from your
            Safe.
          </p>

          <Safe className="safe">
            <InputLabel
              htmlFor="Workspace name"
              sx={{ pb: 1, color: "#111", fontSize: "18px" }}
            >
              Workspace name
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
              <p>Add a Safe</p>
              <a href="https://safe.global/" target="_blank" rel="noreferrer">
                Create a Safe &gt;&gt;
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
            <Button>Set up workspace</Button>
          </Safe>
        </WorkspaceForm>
      </WorkspaceContainer>
    </Header>
  );
};

export default WorkSpaceForm;
