import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/layout/header/Header";
import WorkspaceItemDetailsLayout from "../../../components/layout/WorkspaceItemDetailsLayout";
import { useEffect, useState } from "react";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import arrowBottom from "../../../assets/workspace/arrow-bottom.svg";
import multiSelect from "../../../assets/workspace/multi-select.svg";
import selectIcon from "../../../assets/workspace/select.svg";
import categoryIcon from "../../../assets/workspace/category-icon.svg";
import optionsIcon from "../../../assets/workspace/option.svg";
import styled from "@emotion/styled";
import ReactSelect from "../../../components/ReactSelect";
import { useCategoryProperty } from "../../../store/useCategoryProperty";
import { useLoading } from "../../../store/useLoading";
import Loading from "../../../utils/Loading";

const ShareWorkspacePaymentRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getWorkspaceCategoryProperties, workspaceCategoryProperties } =
    useCategoryProperty();
  const { isLoading } = useLoading();

  const [selectedValue, setSelectedValue] = useState("Option1");

  const [age, setAge] = useState("Category");

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const [selectedValues, setSelectedValues] = useState([]);

  const handleChange = (selectedOption: any) => {
    setSelectedValues(selectedOption);
  };
  // console.log(selectedValues);

  // const handleSelectChange = (selectedOptions: any) => {
  //   setSelectedValues(selectedOptions);
  // };

  // dynamic payment request form
  const [sharePaymentRequestForm, setSharePaymentRequestForm] = useState<any>([
    {
      amount: "",
      currency: "",
      recipient: "",
      category_id: "",
      categoryProperty: [],
    },
  ]);
  const handleAddRequest = () => {
    setSharePaymentRequestForm([
      ...sharePaymentRequestForm,
      {
        amount: "",
        currency: "",
        recipient: "",
        categoryProperty: [
          {
            name: "",
            type: "",
            values: "",
          },
        ],
      },
    ]);
  };
  console.log(sharePaymentRequestForm);

  // const handleFormChange = (index: any, field: any, value: any) => {
  //   const updatedRequests = [...sharePaymentRequestForm];
  //   if (field === "categoryProperties") {
  //     updatedRequests[index].categoryProperty[index].values = value
  //       .map((option: any) => option.value)
  //       .join(";");
  //   } else {
  //     // Handle other fields as usual
  //     updatedRequests[index][field] = value;
  //   }
  //   setSharePaymentRequestForm(updatedRequests);
  // };
  // const handleFormChange = (
  //   index: any,
  //   field: any,
  //   value: any,
  //   subfield?: any
  // ) => {
  //   const updatedRequests = [...sharePaymentRequestForm];
  //   if (field === "categoryProperties" && subfield !== undefined) {
  //     updatedRequests[index].categoryProperty[index][subfield] = value;
  //   } else if (field === "categoryProperties") {
  //     updatedRequests[index].categoryProperty = value;
  //   } else {
  //     // Handle other fields as usual
  //     updatedRequests[index][field] = value;
  //   }
  //   setSharePaymentRequestForm(updatedRequests);
  // };

  const handleFormChange = (
    index: any,
    field: any,
    value: any,
    propertyName?: any,
    propertyType?: any,
    categoryId?: any
  ) => {
    const updatedRequests = [...sharePaymentRequestForm];

    if (field === "categoryProperties") {
      // Check if the categoryProperty already exists with the given name
      const existingCategoryPropertyIndex = updatedRequests[
        index
      ].categoryProperty.findIndex(
        (property: any) => property.name === propertyName
      );

      if (existingCategoryPropertyIndex !== -1) {
        // Update the existing categoryProperty with the new values
        updatedRequests[index].categoryProperty[
          existingCategoryPropertyIndex
        ].values = value.map((v: any) => v.value).join(";");
      } else {
        // If not exists, create a new categoryProperty
        const newCategoryProperty = {
          name: propertyName,
          type: propertyType,
          values: value.map((v: any) => v.value).join(";"),
        };

        // Update the categoryProperty array at the specified index
        updatedRequests[index].categoryProperty.push(newCategoryProperty);
      }
    } else {
      // Handle other fields as usual
      updatedRequests[index][field] = value;
    }

    setSharePaymentRequestForm(updatedRequests);
  };

  // get category details
  useEffect(() => {
    getWorkspaceCategoryProperties(Number(id));
  }, [getWorkspaceCategoryProperties, id]);

  const [selectedCategoryID, setSelectedCategoryID] = useState<number>();
  const handleCategoryDropdown = (categoryId: number) => {
    setSelectedCategoryID(categoryId);
  };
  const selectedCategory = workspaceCategoryProperties?.find(
    (f) => f.ID === selectedCategoryID
  );

  return (
    <Header>
      {isLoading && <Loading />}
      <SharePaymentContainer>
        <SharePaymentForm>
          <ShareHeader>
            <h3>New payment request from workspace name</h3>
          </ShareHeader>
          {sharePaymentRequestForm.map((form: any, index: any) => (
            <RequestDetails>
              <TableContainer
                sx={{
                  // paddingInline: "46px",
                  // paddingTop: "30px",
                  boxShadow: "none",
                  border: "1px solid var(--border-table)",
                  borderTopRightRadius: "6px",
                  borderTopLeftRadius: "6px",
                }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead sx={{ background: "var(--bg-secondary)" }}>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: 200,
                          borderRight: "1px solid var(--border-table)",
                          // paddingInline: 0,
                          fontSize: "18px",
                          fontWeight: "500",
                        }}
                      >
                        Recipient
                      </TableCell>
                      <TableCell
                        sx={{
                          width: 150,
                          borderRight: "1px solid var(--border-table)",
                          fontSize: "18px",
                          fontWeight: "500",
                        }}
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        sx={{
                          width: 200,
                          fontSize: "18px",
                          fontWeight: "500",
                        }}
                      >
                        Currency
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* <TableRow sx={{ td: { border: 1, padding: 0 } }}> */}
                    {/* {rows.map((row) => ( */}
                    <TableRow
                      sx={{
                        height: "30px",
                      }}
                    >
                      <TableCell
                        // size="small"
                        sx={{
                          borderRight: "1px solid var(--border-table)",
                          padding: 0,
                        }}
                      >
                        <TextField
                          sx={{
                            "& fieldset": { border: "none" },
                          }}
                          size="small"
                          fullWidth
                          // id="fullWidth"
                          placeholder="Enter wallet address"
                          onChange={(e) =>
                            handleFormChange(index, "recipient", e.target.value)
                          }
                          InputProps={{
                            style: { padding: 0 },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderRight: "1px solid var(--border-table)",
                          borderRadius: "5px",
                          padding: 0,
                          paddingLeft: "10px",
                          // minHeight: "40px",
                        }}
                      >
                        <TextField
                          sx={{
                            "& fieldset": { border: "none" },
                          }}
                          size="small"
                          fullWidth
                          // id="fullWidth"
                          placeholder="amount"
                          onChange={(e) =>
                            handleFormChange(index, "amount", e.target.value)
                          }
                          InputProps={{
                            style: { padding: 0 },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: 0,
                          // minHeight: "40px",
                        }}
                      >
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={selectedValue}
                          // onChange={handleChange}
                          size="small"
                          onChange={(e) =>
                            handleFormChange(index, "currency", e.target.value)
                          }
                          IconComponent={() => (
                            <InputAdornment position="start">
                              <img
                                src={arrowBottom}
                                alt="Custom Arrow Icon"
                                style={{ marginRight: "50px" }}
                              />
                            </InputAdornment>
                          )}
                          sx={{
                            minWidth: "100%",
                            "& fieldset": { border: "none" },
                          }}
                        >
                          <MenuItem
                            value="Option1"
                            sx={{
                              "&:hover": { backgroundColor: "var(--hover-bg)" },
                              "&.Mui-selected": {
                                backgroundColor: "var(--hover-bg)",
                              },
                            }}
                          >
                            Ten
                          </MenuItem>
                          <MenuItem value="Option2">Twenty</MenuItem>
                        </Select>
                      </TableCell>
                    </TableRow>
                    {/* ))} */}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* note info */}
              <NoteInformation>
                <h3>Note Information</h3>

                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                      <TableRow
                        sx={{
                          td: {
                            border: "1px solid var(--border-table)",
                            padding: 0,
                            paddingInline: "16px",
                          },
                        }}
                      >
                        <TableCell sx={{ height: 1, width: 200 }}>
                          <NoteInfo>
                            <Image src={categoryIcon} alt="" /> Category
                          </NoteInfo>
                        </TableCell>
                        <TableCell>
                          <FormControl fullWidth>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={age}
                              label="Age"
                              size="small"
                              onChange={handleCategoryChange}
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
                                "& fieldset": { border: "none" },
                              }}
                            >
                              <MenuItem disabled value="Category">
                                Select category
                              </MenuItem>
                              {workspaceCategoryProperties.map((category) => (
                                <MenuItem
                                  value={category.name}
                                  onClick={() => {
                                    handleCategoryDropdown(category.ID);
                                    handleFormChange(
                                      index,
                                      "category_id",
                                      category.ID
                                    );
                                  }}
                                  sx={{
                                    "&:hover": {
                                      backgroundColor: "var(--hover-bg)",
                                    },
                                    "&.Mui-selected": {
                                      backgroundColor: "var(--hover-bg)",
                                    },
                                  }}
                                >
                                  {category.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                      {/* category property */}
                      {selectedCategory?.properties?.map((property, i) => (
                        <>
                          {property.type === "single-select" && (
                            <TableRow
                              sx={{
                                td: {
                                  border: "1px solid var(--border-table)",
                                  padding: 0,
                                  paddingInline: "16px",
                                },
                              }}
                            >
                              <TableCell sx={{ height: 1, width: 200 }}>
                                <NoteInfo>
                                  <Image src={selectIcon} alt="" />{" "}
                                  {property.name}
                                </NoteInfo>
                              </TableCell>
                              {/* add multi select first */}
                              <TableCell>
                                <ReactSelect
                                  value={selectedValues}
                                  onChange={(selectedOption: any) =>
                                    handleFormChange(
                                      index,
                                      "categoryProperties",
                                      selectedOption,
                                      property.name,
                                      property.type
                                    )
                                  }
                                  // onChange={(selectedOption: any) =>
                                  //   handleChange(selectedOption)
                                  // }
                                  options={property.values
                                    .split(";")
                                    .map((v) => ({
                                      value: v,
                                      label: v,
                                    }))}
                                  // defaultValues={[options[1]]}
                                />
                              </TableCell>
                            </TableRow>
                          )}
                          {property.type === "multi-select" && (
                            <TableRow
                              sx={{
                                td: {
                                  border: "1px solid var(--border-table)",
                                  padding: 0,
                                  paddingInline: "16px",
                                },
                              }}
                            >
                              <TableCell sx={{ height: 1, width: 200 }}>
                                <NoteInfo>
                                  <Image src={multiSelect} alt="" />{" "}
                                  {property.name}
                                </NoteInfo>
                              </TableCell>
                              {/* add multi select */}
                              <TableCell>
                                <ReactSelect
                                  value={selectedValues}
                                  // onChange={handleSelectChange}
                                  onChange={(selectedOption: any) =>
                                    handleFormChange(
                                      index,
                                      "categoryProperties",
                                      selectedOption,
                                      property.name,
                                      property.type
                                    )
                                  }
                                  options={property.values
                                    .split(";")
                                    .map((v) => ({
                                      value: v,
                                      label: v,
                                    }))}
                                  // defaultValues={[options[1], options[2]]}
                                />
                              </TableCell>
                            </TableRow>
                          )}
                          {property.type === "Text" && (
                            <TableRow
                              sx={{
                                td: {
                                  border: "1px solid var(--border-table)",
                                  padding: 0,
                                  paddingInline: "16px",
                                },
                              }}
                            >
                              <TableCell sx={{ height: 1, width: 200 }}>
                                <NoteInfo>
                                  <Image src={optionsIcon} alt="" />{" "}
                                  {property.name}
                                </NoteInfo>
                              </TableCell>
                              {/* add multi select */}
                              <TableCell>
                                Here is some description of the payment request,
                                No more than 50 words. Here is some description
                                of the payment request.
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
                      {/*  */}
                    </TableBody>
                  </Table>
                </TableContainer>
                <DeleteBtn>Delete</DeleteBtn>
              </NoteInformation>
              {/* <ReactSelect /> */}
            </RequestDetails>
          ))}
          <Btns>
            <AddBtn onClick={handleAddRequest}>+ Add</AddBtn>
            <SubmitBtns>
              <Save onClick={() => navigate("/payment-request-preview")}>
                Save
              </Save>
              <Submit onClick={() => navigate("/payment-request-preview")}>
                Submit
              </Submit>
            </SubmitBtns>
          </Btns>
        </SharePaymentForm>
      </SharePaymentContainer>
    </Header>
  );
};

export default ShareWorkspacePaymentRequest;

const SharePaymentContainer = styled.div`
  /* display: grid; */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding-top: 100px;
`;
const SharePaymentForm = styled.div`
  width: 757px;
  outline: 1px solid gray;
  margin: 40px 0;
  /* padding: 40px 0; */
`;
const RequestDetails = styled.div`
  padding: 40px 30px;
`;
const ShareHeader = styled.div`
  height: 98px;
  background: var(--bg-secondary);
  padding: 22px 26px;
  h3 {
    font-size: 30px;
    font-weight: 500;
  }
`;

export const NoteInformation = styled.div`
  /* padding-inline: 46px;
  padding-top: 21px; */

  h3 {
    font-size: 18px;
    font-weight: 500;
    padding: 8px;
    padding-left: 16px;
    background: var(--bg-primary);
  }
`;
export const Image = styled.img`
  width: 16px;
`;
export const NoteInfo = styled.div`
  display: flex;
  gap: 6px;
`;
export const RequestSubmit = styled.button`
  background: var(--bg-primary);
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 400;
  padding: 10px 0;
  width: 100%;
  border-radius: 4px;
  margin-top: 21px;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  img {
    width: 10px;
  }
`;
const DeleteBtn = styled.button`
  font-size: 18px;
  width: 100%;
  border: 1px solid var(--border-table);
  padding: 8px 0;
  border-radius: 0 0 7px 7px;
  cursor: pointer;
`;
const Btns = styled.div`
  padding-inline: 30px;
  padding-bottom: 40px;
`;
const AddBtn = styled.button`
  background: transparent;
  font-size: 16px;
  color: var(--text-secondary);
  width: 100%;
  padding: 8px 0;
  border: 1px solid var(--border-table);
  border-style: dotted;
  border-radius: 7px;
  cursor: pointer;
  margin-bottom: 30px;
`;
const SubmitBtns = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
`;
const Save = styled.button`
  font-size: 18px;
  width: 100%;
  border: 1px solid var(--border-table);
  padding: 8px 0;
  border-radius: 7px;
  cursor: pointer;
`;
const Submit = styled.button`
  background: transparent;
  font-size: 18px;
  width: 100%;
  padding: 8px 0;
  border: 1px solid var(--border-table);
  border-radius: 7px;
  cursor: pointer;
`;
