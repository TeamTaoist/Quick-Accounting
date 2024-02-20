import { useEffect, useState } from "react";
import add from "../../../assets/workspace/add.svg";
import archive from "../../../assets/workspace/archive.svg";
import property1 from "../../../assets/workspace/property1.svg";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../utils/CustomModal";

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
  Header,
  Option,
  OptionCreateButtons,
  Options,
  PropertyBtns,
  PropertyCreateButtons,
  PropertyOptions,
  PropertyTitle,
} from "./category.style";
import { useCategory } from "../../../store/useCategory";
import { useCategoryProperty } from "../../../store/useCategoryProperty";
import CategoryPropertyDetails from "../../../components/workspace/category/CategoryPropertyDetails";
import LocalCategoryPropertyDetails from "../../../components/workspace/category/LocalCategoryPropertyDetails";
import CategoryArchivedList from "../../../components/workspace/category/CategoryArchivedList";
import CategoryPropertyArchivedList from "../../../components/workspace/category/CategoryPropertyArchivedList";

export interface CategoryProperty {
  name: string;
  type: string;
  value: "";
}
export interface CategoryPropertiesState {
  [categoryId: number]: CategoryProperty[];
}

const Category = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    getWorkspaceCategories,
    createWorkspaceCategory,
    updateCategoryName,
    updateCategoryArchive,
  } = useCategory();

  const {
    getWorkspaceCategoryProperties,
    workspaceCategoryProperties,
    createWorkspaceCategoryProperties,
    categoryProperty,
    updateWorkspaceCategoryProperties,
    archiveWorkspaceCategoryProperties,
  } = useCategoryProperty();

  const [selectedValue, setSelectedValue] = useState("Text");
  // category archive list
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleCategoryArchivedList = () => {
    setOpenModal(true);
    getWorkspaceCategories(workspaceId, true);
  };

  // category property archive list
  const [archivePropertyModal, setArchivePropertyModal] =
    useState<boolean>(false);
  const handleCategoryPropertyArchivedList = () => {
    setArchivePropertyModal(true);
    // getWorkspaceCategories(workspaceId, true);
  };

  // end
  const [categoryLoading, setCategoryLoading] = useState<boolean>(false);

  // create new workspace category
  const createCategoryFormData = {
    name: "Category name",
    workspace_id: Number(id),
  };
  const handleCreateCategory = async () => {
    await createWorkspaceCategory(createCategoryFormData);
    setCategoryLoading(!categoryLoading);
  };

  const [editableCategoryId, setEditableCategoryId] = useState<number>();
  const [categoryNameEditable, setCategoryNameEditable] =
    useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string | undefined>();

  //get workspace category details
  const handleCategory = (workspaceCategoryId: number) => {
    // getWorkspaceCategoryDetails(workspaceCategoryId);
    setCategoryNameEditable(false);
  };
  // update category name
  const handleCategoryName = (
    e: any,
    categoryId: number,
    categoryName: string
  ) => {
    e.stopPropagation();
    setEditableCategoryId(categoryId);
    setCategoryNameEditable(true);
    setCategoryName(categoryName);
  };
  const handleUpdateCategoryName = async (
    // e: React.ChangeEvent<HTMLInputElement>,
    workspaceId: number,
    categoryId: number
  ) => {
    await updateCategoryName(workspaceId, categoryId, categoryName);
    setCategoryLoading(!categoryLoading);
    setCategoryNameEditable(false);
  };
  console.log("update", categoryName);

  // update archive workspace category
  const handelArchiveCategory = async (
    e: any,
    workspaceId: number,
    categoryId: number
  ) => {
    e.stopPropagation();
    await updateCategoryArchive(workspaceId, categoryId);
    setCategoryLoading(!categoryLoading);
  };

  // get all categories
  const archiveQuery = false;
  const workspaceId = Number(id);
  useEffect(() => {
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

  // properties types values
  const [propertyValues, setPropertyValues] = useState<string[]>([]);

  const handleAddButtonClick = (categoryId: number, index: number) => {
    setPropertyValues([...propertyValues, ""]);
  };
  const handleDeleteProperty = (index: number) => {
    const updatedProperty = propertyValues.filter((_, i) => i !== index);
    setPropertyValues(updatedProperty);
  };
  const handlePropertyValueChang = (
    categoryId: number,
    index: number,
    newValue: string
  ) => {
    const updatedValues = [...propertyValues];
    updatedValues[index] = newValue;
    setPropertyValues(updatedValues);
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

  const [showProperty, setShowProperty] = useState<number | null>();

  const handleCreateProperty = async (
    categoryId: number,
    propertyIndex: number
  ) => {
    const propertyFormValues = categoryProperties[categoryId][showProperty!];
    const propertyValue = {
      category_id: categoryId,
      name: propertyFormValues?.name,
      type: propertyFormValues?.type,
      values: propertyValues.join(";"),
      workspace_id: Number(id),
    };
    await createWorkspaceCategoryProperties(propertyValue);
    if (categoryProperty.code === 200 && categoryProperty.msg === "success") {
      setShowProperty(null);
      // setCategoryProperties({});
      setPropertyValues([]);
      setCategoryProperties({});
      setCategoryLoading(!categoryLoading);
    }
  };
  const handlePropertyCancelBtn = (
    categoryId: number,
    propertyIndex: number
  ) => {
    const properties = categoryProperties[categoryId] || [];
    const updatedProperties = properties.filter(
      (_, index) => index !== propertyIndex
    );

    setCategoryProperties({
      ...categoryProperties,
      [categoryId]: updatedProperties,
    });
  };
  // update category properties
  const [propertyName, setPropertyName] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [propertyValue, setPropertyValue] = useState<string[]>([]);
  // const [updatedValues, setUpdatedValues] = useState<string[]>([]);
  const handleSelectedProperty = (property: ICategoryProperties) => {
    setShowProperty(property.ID);
    // setSelectedProperty(property);
    setPropertyName(property.name);
    setPropertyType(property.type);
    const valuesArray = property.values.split(";");
    const filteredValuesArray = valuesArray.filter(
      (value) => value.trim() !== ""
    );
    setPropertyValue(filteredValuesArray);
  };

  // console.log("property values", updatedValues);
  const handleSetPropertyType = (e: any) => {
    if (e.target.value === "Text") {
      setPropertyValue([]);
    }
    setPropertyType(e.target.value);
  };
  const handlePropertyValue = (index: number, newValue: string) => {
    const updatedValues = [...propertyValue];
    updatedValues[index] = newValue;
    setPropertyValue(updatedValues);
  };
  // add value
  const handleUpdateAddButtonClick = () => {
    setPropertyValue((prevValues) => [...prevValues, ""]);
  };

  const updatedPropertyBody = {
    name: propertyName,
    type: propertyType,
    values: propertyValue.join(";"),
  };
  console.log(updatedPropertyBody);
  const handleUpdatedCategoryProperty = (
    workspaceId: number,
    categoryId: number,
    propertyId: number
  ) => {
    updateWorkspaceCategoryProperties(
      workspaceId,
      categoryId,
      propertyId,
      updatedPropertyBody
    ).then((res) => {
      if (res) {
        // setPropertyValue([]);
        setCategoryLoading(!categoryLoading);
      }
    });
  };
  const handleUpdateDeleteProperty = async (
    index: number,
    workspaceId: number,
    categoryId: number,
    propertyID: number
  ) => {
    const updatedProperty = propertyValue.filter((_, i) => i !== index);
    setPropertyValue(updatedProperty);
    const propertyBody = {
      name: propertyName,
      type: propertyType,
      values: updatedProperty.join(";"),
    };
    await updateWorkspaceCategoryProperties(
      workspaceId,
      categoryId,
      propertyID,
      propertyBody
    ).then((res) => {
      if (res) {
        setCategoryLoading(!categoryLoading);
      }
    });
  };
  // archive property
  const handleArchiveCategoryProperty = async (
    property: ICategoryProperties
  ) => {
    await archiveWorkspaceCategoryProperties(
      property.workspace_id,
      property.category_id,
      property.ID.toString()
    ).then((res) => {
      if (res) {
        getWorkspaceCategoryProperties(workspaceId);
      }
    });
  };

  return (
    <CreateCategory>
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        component={CategoryArchivedList}
      />
      <CustomModal
        open={archivePropertyModal}
        setOpen={setArchivePropertyModal}
        component={CategoryPropertyArchivedList}
      />
      {workspaceCategoryProperties === null ? (
        <CategoryTitle>
          <h3>You don't have any categories.</h3>
          <p>Standardize your payments and bookkeeping with categories.</p>
          <CreateOptionButton>
            <CreateBtn onClick={handleCreateCategory}>
              <img src={add} alt="" />
              <span>{t("category.CreateCategory")}</span>
            </CreateBtn>
            <CreateBtn onClick={handleCategoryArchivedList}>
              <img src={archive} alt="" />
              <span>{t("category.ViewArchives")}</span>
            </CreateBtn>
          </CreateOptionButton>
        </CategoryTitle>
      ) : (
        <>
          {/* create category option */}
          <CategoryForm>
            {/* header btn */}
            <CreateOptionButton>
              <CreateBtn onClick={handleCreateCategory}>
                <img src={add} alt="" />
                <span>Create category</span>
              </CreateBtn>
              <CreateBtn onClick={handleCategoryArchivedList}>
                <img src={archive} alt="" />
                <span>View archive</span>
              </CreateBtn>
            </CreateOptionButton>
            {/* category option */}
            {workspaceCategoryProperties?.map((category, index) => (
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
                      <div
                        onClick={(e) =>
                          handleCategoryName(e, category.ID, category.name)
                        }
                      >
                        {editableCategoryId === category.ID &&
                        categoryNameEditable ? (
                          <input
                            type="text"
                            value={categoryName}
                            // value={categoryName ?? category.name}
                            placeholder="Category Name"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setCategoryName(e.target.value)}
                            onBlur={() =>
                              handleUpdateCategoryName(
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
                  <AccordionDetails sx={{ p: 0, maxHeight: "500px" }}>
                    {/* category property */}
                    <CategoryProperties>
                      <Options>
                        <PropertyOptions>
                          <h4>ADD PROPERTIES</h4>
                          {/* TODO: update */}
                          {category.properties?.map((property, index) => (
                            <div
                              key={index}
                              onClick={() => handleSelectedProperty(property)}
                            >
                              <Option>
                                <PropertyTitle>
                                  <img src={property1} alt="" />
                                  <p>{property.name}</p>
                                </PropertyTitle>
                                <img
                                  onClick={() =>
                                    handleArchiveCategoryProperty(property)
                                  }
                                  src={archive}
                                  alt=""
                                />
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
                            {/* TODO: update */}
                            {category.properties?.map((property, index) => (
                              <CategoryPropertyDetails
                                showProperty={showProperty}
                                propertyName={propertyName}
                                setPropertyName={setPropertyName}
                                property={property}
                                index={index}
                                handleUpdatedCategoryProperty={
                                  handleUpdatedCategoryProperty
                                }
                                propertyType={propertyType}
                                handleSetPropertyType={handleSetPropertyType}
                                propertyValue={propertyValue}
                                handlePropertyValue={handlePropertyValue}
                                handleUpdateDeleteProperty={
                                  handleUpdateDeleteProperty
                                }
                                handleUpdateAddButtonClick={
                                  handleUpdateAddButtonClick
                                }
                              />
                            ))}
                            {/*  */}
                            {categoryProperties[category.ID] &&
                              categoryProperties[category.ID].map(
                                (property, index) => (
                                  <LocalCategoryPropertyDetails
                                    showProperty={showProperty}
                                    property={property}
                                    index={index}
                                    handlePropertyNameChange={
                                      handlePropertyNameChange
                                    }
                                    category={category}
                                    handlePropertyTypeChange={
                                      handlePropertyTypeChange
                                    }
                                    propertyValues={propertyValues}
                                    handlePropertyValueChang={
                                      handlePropertyValueChang
                                    }
                                    handleDeleteProperty={handleDeleteProperty}
                                    handleAddButtonClick={handleAddButtonClick}
                                  />
                                )
                              )}
                          </>
                        </Details>
                      </Options>
                      {/* property button section */}
                      <PropertyBtns>
                        <OptionCreateButtons>
                          <button
                            onClick={() => handleAddProperty(category.ID)}
                          >
                            <img src={add} alt="" />
                            <span>Create property</span>
                          </button>
                          <button onClick={handleCategoryPropertyArchivedList}>
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
                          <CancelBtn
                            onClick={() =>
                              handlePropertyCancelBtn(category.ID, index)
                            }
                          >
                            Cancel
                          </CancelBtn>
                        </PropertyCreateButtons>
                      </PropertyBtns>
                    </CategoryProperties>
                    {/* category property end */}
                  </AccordionDetails>
                </Accordion>
              </CategoryOption>
            ))}
          </CategoryForm>
        </>
      )}
    </CreateCategory>
  );
};

export default Category;
