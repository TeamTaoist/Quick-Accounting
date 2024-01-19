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
  PropertyInputValue,
  PropertyOptions,
  PropertyTitle,
} from "./category.style";
import { useCategory } from "../../../store/useCategory";
import { useLoading } from "../../../store/useLoading";
import Loading from "../../../utils/Loading";
import { useCategoryProperty } from "../../../store/useCategoryProperty";

interface CategoryProperty {
  name: string;
  type: string;
  value: string;
}
interface CategoryPropertiesState {
  [categoryId: number]: CategoryProperty[];
}

const Category = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    getWorkspaceCategories,
    workspaceCategories,
    createWorkspaceCategory,
    getWorkspaceCategoryDetails,
    workspaceCategory,
    updateCategoryName,
    updateCategoryArchive,
  } = useCategory();
  const { isLoading } = useLoading();

  const {
    getWorkspaceCategoryProperties,
    workspaceCategoryProperties,
    createWorkspaceCategoryProperties,
    categoryProperty,
  } = useCategoryProperty();

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

  // create new workspace category
  const createCategoryFormData = {
    name: "Category name",
    workspace_id: Number(id),
  };
  const handleCreateCategory = () => {
    createWorkspaceCategory(createCategoryFormData);
    setCategoryLoading(!categoryLoading);
  };

  const [editableCategoryId, setEditableCategoryId] = useState<number>();
  const [categoryNameEditable, setCategoryNameEditable] =
    useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");

  //get workspace category details
  const handleCategory = (workspaceCategoryId: number) => {
    getWorkspaceCategoryDetails(workspaceCategoryId);
    setCategoryNameEditable(false);
  };
  // update category name
  const handleCategoryName = (e: any, categoryId: number) => {
    e.stopPropagation();
    setEditableCategoryId(categoryId);
    setCategoryNameEditable(true);
  };
  const handleUpdateCategoryName = (
    e: React.ChangeEvent<HTMLInputElement>,
    workspaceId: number,
    categoryId: number
  ) => {
    setCategoryName(e.target.value);
    updateCategoryName(workspaceId, categoryId, categoryName);
  };

  // update archive workspace category
  const handelArchiveCategory = (
    e: any,
    workspaceId: number,
    categoryId: number
  ) => {
    e.stopPropagation();
    updateCategoryArchive(workspaceId, categoryId);
    setCategoryLoading(!categoryLoading);
    console.log("update archive");
  };

  // get all categories
  const archiveQuery = false;
  const workspaceId = Number(id);
  useEffect(() => {
    getWorkspaceCategories(workspaceId, archiveQuery);
    // get workspace category properties
    getWorkspaceCategoryProperties(workspaceId);
  }, [
    getWorkspaceCategories,
    workspaceId,
    categoryLoading,
    archiveQuery,
    getWorkspaceCategoryProperties,
    openModal,
  ]);
  // add property
  const [categoryProperties, setCategoryProperties] =
    useState<CategoryPropertiesState>({});
  const handleAddProperty = (categoryId: number) => {
    const properties = categoryProperties[categoryId] || [];
    const newProperty: CategoryProperty = {
      name: "New Property",
      type: "Text",
      value: "",
    };
    setCategoryProperties({
      ...categoryProperties,
      [categoryId]: [...properties, newProperty],
    });
  };
  const handlePropertyNameChange = (
    categoryId: number,
    index: number,
    newName: string
  ) => {
    const updatedProperties = [...categoryProperties[categoryId]];
    updatedProperties[index].name = newName;
    setCategoryProperties({
      ...categoryProperties,
      [categoryId]: updatedProperties,
    });
  };
  const handlePropertyValueChange = (
    categoryId: number,
    index: number,
    newName: string
  ) => {
    const updatedProperties = [...categoryProperties[categoryId]];
    updatedProperties[index].value = newName;
    setCategoryProperties({
      ...categoryProperties,
      [categoryId]: updatedProperties,
    });
  };

  const handlePropertyTypeChange = (
    categoryId: number,
    index: number,
    newType: string
  ) => {
    const updatedProperties = [...categoryProperties[categoryId]];
    updatedProperties[index].type = newType;
    setCategoryProperties({
      ...categoryProperties,
      [categoryId]: updatedProperties,
    });
  };

  const [showProperty, setShowProperty] = useState<number>(0);

  const handleCreateProperty = (categoryId: number, propertyIndex: number) => {
    const propertyFormValues = categoryProperties[categoryId][showProperty];
    const propertyValues = {
      category_id: categoryId,
      name: propertyFormValues.name,
      type: propertyFormValues.type,
      values: propertyFormValues.value,
      workspace_id: Number(id),
    };
    createWorkspaceCategoryProperties(propertyValues);
    // if (categoryProperty.code === 200 && categoryProperty.msg === "success") {
    //   setShowProperty(0)
    //   // setCategoryProperties({});
    // }
  };
  // console.log(categoryProperties);
  // console.log(workspaceCategoryProperties);
  console.log(showProperty);

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
          {workspaceCategoryProperties.map((category, index) => (
            <CategoryOption key={category.ID}>
              <Accordion>
                <AccordionSummary
                  onClick={() => handleCategory(category.ID)}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={{ backgroundColor: "var(--hover-bg)" }}
                >
                  <Header>
                    <div onClick={(e) => handleCategoryName(e, category.ID)}>
                      {editableCategoryId === category.ID &&
                      categoryNameEditable ? (
                        <input
                          type="text"
                          value={categoryName}
                          placeholder="Category Name"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleUpdateCategoryName(
                              e,
                              category.workspace_id,
                              category.ID
                            )
                          }
                        />
                      ) : (
                        <Typography
                          sx={{
                            borderRadius: "7px",
                            padding: 1,
                            paddingInline: "16px",
                            backgroundColor: "var(--bg-primary)",
                          }}
                        >
                          {category.name}
                        </Typography>
                      )}
                    </div>

                    <img
                      onClick={(e) =>
                        handelArchiveCategory(
                          e,
                          category.workspace_id,
                          category.ID
                        )
                      }
                      src={archive}
                      alt=""
                    />
                  </Header>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  {/* category property */}
                  <CategoryProperties>
                    <Options>
                      <PropertyOptions>
                        <h4>ADD PROPERTIES</h4>
                        {category.properties?.map((property, index) => (
                          <div onClick={() => setShowProperty(index)}>
                            <Option>
                              <PropertyTitle>
                                <img src={property1} alt="" />
                                <p>{property.name}</p>
                              </PropertyTitle>
                              <img src={archive} alt="" />
                            </Option>
                          </div>
                        ))}
                        {categoryProperties[category.ID] &&
                          categoryProperties[category.ID].map(
                            (property, index) => (
                              <Option onClick={() => setShowProperty(index)}>
                                <PropertyTitle>
                                  <img src={property1} alt="" />
                                  <p>{property.name}</p>
                                </PropertyTitle>
                                <img src={archive} alt="" />
                              </Option>
                            )
                          )}
                      </PropertyOptions>
                      {/* property input section */}
                      <Details>
                        <>
                          {category.properties?.map((property, index) => (
                            <div>
                              {showProperty === index && (
                                <DetailsInput>
                                  <h3>Property name {index}</h3>
                                  <PropertyInput
                                    placeholder="Property name"
                                    value={property.name}
                                    onChange={(e) =>
                                      handlePropertyNameChange(
                                        category.ID,
                                        index,
                                        e.target.value
                                      )
                                    }
                                  />
                                  <h3>Property Type</h3>
                                  <Select
                                    labelId={`property-type-label-${index}`}
                                    id={`property-type-${index}`}
                                    value={property.type}
                                    onChange={(e) =>
                                      handlePropertyTypeChange(
                                        category.ID,
                                        index,
                                        e.target.value
                                      )
                                    }
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
                                        <img src={select} alt="" />{" "}
                                        Single-select
                                      </DropdownOption>
                                    </MenuItem>
                                    <MenuItem value="multi-select">
                                      <DropdownOption>
                                        <img src={multiSelect} alt="" />
                                        Multi-select
                                      </DropdownOption>
                                    </MenuItem>
                                  </Select>
                                  {/* property value */}
                                  {property.type !== "Text" && (
                                    <PropertyInputValue
                                      placeholder=""
                                      value={property.values}
                                      onChange={(e) =>
                                        handlePropertyNameChange(
                                          category.ID,
                                          index,
                                          e.target.value
                                        )
                                      }
                                    />
                                  )}
                                </DetailsInput>
                              )}
                            </div>
                          ))}
                          {/*  */}
                          {categoryProperties[category.ID] &&
                            categoryProperties[category.ID].map(
                              (property, index) => (
                                <div>
                                  {showProperty === index && (
                                    <DetailsInput>
                                      <h3>Property name</h3>
                                      <PropertyInput
                                        placeholder="Property name"
                                        value={property.name}
                                        onChange={(e) =>
                                          handlePropertyNameChange(
                                            category.ID,
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />
                                      <h3>Property Type</h3>
                                      <Select
                                        labelId={`property-type-label-${index}`}
                                        id={`property-type-${index}`}
                                        value={property.type}
                                        onChange={(e) =>
                                          handlePropertyTypeChange(
                                            category.ID,
                                            index,
                                            e.target.value
                                          )
                                        }
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
                                              backgroundColor:
                                                "var(--hover-bg)",
                                            },
                                            "&.Mui-selected": {
                                              backgroundColor:
                                                "var(--hover-bg)",
                                            },
                                          }}
                                        >
                                          <DropdownOption>
                                            <img src={option} alt="" /> Text
                                          </DropdownOption>
                                        </MenuItem>
                                        <MenuItem value="single-select">
                                          <DropdownOption>
                                            <img src={select} alt="" />{" "}
                                            Single-select
                                          </DropdownOption>
                                        </MenuItem>
                                        <MenuItem value="multi-select">
                                          <DropdownOption>
                                            <img src={multiSelect} alt="" />
                                            Multi-select
                                          </DropdownOption>
                                        </MenuItem>
                                      </Select>
                                      {/* property value */}
                                      {property.type !== "Text" && (
                                        <PropertyInputValue
                                          placeholder=""
                                          value={property.value}
                                          onChange={(e) =>
                                            handlePropertyValueChange(
                                              category.ID,
                                              index,
                                              e.target.value
                                            )
                                          }
                                        />
                                      )}
                                    </DetailsInput>
                                  )}
                                </div>
                              )
                            )}
                        </>
                      </Details>
                    </Options>
                    {/* property button section */}
                    <PropertyBtns>
                      <OptionCreateButtons>
                        <button onClick={() => handleAddProperty(category.ID)}>
                          <img src={add} alt="" />
                          <span>Create property</span>
                        </button>
                        <button>
                          <img src={archive} alt="" />
                          <span>View archive</span>
                        </button>
                      </OptionCreateButtons>
                      <PropertyCreateButtons>
                        <CreateCategoryBtn
                          onClick={() =>
                            handleCreateProperty(category.ID, index)
                          }
                        >
                          Create
                        </CreateCategoryBtn>
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
