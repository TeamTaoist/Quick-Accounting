import { useEffect, useId, useState } from "react";
import add from "../../../assets/workspace/add.svg";
import archive from "../../../assets/workspace/archive.svg";
import edit from "../../../assets/workspace/edit.svg";
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
  HeaderOptions,
  Option,
  OptionCreateButtons,
  Options,
  PropertyBtns,
  PropertyCreateButtons,
  PropertyOptions,
  PropertyTitle,
  UpdateBtn,
} from "./category.style";
import { useCategory } from "../../../store/useCategory";
import {
  useCategoryProperty,
  CategoryProperties as ICategory,
} from "../../../store/useCategoryProperty";
import CategoryPropertyDetails from "../../../components/workspace/category/CategoryPropertyDetails";
import LocalCategoryPropertyDetails from "../../../components/workspace/category/LocalCategoryPropertyDetails";
import CategoryArchivedList from "../../../components/workspace/category/CategoryArchivedList";
import CategoryPropertyArchivedList from "../../../components/workspace/category/CategoryPropertyArchivedList";

export interface CategoryProperty {
  name: string;
  type: string;
  values: string;
  ID: number;
  category_id: number;
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
    getCategoryPropertyByCategoryId,
  } = useCategoryProperty();

  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  // const [categoryList, setCategoryList] = useState<any>([]);

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
  const [selectedCategoryWorkspaceId, setSelectedCategoryWorkspaceId] =
    useState<number | null>(null);
  const handleCategoryPropertyArchivedList = (categoryId: number) => {
    getCategoryPropertyByCategoryId(Number(id), categoryId, true).then(
      (res) => {
        if (res) {
          setArchivePropertyModal(true);
          setSelectedCategoryWorkspaceId(categoryId);
        }
      }
    );
    // setSelectedCategoryWorkspaceId(categoryId);
    // setArchivePropertyModal(true);
    // console.log(categoryId);
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
    // setCategoryNameEditable(false);
  };
  // update category name
  const handleCategoryName = (
    e: any,
    categoryId: number,
    categoryName: string
  ) => {
    e.stopPropagation();
    setEditableCategoryId(categoryId);
    // setCategoryNameEditable(true);
    setCategoryName(categoryName);
  };
  const handleUpdateCategoryName = async (
    // e: React.ChangeEvent<HTMLInputElement>,
    workspaceId: number,
    categoryId: number
  ) => {
    // await updateCategoryName(workspaceId, categoryId, categoryName);
    // setCategoryLoading(!categoryLoading);
    // setCategoryNameEditable(false);
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
    const randomID = Math.floor(Math.random() * (1 - 100)) + 1;
    const newProperty: CategoryProperty = {
      name: "New Property",
      type: "Text",
      values: "",
      ID: randomID,
      category_id: categoryId,
    };
    setCategoryProperties({
      ...categoryProperties,
      [categoryId]: [...properties, newProperty],
    });
    const updatedList = categoryList.map((category) => {
      if (category.ID === categoryId) {
        return {
          ...category,
          properties: [...(category.properties || []), newProperty],
        };
      }
      return category;
    });
    setCategoryList(updatedList as ICategory[]);
  };
  console.log("categoryProperties", categoryProperties);

  //TODO: modify category
  const modifyCategoryProperty = (
    categoryId: number,
    propertyId: number,
    updatedProperties: Partial<CategoryProperty>
  ) => {
    const updatedList = categoryList.map((category) => {
      if (category.ID === categoryId) {
        // Update the properties of the specific category
        const updatedPropertiesList = category.properties?.map((property) => {
          if (property.ID === propertyId) {
            // Update the specific property with new values
            return {
              ...property,
              ...updatedProperties,
            };
          }
          return property;
        });

        // Return the updated category with modified properties
        return {
          ...category,
          properties: updatedPropertiesList,
        };
      }
      return category;
    });

    // Update the category list state with the modified list
    setCategoryList(updatedList as ICategory[]);
  };

  const handlePropertyNameChange = (
    categoryId: number,
    propertyId: number,
    newName: string
  ) => {
    modifyCategoryProperty(categoryId, propertyId, { name: newName });
  };

  // properties types values
  const [propertyValues, setPropertyValues] = useState<string[]>([]);

  const handleAddButtonClick = (categoryId: number, index: number) => {
    setPropertyValues([...propertyValues, ""]);
  };

  const handleDeleteProperty = (
    categoryId: number,
    propertyId: number,
    index: number
  ) => {
    const updatedList = categoryList.map((category) => {
      if (category.ID === categoryId) {
        const updatedProperties = category.properties?.map((property) => {
          if (property.ID === propertyId) {
            const propertyValues = property.values
              ? property.values.split(";")
              : [];
            propertyValues.splice(index, 1);
            return {
              ...property,
              values: propertyValues.join(";"),
            };
          }
          return property;
        });
        return {
          ...category,
          properties: updatedProperties,
        };
      }
      return category;
    });

    setCategoryList(updatedList as ICategory[]);
  };

  const handlePropertyValueChang = (
    categoryId: number,
    propertyId: number,
    newValue: string,
    index: number
  ) => {
    // Update the property value at the specified index
    const updatedList = categoryList.map((category) => {
      if (category.ID === categoryId) {
        const updatedProperties = category.properties?.map((property) => {
          if (property.ID === propertyId) {
            const propertyValues = (property.values || "").split(";");
            propertyValues[index] = newValue;
            return {
              ...property,
              values: propertyValues.join(";"),
            };
          }
          return property;
        });
        return {
          ...category,
          properties: updatedProperties,
        };
      }
      return category;
    });

    // Update the category list state with the modified list
    setCategoryList(updatedList as ICategory[]);
  };

  const handlePropertyTypeChange = (
    categoryId: number,
    propertyId: number,
    newValue: string
  ) => {
    modifyCategoryProperty(categoryId, propertyId, { type: newValue });
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
  const handleSelectedProperty = (
    property: ICategoryProperties,
    index: number
  ) => {
    if (property.ID) {
      setShowProperty(property.ID);
    } else {
      setShowProperty(index);
    }
  };

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
  const handleUpdateAddButtonClick = (
    categoryId: number,
    propertyId: number
  ) => {
    const updatedList = categoryList.map((category) => {
      if (category.ID === categoryId) {
        const updatedProperties = category.properties?.map((property) => {
          if (property.ID === propertyId) {
            const propertyValues = property.values
              ? property.values.split(";")
              : [];
            propertyValues.push("");
            return {
              ...property,
              values: propertyValues.join(";"),
            };
          }
          return property;
        });
        return {
          ...category,
          properties: updatedProperties,
        };
      }
      return category;
    });

    setCategoryList(updatedList as ICategory[]);
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
    // updateWorkspaceCategoryProperties(
    //   workspaceId,
    //   categoryId,
    //   propertyId,
    //   updatedPropertyBody
    // ).then((res) => {
    //   if (res) {
    //     // setPropertyValue([]);
    //     setCategoryLoading(!categoryLoading);
    //   }
    // });
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
    // await updateWorkspaceCategoryProperties(
    //   workspaceId,
    //   categoryId,
    //   propertyID,
    //   propertyBody
    // ).then((res) => {
    //   if (res) {
    //     setCategoryLoading(!categoryLoading);
    //   }
    // });
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

  // edit category
  const [isEditable, setIsEditable] = useState(false);
  const handleEditCategory = (e: any, categoryId: number) => {
    e.stopPropagation();
    setIsEditable(!isEditable);
    setEditableCategoryId(categoryId);
    setCategoryNameEditable(true);
  };

  useEffect(() => {
    if (workspaceCategoryProperties && workspaceCategoryProperties.length > 0) {
      const updatedList = workspaceCategoryProperties?.map((category) => {
        return {
          ID: category.ID,
          CreatedAt: category.CreatedAt,
          UpdatedAt: category.UpdatedAt,
          DeletedAt: category.DeletedAt,
          workspace_id: category.workspace_id,
          name: category.name,
          archived: category.archived,
          properties:
            category.properties?.map((property) => ({
              ID: property.ID,
              CreatedAt: property.CreatedAt,
              UpdatedAt: property.UpdatedAt,
              DeletedAt: property.DeletedAt,
              workspace_id: property.workspace_id,
              category_id: property.category_id,
              name: property.name,
              type: property.type,
              values: property.values,
            })) || [],
        };
      });
      setCategoryList(updatedList as ICategory[]);
      // setCategoryList(workspaceCategoryProperties);
    }
  }, [workspaceCategoryProperties]);
  console.log("category list", categoryList);

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
        additionalProps={{ categoryId: selectedCategoryWorkspaceId }}
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
            {categoryList?.map((category, index) => (
              <CategoryOption key={category.ID}>
                <Accordion>
                  <AccordionSummary
                    onClick={() => handleCategory(category.ID)}
                    expandIcon={!isEditable ? <ExpandMoreIcon /> : ""}
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
                        {editableCategoryId === category.ID && isEditable ? (
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
                              padding: 1,
                              fontSize: "20px",
                              fontWeight: "500",
                            }}
                          >
                            {category.name}
                          </Typography>
                        )}
                      </div>
                      {editableCategoryId === category.ID && isEditable ? (
                        <UpdateBtn
                          onClick={(e) => handleEditCategory(e, category.ID)}
                        >
                          Update
                        </UpdateBtn>
                      ) : (
                        <HeaderOptions>
                          <div
                            onClick={(e) => handleEditCategory(e, category.ID)}
                          >
                            <img src={edit} alt="" />
                            <p>Edit</p>
                          </div>
                          <div
                            onClick={(e) =>
                              handelArchiveCategory(
                                e,
                                category.workspace_id,
                                category.ID
                              )
                            }
                          >
                            <img src={archive} alt="" />
                            <p>Archive</p>
                          </div>
                        </HeaderOptions>
                      )}
                    </Header>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0, maxHeight: "500px" }}>
                    {/* category property */}
                    <CategoryProperties>
                      <Options>
                        <PropertyOptions>
                          <h4>ADD PROPERTIES</h4>
                          {category.properties?.map((property, index) => (
                            <div
                              key={index}
                              onClick={() =>
                                handleSelectedProperty(property, index)
                              }
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
                          {/* {categoryProperties[category.ID] &&
                            categoryProperties[category.ID].map(
                              (property, index) => (
                                <Option onClick={() => setShowProperty(index)}>
                                  <PropertyTitle>
                                    <img src={property1} alt="" />
                                    <p>{property.name}</p>
                                  </PropertyTitle>
                                </Option>
                              )
                            )} */}
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
                                handlePropertyNameChange={
                                  handlePropertyNameChange
                                }
                                handlePropertyTypeChange={
                                  handlePropertyTypeChange
                                }
                                handlePropertyValueChang={
                                  handlePropertyValueChang
                                }
                                handleDeleteProperty={handleDeleteProperty}
                              />
                            ))}
                            {/*  */}
                            {/* {categoryProperties[category.ID] &&
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
                              )} */}
                          </>
                        </Details>
                      </Options>
                      {/* property button section */}
                      <PropertyBtns>
                        <OptionCreateButtons>
                          {editableCategoryId === category.ID && isEditable ? (
                            <button
                              onClick={() => handleAddProperty(category.ID)}
                            >
                              <img src={add} alt="" />
                              <span>Add property</span>
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleCategoryPropertyArchivedList(category.ID)
                              }
                            >
                              <img src={archive} alt="" />
                              <span>View archive</span>
                            </button>
                          )}
                        </OptionCreateButtons>
                        {/* <PropertyCreateButtons>
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
                        </PropertyCreateButtons> */}
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
