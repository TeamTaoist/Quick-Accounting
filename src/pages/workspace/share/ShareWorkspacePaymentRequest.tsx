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
import { ReactSelectOption } from "../../workspaceDashboard/newPaymentRequest/NewPaymentRequest";
import { formatBalance } from "../../../utils/number";
import { toast } from "react-toastify";
import { isAddress } from "viem";
import { parseUnits } from "ethers";

const ShareWorkspacePaymentRequest = () => {
  const { workspaceId, shareId } = useParams();
  const navigate = useNavigate();

  const { getWorkspaceCategoryProperties, workspaceCategoryProperties } =
    useCategoryProperty();
  const { isLoading } = useLoading();
  const { workspace, assetsList, getAssets, getWorkspaceDetails } =
    useWorkspace();
  const { createSharePaymentRequest, getPaymentRequestShareCodeData } =
    useSharePaymentRequest();

  // payments details
  const [paymentDetails, setPaymentDetails] = useState<ISharePayment[]>([]);

  // const [age, setAge] = useState("Category");

  // const handleCategoryChange = (event: SelectChangeEvent) => {
  //   setAge(event.target.value as string);
  // };

  const [selectedValues, setSelectedValues] = useState([]);

  // dynamic payment request form
  const [sharePaymentRequestForm, setSharePaymentRequestForm] = useState<
    SharePaymentRequestBody[]
  >([
    {
      amount: "",
      currency_name: "",
      recipient: "",
      decimals: 18,
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
        decimals: 18,
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
    if (field === "currency_address") {
      const token = assetsList.find((item) => item.tokenInfo.address === value);
      if (token) {
        updatedRequests[index].currency_name = token.tokenInfo.symbol;
        updatedRequests[index].decimals = token.tokenInfo.decimals;
      }
      updatedRequests[index].currency_contract_address = value;
    }

    if (field === "categoryProperties") {
      const existingCategoryPropertyIndex = updatedRequests[
        index
      ].category_properties.findIndex(
        (property: any) => property.name === propertyName
      );
      if (existingCategoryPropertyIndex !== -1) {
        const values =
          propertyType === "single-select"
            ? value.value
            : propertyType === "Text"
            ? value
            : value.map((v: ReactSelectOption) => v.value).join(";");

        updatedRequests[index].category_properties[
          existingCategoryPropertyIndex
        ].values = values;
      } else {
        const newCategoryProperty =
          propertyType === "Text"
            ? {
                name: propertyName,
                type: propertyType,
                values: value,
              }
            : {
                name: propertyName,
                type: propertyType,
                values:
                  propertyType === "single-select"
                    ? value.value
                    : value.map((v: ReactSelectOption) => v.value).join(";"),
              };

        updatedRequests[index].category_properties.push(newCategoryProperty);
      }
    } else {
      (updatedRequests[index] as any)[field] = value;
    }
    setSharePaymentRequestForm(updatedRequests);
  };

  // handle delete request form
  const handleDeleteRequestForm = (index: number) => {
    const updatedRequest = sharePaymentRequestForm.filter(
      (_, i) => i !== index
    );
    setSharePaymentRequestForm(updatedRequest);
  };

  // get category details
  useEffect(() => {
    getWorkspaceCategoryProperties(Number(workspaceId));
  }, [getWorkspaceCategoryProperties, workspaceId]);

  // get payment request details
  useEffect(() => {
    getPaymentRequestShareCodeData(shareId).then((res) => {
      if (res) {
        setPaymentDetails(res);
      }
    });
  }, []);
  console.log("details", paymentDetails);
  // if (paymentDetails && paymentDetails.length > 0) {
  // end

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
    workspace?.vault_wallet && getAssets();
  }, [workspace?.vault_wallet, getAssets]);

  // modal
  const [openModal, setOpenModal] = useState(false);

  const checkAllFields = () => {
    if (!sharePaymentRequestForm.length) {
      return;
    }
    for (const item of sharePaymentRequestForm) {
      if (!item.recipient || !item.amount || !item.currency_contract_address) {
        toast.error("Please fill all fields");
        return;
      }
      if (!isAddress(item.recipient)) {
        toast.error(`Invalid address: ${item.recipient}`);
        return;
      }
      if (Number(item.amount) < 0) {
        toast.error(`Invalid amount: ${item.amount}`);
        return;
      }
      try {
        const amountBigInt = parseUnits(item.amount, item.decimals);
        const selectToken = assetsList.find(
          (s) => s.tokenInfo.address === item.currency_contract_address
        );
        if (BigInt(selectToken?.balance || 0) < amountBigInt) {
          toast.error(
            `Insufficient balance: ${item.amount} ${item.currency_name}`
          );
          return;
        }
      } catch (error) {
        toast.error(`Invalid decimal amount: ${item.amount}`);
        return;
      }
    }
    return true;
  };

  // create payment request
  const handleSubmitPaymentRequest = () => {
    if (!checkAllFields()) {
      return;
    }
    createSharePaymentRequest(shareId, { rows: sharePaymentRequestForm }).then(
      (res) => {
        if (res) {
          setOpenModal(true);
        }
      }
    );
  };
  const handleSavePaymentRequest = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    getWorkspaceDetails(Number(workspaceId));
  }, []);

  useEffect(() => {
    if (paymentDetails && paymentDetails.length > 0) {
      const updatedForm = paymentDetails.map((paymentDetail) => {
        return {
          amount: paymentDetail.amount,
          currency_name: paymentDetail.currency_name,
          recipient: paymentDetail.recipient,
          decimals: paymentDetail.decimals,
          category_id: paymentDetail.category_id,
          category_name: paymentDetail.category_name,
          currency_contract_address: paymentDetail.currency_contract_address,
          category_properties: Array.isArray(paymentDetail.category_properties)
            ? paymentDetail.category_properties
            : JSON.parse(paymentDetail.category_properties),
        };
      });
      setSharePaymentRequestForm(updatedForm);
    }
  }, [paymentDetails]);

  return (
    <>
      {isLoading && <Loading />}
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        component={PaymentRequestPreview}
        additionalProps={{ sharePaymentRequestForm }}
      />
      <Header>
        <SharePaymentContainer>
          <SharePaymentForm>
            <ShareHeader>
              <h3>New payment request from {workspace.name}</h3>
            </ShareHeader>
            {/* {paymentDetails && paymentDetails.length > 0 ? (
              <p>data</p>
            ) : (
              <> */}
            {sharePaymentRequestForm.map((value, index) => (
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
                            autoComplete="off"
                            // id="fullWidth"
                            placeholder="Enter wallet address"
                            value={value.recipient}
                            onChange={(e) =>
                              handleFormChange(
                                index,
                                "recipient",
                                e.target.value
                              )
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
                            autoComplete="off"
                            value={value.amount}
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
                            value={
                              sharePaymentRequestForm[index]
                                .currency_contract_address
                            }
                            // onChange={handleChange}
                            size="small"
                            onChange={(e) =>
                              handleFormChange(
                                index,
                                "currency_address",
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
                                value={asset.tokenInfo.address}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: "var(--hover-bg)",
                                  },
                                  "&.Mui-selected": {
                                    backgroundColor: "var(--hover-bg)",
                                  },
                                }}
                              >
                                {asset.tokenInfo.symbol}(
                                {formatBalance(
                                  asset.balance,
                                  asset.tokenInfo.decimals
                                )}
                                )
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
                                value={
                                  sharePaymentRequestForm[index].category_name
                                }
                                label={
                                  sharePaymentRequestForm[index].category_name
                                }
                                size="small"
                                // onChange={handleCategoryChange}
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
                                {workspaceCategoryProperties?.map(
                                  (category) => (
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
                                  )
                                )}
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
                                    onChange={(
                                      selectedOption: ReactSelectOption
                                    ) =>
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
                                    onChange={(
                                      selectedOption: ReactSelectOption
                                    ) =>
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
                                  <TextField
                                    sx={{
                                      "& fieldset": { border: "none" },
                                    }}
                                    size="small"
                                    fullWidth
                                    // value="test"
                                    // id="fullWidth"
                                    placeholder="Enter content"
                                    // onChange={(e) =>
                                    //   handlePropertyText(
                                    //     e,
                                    //     property.name,
                                    //     property.type
                                    //   )
                                    // }
                                    onChange={(e) =>
                                      handleFormChange(
                                        index,
                                        "categoryProperties",
                                        e.target.value,
                                        property.name,
                                        property.type
                                      )
                                    }
                                    InputProps={{
                                      style: { padding: 0 },
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                        {/*  */}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <DeleteBtn onClick={() => handleDeleteRequestForm(index)}>
                    Delete
                  </DeleteBtn>
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
            {/* </>
            )} */}
          </SharePaymentForm>
        </SharePaymentContainer>
      </Header>
    </>
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
