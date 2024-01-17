import { ChangeEvent, useEffect, useState } from "react";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";
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
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../utils/CustomModal";
import Archived from "./Archived";
import {
  CancelBtn,
  CategoryForm,
  CategoryOption,
  CategoryProperties,
  CategoryTitle,
  CreateBtn,
  CreateCategory,
  CreateCategoryBtn,
  CreateOptionButton,
  Details,
  DetailsInput,
  DropdownOption,
  Header,
  Option,
  OptionCreateButtons,
  Options,
  PropertyBtns,
  PropertyCreateButtons,
  PropertyInput,
  PropertyOptions,
  PropertyTitle,
} from "./category.style";
import { useCategory } from "../../../store/useCategory";
import { useLoading } from "../../../store/useLoading";
import Loading from "../../../utils/Loading";
const Category = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    getWorkspaceCategories,
    workspaceCategories,
    createWorkspaceCategory,
  } = useCategory();
  const { isLoading } = useLoading();

  const [selectedValue, setSelectedValue] = useState("Text");
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // end
  const [categoryLoading, setCategoryLoading] = useState<boolean>(false);
  // get all categories
  useEffect(() => {
    getWorkspaceCategories(id || "");
  }, [getWorkspaceCategories, id, categoryLoading]);
  // create new workspace category
  const createCategoryFormData = {
    name: "Category name",
    workspace_id: Number(id),
  };
  const handleCreateCategory = () => {
    createWorkspaceCategory(createCategoryFormData);
    setCategoryLoading(!categoryLoading);
  };

  return (
    <WorkspaceLayout>
      {/* {isLoading && <Loading />} */}
      <CreateCategory>
        {workspaceCategories.data.total === 0 && (
          <CategoryTitle>
            <h3>You don't have any categories.</h3>
            <p>Standardize your payments and bookkeeping with categories.</p>
            <CreateOptionButton>
              <CreateBtn>
                <img src={add} alt="" />
                <span>{t("category.CreateCategory")}</span>
              </CreateBtn>
              <CreateBtn>
                <img src={archive} alt="" />
                <span>{t("category.ViewArchives")}</span>
              </CreateBtn>
            </CreateOptionButton>
          </CategoryTitle>
        )}
        {/* create category option */}
        <CategoryForm>
          {/* header btn */}
          <CreateOptionButton>
            <CreateBtn onClick={handleCreateCategory}>
              <img src={add} alt="" />
              <span>Create category</span>
            </CreateBtn>
            <CreateBtn onClick={handleOpenModal}>
              <img src={archive} alt="" />
              <span>View archive</span>
            </CreateBtn>
            <CustomModal
              open={openModal}
              setOpen={setOpenModal}
              component={Archived}
            />
          </CreateOptionButton>
          {/* category option */}
          {workspaceCategories.data.rows.map((category) => (
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
                      <PropertyOptions>
                        <h4>ADD PROPERTIES</h4>
                        <Option>
                          <PropertyTitle>
                            <img src={property1} alt="" />
                            <p>Property</p>
                          </PropertyTitle>
                          <img src={archive} alt="" />
                        </Option>
                      </PropertyOptions>
                      {/* property input section */}
                      <Details>
                        <>
                          <DetailsInput>
                            <h3>Property name</h3>
                            <PropertyInput placeholder="Property name" />
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
                                  "&:hover": {
                                    backgroundColor: "var(--hover-bg)",
                                  },
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
                        </>
                      </Details>
                    </Options>
                    {/* property button section */}
                    <PropertyBtns>
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
                      <PropertyCreateButtons>
                        <CreateCategoryBtn>Create</CreateCategoryBtn>
                        <CancelBtn>Cancel</CancelBtn>
                      </PropertyCreateButtons>
                    </PropertyBtns>
                  </CategoryProperties>
                  {/* category property end */}
                </AccordionDetails>
              </Accordion>
            </CategoryOption>
          ))}
        </CategoryForm>
      </CreateCategory>
    </WorkspaceLayout>
  );
};

export default Category;
