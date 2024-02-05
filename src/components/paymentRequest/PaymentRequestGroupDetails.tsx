import { useParams } from "react-router-dom";
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
  Typography,
} from "@mui/material";

import arrowBottom from "../../assets/workspace/arrow-bottom.svg";
import multiSelect from "../../assets/workspace/multi-select.svg";
import selectIcon from "../../assets/workspace/select.svg";
import categoryIcon from "../../assets/workspace/category-icon.svg";
import optionsIcon from "../../assets/workspace/option.svg";
import statusIcon from "../../assets/workspace/status.svg";
import styled from "@emotion/styled";
import usePaymentsStore from "../../store/usePayments";
import { useLoading } from "../../store/useLoading";
import {
  DeleteIcon,
  Image,
  NoteInfo,
  NoteInformation,
  RequestSubmit,
} from "../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import ReactSelect from "../ReactSelect";
import WorkspaceItemDetailsLayout from "../layout/WorkspaceItemDetailsLayout";

interface PaymentRequestDetailsProps {
  setOpen: (open: boolean) => void;
}
declare interface paymentRequestBody {
  id: number;
  amount: string;
  currency_name: string;
  recipient: string;
  decimals: number;
  category_id: null | number;
  category_name: string;
  currency_contract_address?: string;
  category_properties: CategoryProperties[];
}

