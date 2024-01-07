import { useState } from "react";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";
import styled from "@emotion/styled";
import add from "../../../assets/workspace/add.svg";
import archive from "../../../assets/workspace/archive.svg";
import property1 from "../../../assets/workspace/property1.svg";
import option from "../../../assets/workspace/option.svg";
import select from "../../../assets/workspace/select.svg";
import multiSelect from "../../../assets/workspace/multi-select.svg";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import {
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import arrowBottom from "../../../assets/workspace/arrow-bottom.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const navigate = useNavigate();
  const [hasCategory, setHasCategory] = useState(true);
  const [selectedValue, setSelectedValue] = useState("Text");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };
  return (
    <WorkspaceLayout>
      <CreateCategory>
        {!hasCategory && (
          <CategoryTitle>
            <h3>You don't have any categories.</h3>
            <p>Standardize your payments and bookkeeping with categories.</p>
            <CreateOptionButton>
              <CreateBtn>
                <img src={add} alt="" />
                <span>Create category</span>
              </CreateBtn>
              <CreateBtn>
                <img src={archive} alt="" />
                <span>View archive</span>
              </CreateBtn>
            </CreateOptionButton>
          </CategoryTitle>
        )}
        {/* create category option */}
        <CategoryForm>
          {/* header btn */}
          <CreateOptionButton>
            <CreateBtn>
              <img src={add} alt="" />
              <span>Create category</span>
            </CreateBtn>
            <CreateBtn onClick={() => navigate("/archived")}>
              <img src={archive} alt="" />
              <span>View archive</span>
            </CreateBtn>
          </CreateOptionButton>
          {/* category option */}
          <CategoryOption>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ backgroundColor: "var(--hover-bg)" }}
              >
                <Header>
                  <Typography
                    sx={{
                      borderRadius: "7px",
                      padding: 1,
                      paddingInline: "16px",
                      backgroundColor: "var(--bg-primary)",
                    }}
                  >
                    Category name
                  </Typography>
                  <img src={archive} alt="" />
                </Header>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                {/* category property */}
                <CategoryProperties>
                  <Options>
                    <div>
                      <h4>ADD PROPERTIES</h4>
                      <Option>
                        <PropertyTitle>
                          <img src={property1} alt="" />
                          <p>Property name</p>
                        </PropertyTitle>
                        <img src={archive} alt="" />
                      </Option>
                    </div>

                    <OptionCreateButtons>
                      <button>
                        <img src={add} alt="" />
                        <span>Create property</span>
                      </button>
                      <button>
                        <img src={archive} alt="" />
                        <span>View archive</span>
                      </button>
                    </OptionCreateButtons>
                  </Options>
                  <Details>
                    <DetailsInput>
                      <h3>Property name</h3>
                      <PropertyInput type="text" placeholder="Property name" />
                      <h3>Property Type</h3>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={selectedValue}
                        onChange={handleChange}
                        size="small"
                        IconComponent={() => (
                          <InputAdornment position="start">
                            <img
                              src={arrowBottom}
                              alt="Custom Arrow Icon"
                              style={{ marginRight: "20px" }}
                            />
                          </InputAdornment>
                        )}
                        sx={{
                          minWidth: "100%",
                          "& fieldset": { border: 1 },
                        }}
                      >
                        <MenuItem
                          value="Text"
                          sx={{
                            "&:hover": { backgroundColor: "var(--hover-bg)" },
                            "&.Mui-selected": {
                              backgroundColor: "var(--hover-bg)",
                            },
                          }}
                        >
                          <DropdownOption>
                            <img src={option} alt="" /> Text
                          </DropdownOption>
                        </MenuItem>
                        <MenuItem value="single-select">
                          <DropdownOption>
                            <img src={select} alt="" /> Single-select
                          </DropdownOption>
                        </MenuItem>
                        <MenuItem value="multi-select">
                          <DropdownOption>
                            <img src={multiSelect} alt="" />
                            Multi-select
                          </DropdownOption>
                        </MenuItem>
                      </Select>
                    </DetailsInput>

                    <PropertyCreateButtons>
                      <CreateCategoryBtn>Create</CreateCategoryBtn>
                      <CancelBtn>Cancel</CancelBtn>
                    </PropertyCreateButtons>
                  </Details>
                </CategoryProperties>
                {/* category property end */}
              </AccordionDetails>
            </Accordion>
          </CategoryOption>
        </CategoryForm>
      </CreateCategory>
    </WorkspaceLayout>
  );
};

export default Category;

const CreateCategory = styled.div`
  padding-top: 30px;
  margin-left: 40px;
`;
export const CategoryTitle = styled.div`
  height: 100vh;
  /* border: 1px solid var(--border); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h3 {
    font-size: 30px;
    font-weight: 500;
  }
  p {
    font-size: 18px;
    padding: 30px 0;
  }
`;
export const CreateOptionButton = styled.div`
  display: flex;
  gap: 50px;
`;
export const CreateBtn = styled.button`
  background: var(--bg-primary);
  outline: none;
  border: none;
  font-size: 20px;
  font-weight: 400;
  padding: 10px 50px;
  border-radius: 4px;
  margin-top: 21px;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  img {
    width: 14px;
  }
`;
const CategoryForm = styled.div``;
const CategoryOption = styled.div`
  max-width: 900px;
  margin: 60px 0;
`;
const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  img {
    width: 24px;
    margin-right: 30px;
  }
`;
const CategoryProperties = styled.div`
  display: flex;
  height: 400px;
  border: 1px solid var(--border);
`;
const Options = styled.div`
  width: 50%;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h4 {
    font-size: 14px;
    font-weight: 500;
    padding-left: 10px;
    margin-top: 10px;
    color: #7c7777;
  }
`;
const Option = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 12px;
  margin-top: 20px;
  background: var(--bg-primary);

  img {
    width: 24px;
  }
  p {
    font-size: 18px;
  }
`;
const OptionCreateButtons = styled.div`
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: center;
  min-height: 80px;
  button {
    display: flex;
    background: transparent;
    gap: 7px;
    padding: 28px 40px;
    border: none;
    outline: none;
    img {
      width: 16px;
    }
    span {
      font-size: 16px;
    }
  }
  button:first-child {
    border-right: 1px solid var(--border);
  }
`;
const PropertyTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  img {
    width: 20px;
  }
`;
const Details = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const DetailsInput = styled.div`
  padding: 10px;
  h3 {
    font-size: 18px;
    font-weight: 400;
    padding: 10px 0;
  }
`;
const PropertyInput = styled.input`
  padding: 10px;
  width: 100%;
`;
const DropdownOption = styled.div`
  display: flex;
  gap: 14px;
  img {
    width: 16px;
  }
`;
const PropertyCreateButtons = styled.div`
  border-top: 1px solid var(--border);
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  height: 60px;
  min-height: 80px;
`;
const CreateCategoryBtn = styled.button`
  /* margin: 10px 40px; */
  padding: 8px 50px;
  background: var(--bg-primary);
  font-size: 18px;
  border: none;
  outline: none;
  border-radius: 10px;
`;
const CancelBtn = styled.button`
  background: transparent;
  outline: none;
  border: 1px solid var(--border);
  font-size: 18px;
  padding: 8px 50px;
  border-radius: 10px;
`;
