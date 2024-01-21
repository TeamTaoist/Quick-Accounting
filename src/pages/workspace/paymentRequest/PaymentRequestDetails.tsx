import { useParams } from "react-router-dom";
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
import {
  DeleteIcon,
  Image,
  NoteInfo,
  NoteInformation,
  RequestSubmit,
} from "../../workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import styled from "@emotion/styled";
import ReactSelect from "../../../components/ReactSelect";
import usePaymentsStore from "../../../store/usePayments";
import { useLoading } from "../../../store/useLoading";
import Loading from "../../../utils/Loading";

interface PaymentRequestDetailsProps {
  setOpen: (open: boolean) => void;
}

const PaymentRequestDetails = ({ setOpen }: PaymentRequestDetailsProps) => {
  const { id } = useParams();

  const [selectedValue, setSelectedValue] = useState("Option1");

  const { paymentRequestDetails } = usePaymentsStore();
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
  if (isLoading) return <p></p>;

  let parseCategoryProperties;
  if (paymentRequestDetails) {
    const categoryProperties = paymentRequestDetails?.category_properties;
    parseCategoryProperties = JSON.parse(categoryProperties);
  }
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
                      size="small"
                      value={paymentRequestDetails.recipient}
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
                    {paymentRequestDetails.amount}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid var(--border-table)",
                      padding: 0,
                      // minHeight: "40px",
                    }}
                  >
                    <Select
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
                        {paymentRequestDetails.currency_name}
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
                            {paymentRequestDetails.category_name}
                          </MenuItem>
                          {/* <MenuItem value={20}>Twenty</MenuItem> */}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                  {parseCategoryProperties?.map((property: any) => (
                    <>
                      {property.type === "single-select" && (
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
                              <Image src={selectIcon} alt="" /> {property.name}
                            </NoteInfo>
                          </TableCell>
                          {/* add multi select */}
                          <TableCell>
                            <ReactSelect
                              value={selectedValues}
                              onChange={handleSelectChange}
                              options={[
                                {
                                  value: property.values,
                                  label: property.values,
                                },
                              ]}
                              defaultValues={[
                                {
                                  value: property.values,
                                  label: property.values,
                                },
                              ]}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                      {
                        <>
                          {property.type === "multi-select" && (
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
                                  {property.name}
                                </NoteInfo>
                              </TableCell>
                              {/* add multi select */}
                              <TableCell>
                                <ReactSelect
                                  value={selectedValues}
                                  onChange={handleSelectChange}
                                  options={property.values
                                    .split(";")
                                    .map((v: string) => ({
                                      value: v,
                                      label: v,
                                    }))}
                                  defaultValues={property.values
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
                        {property.type === "Text" && (
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
                                {property.name}
                              </NoteInfo>
                            </TableCell>
                            {/* add multi select */}
                            <TableCell>{property.values}</TableCell>
                          </TableRow>
                        )}
                      </>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </NoteInformation>
          {/* <ReactSelect /> */}
        </RequestDetails>
      </WorkspaceItemDetailsLayout>
    </>
  );
};

export default PaymentRequestDetails;

const RequestDetails = styled.div`
  padding-bottom: 50px;
`;
