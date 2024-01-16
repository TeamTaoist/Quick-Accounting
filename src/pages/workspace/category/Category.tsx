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
  PropertyCreateButtons,
  PropertyInput,
  PropertyTitle,
} from "./category.style";
import { useCategory } from "../../../store/useCategory";
import { useLoading } from "../../../store/useLoading";
import Loading from "../../../utils/Loading";
// import CustomModal from "../../../utils/CustomModal";
// import Archived from "./Archived";

interface Service {
  property: string;
  dropdownValue: string;
}

// interface FormField {
//   categories: Service[];
// }

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

  const [hasCategory, setHasCategory] = useState(true);
  const [selectedValue, setSelectedValue] = useState("Text");
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const [formFields, setFormFields] = useState<Service[]>([]);

  const [selectedServiceIndexes, setSelectedServiceIndexes] = useState<
    (number | null)[]
  >([0]);

  const handleServiceChange = (
    e:
      | ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
      | SelectChangeEvent<string>,
    formIndex: number,
    // serviceIndex: number,
    property: string
  ) => {
    const { value } = e.target as { value: string };
    const fields = [...formFields];
    // fields[formIndex].categories[serviceIndex][property as keyof Service] =
    //   value;
    fields[formIndex][property as keyof Service] = value;
    setFormFields(fields);
  };

  // const handleServiceSubmit = (formIndex: number, serviceIndex: number) => {
  //   const selectedService = formFields[formIndex].categories[serviceIndex];
  // };

  // const handleAddServiceList = (formIndex: number) => {
  //   // const fields = [...formFields];
  //   // fields[formIndex].categories = [
  //   //   ...fields[formIndex].categories,
  //   //   { property: "Default property", dropdownValue: "Text" },
  //   // ];
  //   // setFormFields(fields);
  //   setFormFields([...formFields, { property: "Default property", dropdownValue: "Text" }]);
  //   setSelectedServiceIndexes((prevIndexes) => [...prevIndexes, null]);
  // };

  const handleAddFormField = () => {
    // setFormFields((prevFormFields) => [
    //   ...prevFormFields,
    //   { categories: [{ property: "", dropdownValue: "" }] },
    // ]);
    setFormFields([
      ...formFields,
      { property: "Default property", dropdownValue: "Text" },
    ]);
    setSelectedServiceIndexes((prevIndexes) => [...prevIndexes, 0]);
  };
  // end
  console.log(formFields);
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
                      <div>
                        <h4>ADD PROPERTIES</h4>
                        {formFields.map((singleService, serviceIndex) => (
                          <Option
                            key={serviceIndex}
                            onClick={() =>
                              setSelectedServiceIndexes((prevIndexes) => {
                                const newIndexes = [...prevIndexes];
                                newIndexes[serviceIndex] = serviceIndex;
                                return newIndexes;
                              })
                            }
                          >
                            <PropertyTitle>
                              <img src={property1} alt="" />
                              <p>{singleService.property}</p>
                            </PropertyTitle>
                            <img src={archive} alt="" />
                          </Option>
                        ))}
                      </div>

                      <OptionCreateButtons>
                        <button onClick={handleAddFormField}>
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
                      {formFields.map((singleService, serviceIndex) => (
                        <>
                          {selectedServiceIndexes[serviceIndex] ===
                            serviceIndex && (
                            <DetailsInput>
                              <h3>Property name</h3>
                              <PropertyInput
                                placeholder="Property name"
                                name={`service-${serviceIndex}-${serviceIndex}`}
                                type="text"
                                id={`service-${serviceIndex}-${serviceIndex}`}
                                value={singleService.property}
                                onChange={(e) =>
                                  handleServiceChange(
                                    e,
                                    // serviceIndex,
                                    serviceIndex,
                                    "property"
                                  )
                                }
                              />
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
                          )}
                        </>
                      ))}
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
          ))}
        </CategoryForm>
      </CreateCategory>
    </WorkspaceLayout>
  );
};

export default Category;
