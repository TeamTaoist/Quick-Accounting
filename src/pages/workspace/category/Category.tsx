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
import CategoryArchivedList from "../../../components/workspace/category/CategoryArchivedList";
import CategoryPropertyArchivedList from "../../../components/workspace/category/CategoryPropertyArchivedList";

export interface CategoryPropertyBody {
  name: string;
  type: string;
  values: string;
  ID?: number;
  category_id: number;
  workspace_id: number;
}
export interface CategoryPropertiesState {
  [categoryId: number]: CategoryPropertyBody[];
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
    editCategoryNameAndProperties,
  } = useCategoryProperty();

  const [categoryList, setCategoryList] = useState<ICategory[]>([]);

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

  const [categoryNameEditable, setCategoryNameEditable] =
    useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string | undefined>();

  //get workspace category details
  // const handleCategory = (workspaceCategoryId: number) => {
  //   // getWorkspaceCategoryDetails(workspaceCategoryId);
  //   // setCategoryNameEditable(false);
  // };
  // update category name
  const handleCategoryName = (e: any, categoryId: number) => {
    e.stopPropagation();
    const updatedList = categoryList.map((category) => {
      if (category.ID === categoryId) {
        return {
          ...category,
          name: e.target.value,
        };
      }
      return category;
    });
    setCategoryList(updatedList as ICategory[]);
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
    // const properties = categoryProperties[categoryId] || [];
    const randomID = Math.floor(Math.random() * (1 - 100)) + 1;
    const newProperty: CategoryPropertyBody = {
      name: "New Property",
      type: "Text",
      values: "",
      ID: randomID,
      category_id: categoryId,
      workspace_id: Number(id),
    };
    // setCategoryProperties({
    //   ...categoryProperties,
    //   [categoryId]: [...properties, newProperty],
    // });
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
    updatedProperties: Partial<CategoryPropertyBody>
  ) => {
    const updatedList = categoryList.map((category) => {
      if (category.ID === categoryId) {
        const updatedPropertiesList = category.properties?.map((property) => {
          if (property.ID === propertyId) {
            return {
              ...property,
              ...updatedProperties,
            };
          }
          return property;
        });
        return {
          ...category,
          properties: updatedPropertiesList,
        };
      }
      return category;
    });

    setCategoryList(updatedList as ICategory[]);
  };

  const handlePropertyNameChange = (
    categoryId: number,
    propertyId: number,
    newName: string
  ) => {
    modifyCategoryProperty(categoryId, propertyId, { name: newName });
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
  // create new property
  const handleCreateProperty = async (categoryId: number) => {
    const newProperty: CategoryPropertyBody = {
      category_id: categoryId,
      name: "New Property",
      type: "Text",
      values: "",
      workspace_id: Number(id),
      // ID: randomID,
    };
    await createWorkspaceCategoryProperties(newProperty);
    setCategoryLoading(!categoryLoading);
    // if (categoryProperty.code === 200 && categoryProperty.msg === "success") {
    //   setShowProperty(null);
    //   // setCategoryProperties({});
    //   setPropertyValues([]);
    //   setCategoryProperties({});
    //   setCategoryLoading(!categoryLoading);
    // }
  };
  // console.log(updatedPropertyBody);
  const handleUpdatedCategoryProperty = (
    // workspaceId: number,
    categoryId: number
    // propertyId: number
  ) => {
    const updatedCategory = categoryList.find(
      (category) => category.ID === categoryId
    );
    console.log("u", updatedCategory);

    const updatedPropertyBody: any = {
      category_name: updatedCategory?.name,
      properties: updatedCategory?.properties,
    };
    editCategoryNameAndProperties(
      workspaceId,
      categoryId,
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
    // const updatedProperty = propertyValue.filter((_, i) => i !== index);
    // setPropertyValue(updatedProperty);
    // const propertyBody = {
    //   name: propertyName,
    //   type: propertyType,
    //   values: updatedProperty.join(";"),
    // };
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
  const [editableCategoryId, setEditableCategoryId] = useState<number[]>([]);
  const handleEditCategory = (e: any, categoryId: number) => {
    e.stopPropagation();
    const updatedIds = editableCategoryId.includes(categoryId)
      ? editableCategoryId.filter((id) => id !== categoryId)
      : [...editableCategoryId, categoryId];
    setEditableCategoryId(updatedIds);
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
                    // onClick={() => handleCategory(category.ID)}
                    // expandIcon={!isEditable ? <ExpandMoreIcon /> : ""}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ backgroundColor: "var(--hover-bg)" }}
                  >
                    <Header>
                      <div
                      // onClick={(e) =>
                      //   handleCategoryName(e, category.ID)
                      // }
                      >
                        {/* {editableCategoryId === category.ID ? ( */}
                        {editableCategoryId.includes(category.ID) ? (
                          <input
                            type="text"
                            value={category.name}
                            // value={categoryName ?? category.name}
                            placeholder="Category Name"
                            onClick={(e) => e.stopPropagation()}
                            // onChange={(e) => setCategoryName(e.target.value)}
                            onChange={(e) => handleCategoryName(e, category.ID)}
                            // onBlur={() =>
                            //   handleUpdateCategoryName(
                            //     category.workspace_id,
                            //     category.ID
                            //   )
                            // }
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
                      {/* {editableCategoryId === category.ID ? ( */}
                      {editableCategoryId.includes(category.ID) ? (
                        <UpdateBtn
                          // onClick={(e) => handleEditCategory(e, category.ID)}
                          onClick={() =>
                            handleUpdatedCategoryProperty(category.ID)
                          }
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
                                // propertyName={propertyName}
                                // setPropertyName={setPropertyName}
                                property={property}
                                index={index}
                                // handleUpdatedCategoryProperty={
                                //   handleUpdatedCategoryProperty
                                // }
                                // propertyType={propertyType}
                                // handleSetPropertyType={handleSetPropertyType}
                                // propertyValue={propertyValue}
                                // handlePropertyValue={handlePropertyValue}
                                // handleUpdateDeleteProperty={
                                //   handleUpdateDeleteProperty
                                // }
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
                          </>
                        </Details>
                      </Options>
                      {/* property button section */}
                      <PropertyBtns>
                        <OptionCreateButtons>
                          {editableCategoryId.includes(category.ID) ? (
                            <button
                              onClick={() => handleCreateProperty(category.ID)}
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