const PaymentRequestGroupDetails = ({
  setOpen,
}: PaymentRequestDetailsProps) => {
  const { id } = useParams();

  const [selectedValue, setSelectedValue] = useState("Option1");

  const { paymentRequestGroupDetails } = usePaymentsStore();
  const { isLoading } = useLoading();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };

  const [age, setAge] = useState("Category");

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const [selectedValues, setSelectedValues] = useState([]);

  const handleSelectChange = (selectedOptions: any) => {
    setSelectedValues(selectedOptions);
  };

  // update
  const [sharePaymentRequestForm, setSharePaymentRequestForm] = useState<
    paymentRequestBody[]
  >([
    {
      id: 0,
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

  console.log("form data", sharePaymentRequestForm);

  useEffect(() => {
    if (paymentRequestGroupDetails && paymentRequestGroupDetails.length > 0) {
      const updatedForm = paymentRequestGroupDetails.map((paymentDetail) => {
        return {
          id: paymentDetail.ID,
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

      // const updatedCategoryIDs = updatedForm.map(
      //   (formItem) => formItem.category_id
      // );
      // setSelectedCategoryIDs(updatedCategoryIDs);

      // const updatedSelectedCategories = updatedCategoryIDs.map((id: number) =>
      //   workspaceCategoryProperties?.find((category) => category.ID === id)
      // );
      // setSelectedCategories(updatedSelectedCategories);
    }
  }, [paymentRequestGroupDetails]);
  const handleUpdatePaymentRequest = (id: number) => {
    const selectedPayment = sharePaymentRequestForm.find((f) => f.id === id);
    console.log(id);
    console.log("selectedPayment", selectedPayment);
    const paymentRequestBody = {
      category_id: selectedPayment?.id,
      category_name: selectedPayment?.category_name,
      category_Properties: selectedPayment?.category_properties,
    };
    console.log("paymentRequestBody", paymentRequestBody);
  };

  return (
    <>
      <WorkspaceItemDetailsLayout
        title="Payment request details"
        setOpen={setOpen}
      >
        <RequestDetails>
          {sharePaymentRequestForm.map((payment: any) => (
            <React.Fragment key={payment.ID}>
              <TableContainer
                sx={{ paddingInline: "46px", paddingTop: "30px" }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: 200,
                          border: 0,
                          paddingInline: 0,
                        }}
                      >
                        Recipient
                      </TableCell>
                      <TableCell
                        sx={{ width: 150, border: 0, paddingInline: 0 }}
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        sx={{ width: 200, border: 0, paddingInline: 0 }}
                      >
                        Currency
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {/* {paymentRequestGroupDetails.map((payment) => ( */}
                  <TableBody>
                    <TableRow
                      sx={{
                        height: "30px",
                        borderRadius: "10px",
                      }}
                    >
                      <TableCell
                        // size="small"
                        sx={{
                          border: "1px solid var(--border-table)",
                          padding: 0,
                        }}
                      >
                        <TextField
                          sx={{
                            "& fieldset": { border: "none" },
                          }}
                          // disabled={paymentRequestDetails.status === 1}
                          size="small"
                          value={payment.recipient}
                          fullWidth
                          // id="fullWidth"
                          placeholder="Enter wallet address"
                          InputProps={{
                            style: { padding: 0 },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "1px solid var(--border-table)",
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
                          // disabled={paymentRequestDetails.status === 1}
                          size="small"
                          value={payment.amount}
                          fullWidth
                          // id="fullWidth"
                          placeholder="Enter wallet address"
                          InputProps={{
                            style: { padding: 0 },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "1px solid var(--border-table)",
                          padding: 0,
                          // minHeight: "40px",
                        }}
                      >
                        <Select
                          // disabled={paymentRequestDetails.status === 1}
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
                            {payment.currency_name}
                          </MenuItem>
                        </Select>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  {/* ))} */}
                </Table>
              </TableContainer>
              {/* note info */}
              <NoteInformation>
                {/* {paymentRequestGroupDetails.map((payment) => ( */}
                <TableContainer sx={{ borderRadius: "7px" }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                      <TableRow
                        sx={{
                          td: {
                            border: "1px solid var(--border-table)",
                            padding: 0,
                            paddingInline: 1,
                          },
                        }}
                      >
                        <TableCell sx={{ height: 1, width: 200 }}>
                          <NoteInfo>
                            <Image src={categoryIcon} alt="" /> Category
                          </NoteInfo>
                        </TableCell>
                        <TableCell>
                          <FormControl
                            fullWidth
                            // disabled={paymentRequestDetails.status === 1}
                          >
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={age}
                              label="Age"
                              size="small"
                              onChange={handleCategoryChange}
                              onBlur={() =>
                                handleUpdatePaymentRequest(payment.id)
                              }
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
                                {payment?.category_name}
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                      {payment?.category_properties.map((properties: any) => (
                        <>
                          {properties.type === "single-select" && (
                            <TableRow
                              sx={{
                                td: {
                                  border: "1px solid var(--border-table)",
                                  padding: 1,
                                  paddingInline: 1,
                                },
                              }}
                            >
                              <TableCell sx={{ height: 1, width: 200 }}>
                                <NoteInfo>
                                  <Image src={selectIcon} alt="" />{" "}
                                  {properties.name}
                                </NoteInfo>
                              </TableCell>
                              <TableCell
                                onBlur={() =>
                                  handleUpdatePaymentRequest(payment.id)
                                }
                              >
                                <ReactSelect
                                  // isDisabled={paymentRequestDetails.status === 1}
                                  value={selectedValues}
                                  onChange={handleSelectChange}
                                  options={[
                                    {
                                      value: properties.values,
                                      label: properties.values,
                                    },
                                  ]}
                                  defaultValues={[
                                    {
                                      value: properties.values,
                                      label: properties.values,
                                    },
                                  ]}
                                />
                              </TableCell>
                            </TableRow>
                          )}
                          {
                            <>
                              {properties.type === "multi-select" && (
                                <TableRow
                                  sx={{
                                    td: {
                                      border: "1px solid var(--border-table)",
                                      padding: 1,
                                      paddingInline: 1,
                                    },
                                  }}
                                >
                                  <TableCell sx={{ height: 1, width: 200 }}>
                                    <NoteInfo>
                                      <Image src={multiSelect} alt="" />{" "}
                                      {properties.name}
                                    </NoteInfo>
                                  </TableCell>
                                  <TableCell>
                                    <ReactSelect
                                      // isDisabled={
                                      //   paymentRequestDetails.status === 1
                                      // }
                                      value={selectedValues}
                                      onChange={handleSelectChange}
                                      options={properties.values
                                        .split(";")
                                        .map((v: string) => ({
                                          value: v,
                                          label: v,
                                        }))}
                                      defaultValues={properties.values
                                        .split(";")
                                        .map((v: string) => ({
                                          value: v,
                                          label: v,
                                        }))}
                                    />
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          }
                          <>
                            {properties.type === "Text" && (
                              <TableRow
                                sx={{
                                  td: {
                                    border: "1px solid var(--border-table)",
                                    padding: 1,
                                    paddingInline: 1,
                                  },
                                }}
                              >
                                <TableCell sx={{ height: 1, width: 200 }}>
                                  <NoteInfo>
                                    <Image src={optionsIcon} alt="" />{" "}
                                    {properties.name}
                                  </NoteInfo>
                                </TableCell>
                                <TableCell>
                                  <p style={{ paddingLeft: "10px" }}>
                                    {properties.values}
                                  </p>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* ))} */}
              </NoteInformation>
            </React.Fragment>
          ))}
        </RequestDetails>
        {/* {paymentRequestDetails.status === 1 && (
              <PaymentStatus>
                <img src={statusIcon} alt="" />
                <p>Status: Rejected</p>
              </PaymentStatus>
            )} */}
      </WorkspaceItemDetailsLayout>
    </>
  );
};

export default PaymentRequestGroupDetails;

const RequestDetails = styled.div`
  padding-bottom: 50px;
`;
const PaymentStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 20px;
  img {
    width: 20px;
  }
  p {
    font-size: 20px;
  }
`;
