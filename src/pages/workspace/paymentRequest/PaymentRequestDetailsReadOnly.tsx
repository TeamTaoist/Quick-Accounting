import WorkspaceItemDetailsLayout from "../../../components/layout/WorkspaceItemDetailsLayout";
import React, { useEffect, useState } from "react";
import {
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
import categoryIcon from "../../../assets/workspace/category-icon.svg";
import statusIcon from "../../../assets/workspace/status.svg";
import {
  Image,
  NoteInfo,
  NoteInformation,
} from "../../workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import styled from "@emotion/styled";
import usePaymentsStore from "../../../store/usePayments";
import {
  getPaymentStatus,
  getPropertyIconByType,
} from "../../../utils/payment";

interface PaymentRequestDetailsProps {
  setOpen: (open: boolean) => void;
  currentDetail?: IPaymentRequest;
}
export interface ReactSelectOption {
  value: string;
  label: string;
}

const PaymentRequestDetails = ({ setOpen }: PaymentRequestDetailsProps) => {
  const [selectedValue, setSelectedValue] = useState("Option1");
  const { paymentRequestDetails } = usePaymentsStore();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };

  const [categoryProperties, setCategoryProperties] = useState<any>([]);

  useEffect(() => {
    if (paymentRequestDetails) {
      try {
        setCategoryProperties(
          JSON.parse(paymentRequestDetails.category_properties)
        );
      } catch (error) {}
    }
  }, [paymentRequestDetails]);

  return (
    <>
      <WorkspaceItemDetailsLayout
        title="Payment request details"
        setOpen={setOpen}
      >
        <RequestDetails>
          <TableContainer sx={{ paddingInline: "46px", paddingTop: "30px" }}>
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
                  <TableCell sx={{ width: 150, border: 0, paddingInline: 0 }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ width: 200, border: 0, paddingInline: 0 }}>
                    Currency
                  </TableCell>
                </TableRow>
              </TableHead>
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
                      disabled={true}
                      size="small"
                      value={paymentRequestDetails?.recipient}
                      fullWidth
                      // id="fullWidth"
                      placeholder="Enter wallet address"
                      InputProps={{
                        style: { padding: 0 },
                        readOnly: true,
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
                      disabled={true}
                      size="small"
                      value={paymentRequestDetails?.amount}
                      fullWidth
                      // id="fullWidth"
                      placeholder="Enter wallet address"
                      InputProps={{
                        style: { padding: 0 },
                        readOnly: true,
                      }}
                    />
                    {/* {paymentRequestDetails.amount} */}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid var(--border-table)",
                      padding: 0,
                      // minHeight: "40px",
                    }}
                  >
                    <Select
                      disabled={true}
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
                      inputProps={{
                        readOnly: true,
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
                        {paymentRequestDetails?.currency_name}
                      </MenuItem>
                      {/* <MenuItem value="Option2">Twenty</MenuItem> */}
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

            <TableContainer sx={{ borderRadius: "7px" }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
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
                        <Image src={categoryIcon} alt="" /> Category
                      </NoteInfo>
                    </TableCell>
                    <TableCell>
                      {paymentRequestDetails?.category_name}
                    </TableCell>
                  </TableRow>
                  {categoryProperties?.map((property: any) => (
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
                          <Image
                            src={getPropertyIconByType(property.type)}
                            alt=""
                          />{" "}
                          {property.name}
                        </NoteInfo>
                      </TableCell>
                      <TableCell>
                        {property.type === "multi-select"
                          ? property?.values
                              .split(";")
                              .map((v: string, idx: number) => (
                                <MultiOption key={idx}>{v}</MultiOption>
                              ))
                          : property.values}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <PaymentStatus>
              <img src={statusIcon} alt="" />
              <p>Status: {getPaymentStatus(paymentRequestDetails?.status)}</p>
            </PaymentStatus>
          </NoteInformation>
        </RequestDetails>
      </WorkspaceItemDetailsLayout>
    </>
  );
};

export default PaymentRequestDetails;

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

const MultiOption = styled.span`
  display: inline-block;
  border-radius: 3px;
  background-color: var(--bg-primary);
  padding:2px 4px;
  margin-right: 8px;
  min-width: 40px;
  text-align: center;
`;
