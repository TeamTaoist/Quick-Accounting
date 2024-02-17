import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/layout/header/Header";
import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
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
import { useLoading } from "../../../store/useLoading";
import Loading from "../../../utils/Loading";
import { useWorkspace } from "../../../store/useWorkspace";
import { useSharePaymentRequest } from "../../../store/useSharePaymentRequest";
import { ReactSelectOption } from "../../workspaceDashboard/newPaymentRequest/NewPaymentRequest";
import { formatBalance } from "../../../utils/number";
import { toast } from "react-toastify";
import { isAddress } from "viem";
import { parseUnits } from "ethers";
import ConfirmModal from "../../../components/confirmModal";

const ShareWorkspacePaymentRequest = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();

  const { isLoading } = useLoading();
  const { workspace, assetsList, getAssets, updateWorkspace } = useWorkspace();
  const {
    createSharePaymentRequest,
    getPaymentRequestShareCodeData,
    saveSharePaymentRequest,
    shareData,
  } = useSharePaymentRequest();
  const [confirmVisible, setConfirmVisible] = useState(false);
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
  console.log("sharePaymentRequestForm", sharePaymentRequestForm);

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
      const existingCategoryProperty = updatedRequests[
        index
      ].category_properties.find(
        (property) =>
          property.name === propertyName && property.type === propertyType
      );

      if (existingCategoryProperty) {
        const values =
          propertyType === "single-select"
            ? value.value
            : propertyType === "Text"
            ? value
            : value.map((v: ReactSelectOption) => v.value).join(";");

        existingCategoryProperty.values = values;
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

  const handleDeleteRequestForm = (index: number) => {
    const updatedRequest = sharePaymentRequestForm.filter(
      (_, i) => i !== index
    );
    setSharePaymentRequestForm(updatedRequest);
  };

  // get category details

  const [shareDataLoading, setShareDataLoading] = useState<boolean>(false);
  // get payment request details
  useEffect(() => {
    const fetchPaymentRequestData = async () => {
      await getPaymentRequestShareCodeData(shareId).then((res) => {
        if (res) {
          updateWorkspace(res);
        }
      });
    };
    fetchPaymentRequestData();
  }, [shareDataLoading]);

  const [selectedCategoryIDs, setSelectedCategoryIDs] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any>([]);

  console.log("selected category", selectedCategoryIDs);
  const handleCategoryDropdown = (
    categoryId: number,
    categoryName: string,
    index: number
  ) => {
    const updatedCategoryIDs = [...selectedCategoryIDs];
    updatedCategoryIDs[index] = categoryId;
    setSelectedCategoryIDs(updatedCategoryIDs);

    const updatedRequests = [...sharePaymentRequestForm];
    updatedRequests[index] = {
      ...updatedRequests[index],
      category_id: categoryId,
      category_name: categoryName,
      category_properties: [],
    };
    setSharePaymentRequestForm(updatedRequests);
    const updatedSelectedCategories = updatedCategoryIDs.map((id: any) =>
      shareData?.category_and_properties?.find((category) => category.ID === id)
    );
    setSelectedCategories(updatedSelectedCategories);
  };
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
      if (Number(item.amount) <= 0) {
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

  const handleConfirmSubmit = () => {
    createSharePaymentRequest(shareId, { rows: sharePaymentRequestForm }).then(
      (res) => {
        setConfirmVisible(false);
      }
    );
  };

  // create payment request
  const handleSubmitPaymentRequest = () => {
    if (!checkAllFields()) {
      return;
    }
    setConfirmVisible(true);
  };
  // TODO: don't need to fetch data again after submit & save
  const handleSavePaymentRequest = async () => {
    await saveSharePaymentRequest(shareId, { rows: sharePaymentRequestForm });
  };

  useEffect(() => {
    if (shareData && shareData.payment_request_items !== null) {
      const updatedForm = shareData?.payment_request_items?.map(
        (paymentDetail) => {
          return {
            amount: paymentDetail.amount,
            currency_name: paymentDetail.currency_name,
            recipient: paymentDetail.recipient,
            decimals: paymentDetail.decimals,
            category_id: paymentDetail.category_id,
            category_name: paymentDetail.category_name,
            currency_contract_address: paymentDetail.currency_contract_address,
            category_properties: Array.isArray(
              paymentDetail.category_properties
            )
              ? paymentDetail.category_properties
              : JSON.parse(paymentDetail.category_properties),
          };
        }
      );
      setSharePaymentRequestForm(updatedForm);

      const updatedCategoryIDs = updatedForm.map(
        (formItem) => formItem.category_id
      );
      setSelectedCategoryIDs(updatedCategoryIDs);

      const updatedSelectedCategories = updatedCategoryIDs.map((id: number) =>
        shareData?.category_and_properties?.find(
          (category) => category.ID === id
        )
      );
      setSelectedCategories(updatedSelectedCategories);
    }
  }, [shareData]);
  const isEditable =
    shareData?.payment_request_items?.[0]?.status !== 0 &&
    shareData?.payment_request_items !== null;

  return (
    <>
      {isLoading && <Loading />}
      <Header>
        <SharePaymentContainer>
          <SharePaymentForm>
            <ShareHeader>
              <h3>New payment request from {workspace.name}</h3>
            </ShareHeader>
            {sharePaymentRequestForm.map((value, index) => (
              <RequestDetails key={index}>
                <TableContainer
                  sx={{
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
                            width: "30%",
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
                            width: "23%",
                            borderRight: "1px solid var(--border-table)",
                            fontSize: "18px",
                            fontWeight: "500",
                          }}
                        >
                          Amount
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "37%",
                            fontSize: "18px",
                            fontWeight: "500",
                          }}
                        >
                          Currency
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
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
                            // paddingInline: "16px",
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
                              readOnly: isEditable,
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
                              readOnly: isEditable,
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
                              width: "100%",
                              "& fieldset": { border: "none" },
                            }}
                            inputProps={{
                              readOnly: isEditable,
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
                    <Table sx={{ minWidth: 600 }} aria-label="simple table">
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
                          <TableCell sx={{ height: 1, width: "33.5%" }}>
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
                                inputProps={{
                                  readOnly: isEditable,
                                }}
                              >
                                <MenuItem disabled value="">
                                  {sharePaymentRequestForm[index].category_name}
                                </MenuItem>
                                {shareData?.category_and_properties?.map(
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
                        {/* {paymentDetails && paymentDetails.length === 0 && ( */}
                        <>
                          {selectedCategories[index]?.properties?.map(
                            (property: ICategoryProperties, i: number) => (
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
                                    <TableCell sx={{ height: 1, width: 252 }}>
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
                                        isDisabled={isEditable}
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
                                          .map((v: string) => ({
                                            value: v,
                                            label: v,
                                          }))}
                                        defaultValues={sharePaymentRequestForm[
                                          index
                                        ].category_properties
                                          .filter(
                                            (p: any) =>
                                              p.type === "single-select" &&
                                              p.name === property.name
                                          )
                                          .map((p: any) =>
                                            p.values
                                              .split(";")
                                              .map((v: string) => ({
                                                value: v,
                                                label: v,
                                              }))
                                          )
                                          .flat()}
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
                                    <TableCell sx={{ height: 1, width: 252 }}>
                                      <NoteInfo>
                                        <Image src={multiSelect} alt="" />{" "}
                                        {property.name}
                                      </NoteInfo>
                                    </TableCell>
                                    {/* add multi select */}
                                    <TableCell>
                                      <ReactSelect
                                        value={selectedValues}
                                        isDisabled={isEditable}
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
                                          .map((v: any) => ({
                                            value: v,
                                            label: v,
                                          }))}
                                        defaultValues={sharePaymentRequestForm[
                                          index
                                        ].category_properties
                                          .filter(
                                            (p: any) =>
                                              p.type === "multi-select" &&
                                              p.name === property.name
                                          )
                                          .map((p: any) =>
                                            p.values
                                              .split(";")
                                              .map((v: string) => ({
                                                value: v,
                                                label: v,
                                              }))
                                          )
                                          .flat()}
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
                                    <TableCell sx={{ height: 1, width: 252 }}>
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
                                        autoComplete="off"
                                        fullWidth
                                        value={
                                          sharePaymentRequestForm[
                                            index
                                          ].category_properties.find(
                                            (p) =>
                                              p.name === property.name &&
                                              p.type === "Text"
                                          )?.values || ""
                                        }
                                        placeholder="Enter content"
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
                                          readOnly: isEditable,
                                        }}
                                      />
                                    </TableCell>
                                  </TableRow>
                                )}
                              </React.Fragment>
                            )
                          )}
                        </>
                        {/* )} */}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {!isEditable && (
                    <DeleteBtn onClick={() => handleDeleteRequestForm(index)}>
                      Delete
                    </DeleteBtn>
                  )}
                </NoteInformation>
                {/* <ReactSelect /> */}
              </RequestDetails>
            ))}
            {shareData?.payment_request_items?.[0]?.status !== 0 &&
            shareData?.payment_request_items?.length ? (
              <Btns>
                <ViewProgressBtn onClick={() => navigate("/user")}>
                  View the progress of your payment request
                </ViewProgressBtn>
              </Btns>
            ) : (
              <Btns>
                <AddBtn onClick={handleAddRequest}>+ Add</AddBtn>
                <SubmitBtns>
                  <Save onClick={handleSavePaymentRequest}>Save</Save>
                  <Submit onClick={handleSubmitPaymentRequest}>Submit</Submit>
                </SubmitBtns>
              </Btns>
            )}
            {/* </>
            )} */}
            {confirmVisible && (
              <ConfirmModal
                msg="Confirm to submit?"
                onConfirm={handleConfirmSubmit}
                onClose={() => setConfirmVisible(false)}
              />
            )}
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
const ViewProgressBtn = styled.button`
  background: var(--bg-primary);
  font-size: 16px;
  width: 100%;
  padding: 8px 0;
  border: 1px solid var(--border-table);
  border-radius: 7px;
  cursor: pointer;
  margin: 20px 0;
  padding-inline: 30px;
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
