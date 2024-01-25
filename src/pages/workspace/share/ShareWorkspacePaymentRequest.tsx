import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/layout/header/Header";
import WorkspaceItemDetailsLayout from "../../../components/layout/WorkspaceItemDetailsLayout";
import React, { useEffect, useState } from "react";
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
import { useWorkspace } from "../../../store/useWorkspace";
import { useSharePaymentRequest } from "../../../store/useSharePaymentRequest";
import CustomModal from "../../../utils/CustomModal";
import PaymentRequestPreview from "./PaymentRequestPreview";

const ShareWorkspacePaymentRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getWorkspaceCategoryProperties, workspaceCategoryProperties } =
    useCategoryProperty();
  const { isLoading } = useLoading();
  const { workspace, assetsList, getAssets, getWorkspaceDetails } =
    useWorkspace();
  const { createSharePaymentRequest } = useSharePaymentRequest();

  const [selectedValue, setSelectedValue] = useState("Option1");

  const [age, setAge] = useState("Category");

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const [selectedValues, setSelectedValues] = useState([]);

  // console.log(selectedValues);

  // const handleSelectChange = (selectedOptions: any) => {
  //   setSelectedValues(selectedOptions);
  // };

  // dynamic payment request form
  const [sharePaymentRequestForm, setSharePaymentRequestForm] = useState<any>([
    {
      amount: "",
      currency_name: "",
      recipient: "",
      category_id: null,
      category_name: "",
      currency_contract_address: "",
      category_properties: [],
    },
  ]);
  const handleAddRequest = () => {
    setSharePaymentRequestForm([
      ...sharePaymentRequestForm,
      {
        amount: "",
        currency_name: "",
        recipient: "",
        category_id: null,
        category_name: "",
        category_properties: [],
      },
    ]);
  };
  console.log(sharePaymentRequestForm);

  const handleFormChange = (
    index: number,
    field: string,
    value: any,
    propertyName?: string,
    propertyType?: string,
    categoryId?: number
  ) => {
    const updatedRequests = [...sharePaymentRequestForm];
    if (field === "currency_name") {
      updatedRequests[index].currency_name = value;
      updatedRequests[index].currency_contract_address = value;
    }

    if (field === "categoryProperties") {
      const existingCategoryPropertyIndex = updatedRequests[
        index
      ].category_properties.findIndex(
        (property: any) => property.name === propertyName
      );
      if (existingCategoryPropertyIndex !== -1) {
        // check single select or multi-select
        const values =
          propertyType === "single-select"
            ? value.value
            : value.map((v: any) => v.value).join(";");

        updatedRequests[index].category_properties[
          existingCategoryPropertyIndex
        ].values = values;
      } else {
        const newCategoryProperty = {
          name: propertyName,
          type: propertyType,
          values:
            propertyType === "single-select"
              ? value.value
              : value.map((v: any) => v.value).join(";"),
        };

        updatedRequests[index].category_properties.push(newCategoryProperty);
      }
    } else {
      updatedRequests[index][field] = value;
    }
    setSharePaymentRequestForm(updatedRequests);
  };

  // get category details
  useEffect(() => {
    getWorkspaceCategoryProperties(Number(id));
  }, [getWorkspaceCategoryProperties, id]);

  const [selectedCategoryID, setSelectedCategoryID] = useState<number>();
  const handleCategoryDropdown = (
    categoryId: number,
    categoryName: string,
    index: number
  ) => {
    setSelectedCategoryID(categoryId);
    console.log(categoryId, categoryName, index);

    const updatedRequests = [...sharePaymentRequestForm];
    updatedRequests[index] = {
      ...updatedRequests[index],
      category_id: categoryId,
      category_name: categoryName,
      category_properties: [],
    };
    setSharePaymentRequestForm(updatedRequests);
  };
  const selectedCategory = workspaceCategoryProperties?.find(
    (f) => f.ID === selectedCategoryID
  );
  // get asset list
  useEffect(() => {
    getAssets();
  }, [workspace?.vault_wallet, getAssets]);

  // modal
  const [openModal, setOpenModal] = useState(false);

  // create payment request
  const handleSubmitPaymentRequest = () => {
    createSharePaymentRequest({ rows: sharePaymentRequestForm });
  };
  const handleSavePaymentRequest = () => {
    setOpenModal(true);
  };

  return (
    <Header>
      {isLoading && <Loading />}
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        component={PaymentRequestPreview}
        additionalProps={{ sharePaymentRequestForm }}
      />
      <SharePaymentContainer>
        <SharePaymentForm>
          <ShareHeader>
            <h3>New payment request from {workspace.name}</h3>
          </ShareHeader>
          {sharePaymentRequestForm.map((_: any, index: number) => (
            <RequestDetails key={index}>
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
                          value={sharePaymentRequestForm[index].currency_name}
                          // onChange={handleChange}
                          size="small"
                          onChange={(e) =>
                            handleFormChange(
                              index,
                              "currency_name",
                              e.target.value
                            )
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
                          {assetsList.map((asset, i: number) => (
                            <MenuItem
                              key={i}
                              value={asset.tokenInfo.symbol}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "var(--hover-bg)",
                                },
                                "&.Mui-selected": {
                                  backgroundColor: "var(--hover-bg)",
                                },
                              }}
                            >
                              {asset.tokenInfo.symbol}
                            </MenuItem>
                          ))}
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
                                  key={category.ID}
                                  value={category.name}
                                  onClick={() => {
                                    handleCategoryDropdown(
                                      category.ID,
                                      category.name,
                                      index
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
                        <React.Fragment key={i}>
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
                                  isMulti={false}
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
                        </React.Fragment>
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
              <Save onClick={handleSavePaymentRequest}>Save</Save>
              <Submit onClick={handleSubmitPaymentRequest}>Submit</Submit>
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
  outline: 1px solid var(--border-table);
  border-radius: 10px;
  overflow: hidden;
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
