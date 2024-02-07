import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/layout/header/Header";
import WorkspaceItemDetailsLayout from "../../../components/layout/WorkspaceItemDetailsLayout";
import React, { useState } from "react";
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
import { useWorkspace } from "../../../store/useWorkspace";
import { Diversity1 } from "@mui/icons-material";

const PaymentRequestPreview = ({ sharePaymentRequestForm }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workspace } = useWorkspace();

  const [selectedValue, setSelectedValue] = useState("Option1");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };

  const [age, setAge] = useState("Category");

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  console.log(sharePaymentRequestForm);

  return (
    <SharePaymentContainer>
      <SharePaymentForm>
        <ShareHeader>
          <h3>New payment request from {workspace.name}</h3>
        </ShareHeader>
        {sharePaymentRequestForm.map((request: any, i: number) => (
          <RequestDetails key={i}>
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
                        value={request.recipient}
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
                        borderRight: "1px solid var(--border-table)",
                        borderRadius: "5px",
                        padding: 0,
                        paddingLeft: "10px",
                        // minHeight: "40px",
                      }}
                    >
                      {request.amount}
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
                      {request.currency_name}
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
                              marginLeft: "-12px",
                              "& fieldset": { border: "none" },
                            }}
                          >
                            <MenuItem disabled value="Category">
                              {request.category_name}
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                    {/* property options */}
                    {request.category_properties.map(
                      (property: any, i: number) => (
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
                              {/* add multi select */}
                              <TableCell>
                                <PropertyOption>
                                  <p>{property.values}</p>
                                </PropertyOption>
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
                                <PropertyOption>
                                  {property.values
                                    .split(";")
                                    .map((option: string, i: number) => (
                                      <p key={i}>{option}</p>
                                    ))}
                                </PropertyOption>
                              </TableCell>
                            </TableRow>
                          )}
                          {property.type === "Text" && (
                            <TableRow
                              sx={{
                                td: {
                                  border: "1px solid var(--border-table)",
                                  padding: "5px",
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
                              <TableCell>{property.values}</TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </NoteInformation>
            {/* <ReactSelect /> */}
          </RequestDetails>
        ))}
        <Btn>
          <AddBtn onClick={() => navigate("/user")}>
            View the progress of your payment request
          </AddBtn>
        </Btn>
      </SharePaymentForm>
    </SharePaymentContainer>
  );
};

export default PaymentRequestPreview;

const SharePaymentContainer = styled.div`
  /* display: flex;
  justify-content: center;
  align-items: center; */
  padding-top: 100px;
  min-height: 90vh;
`;
const SharePaymentForm = styled.div`
  width: 757px;
  outline: 1px solid var(--border-table);
  border-radius: 10px;
  overflow: hidden;
  margin: 40px 0;
  background: #fff;
`;
const RequestDetails = styled.div`
  padding-bottom: 50px;
  padding: 10px 30px;
`;
const ShareHeader = styled.div`
  height: 98px;
  width: 100%;
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
const Btn = styled.div`
  padding-bottom: 50px;
  padding: 10px 30px;
`;
const AddBtn = styled.button`
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
const PropertyOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  p {
    font-size: 13px;
    background: var(--bg-primary);
    padding: 2px 8px;
    border-radius: 4px;
    padding-inline: 20px;
  }
`;
