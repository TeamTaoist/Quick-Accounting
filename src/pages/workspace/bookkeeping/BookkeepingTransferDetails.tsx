import { useParams } from "react-router-dom";
import Header from "../../../components/layout/header/Header";
import WorkspaceItemDetailsLayout from "../../../components/layout/WorkspaceItemDetailsLayout";
import { useState } from "react";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Paper,
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
import linkIcon from "../../../assets/workspace/link-icon.svg";
import transferArrow from "../../../assets/workspace/transfer-arrow.svg";
import {
  DeleteIcon,
  Image,
  NoteInfo,
  NoteInformation,
  RequestSubmit,
} from "../../workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import styled from "@emotion/styled";
import ReactSelect from "../../../components/ReactSelect";
import data from "../../../data/tableData";

const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};

const BookkeepingTransferDetails = () => {
  const { id } = useParams();
  const [selectedValue, setSelectedValue] = useState("Option1");

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
  const options = [
    { value: "option 1", label: "Options 1" },
    { value: "option 2", label: "Options 2" },
    { value: "option 3", label: "Options 3" },
    { value: "option 4", label: "Options 4" },
    { value: "option 5", label: "Options 5" },
  ];

  return (
    <Header>
      <WorkspaceItemDetailsLayout title="Transfer Detail" href="/bookkeeping">
        <RequestDetails>
          {/* <TableContainer sx={{ paddingInline: "46px", paddingTop: "30px" }}>
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
                    Safe
                  </TableCell>
                  <TableCell sx={{ width: 150, border: 0, paddingInline: 0 }}>
                    Counterparty
                  </TableCell>
                  <TableCell sx={{ width: 200, border: 0, paddingInline: 0 }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ width: 200, border: 0, paddingInline: 0 }}>
                    Currency
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(0, 1).map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      maxHeight: "20px",
                      // borderRadius: "20px",
                      border: "1px solid red",
                    }}
                  >
                    <TableCell
                      sx={{
                        // border: "1px solid var(--border)",
                        padding: 0,
                      }}
                    >
                      <SafeSection>
                        <div>
                          {`${item.recipient.slice(
                            0,
                            6
                          )}...${item.recipient.slice(-4)}`}
                        </div>
                        <Logo>
                          <img src={transferArrow} alt="" />
                        </Logo>
                      </SafeSection>
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid var(--border)",
                      }}
                    >
                      {item.recipient}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid var(--border)",
                      }}
                    >
                      {item.amount}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid var(--border)",
                      }}
                    >
                      {item.currency}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> */}
          <TransferTable>
            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Safe</TableCell>
                    <TableCell>Counterparty</TableCell>
                    <TableCell>Counterparty</TableCell>
                    <TableCell>Counterparty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(0, 1).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        sx={{
                          // borderLeft: "1px solid var(--border)",
                          // borderRadius: "7px",
                          padding: 0,
                        }}
                      >
                        <SafeSection>
                          <div>{recipientFormate(row.recipient)}</div>
                          <Logo>
                            <img src={transferArrow} alt="" />
                          </Logo>
                        </SafeSection>
                      </TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TransferTable>
          {/* Transaction hash */}
          <TransactionHash>
            <h3>Transaction hash</h3>
            <div>
              <p>
                0x2dfeda31e6c3d70e23ea91dbd47435d3898dfb62a1d34945fc8369daa055fcf1
              </p>
              <img src={linkIcon} alt="" />
            </div>
          </TransactionHash>
          <TransactionHash>
            <h3>Transaction date</h3>
            <div>
              <p>Oct-15-2023 01:04:34 PM +UTC</p>
            </div>
          </TransactionHash>
          {/* note info */}
          <NoteInformation>
            <h3>Note Information</h3>

            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                  <TableRow
                    sx={{ td: { border: 1, padding: 0, paddingInline: 1 } }}
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
                            Category name
                          </MenuItem>
                          <MenuItem
                            value={10}
                            sx={{
                              "&:hover": { backgroundColor: "var(--hover-bg)" },
                              "&.Mui-selected": {
                                backgroundColor: "var(--hover-bg)",
                              },
                            }}
                          >
                            Ten
                          </MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ td: { border: 1, padding: 1, paddingInline: 1 } }}
                  >
                    <TableCell sx={{ height: 1, width: 200 }}>
                      <NoteInfo>
                        <Image src={selectIcon} alt="" /> Property name
                      </NoteInfo>
                    </TableCell>
                    {/* add multi select */}
                    <TableCell>
                      <ReactSelect
                        value={selectedValues}
                        onChange={handleSelectChange}
                        options={options}
                        defaultValues={[options[1]]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ td: { border: 1, padding: 1, paddingInline: 1 } }}
                  >
                    <TableCell sx={{ height: 1, width: 200 }}>
                      <NoteInfo>
                        <Image src={multiSelect} alt="" /> Property name
                      </NoteInfo>
                    </TableCell>
                    {/* add multi select */}
                    <TableCell>
                      <ReactSelect
                        value={selectedValues}
                        onChange={handleSelectChange}
                        options={options}
                        defaultValues={[options[1], options[2]]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ td: { border: 1, padding: 1, paddingInline: 1 } }}
                  >
                    <TableCell sx={{ height: 1, width: 200 }}>
                      <NoteInfo>
                        <Image src={optionsIcon} alt="" /> Property name
                      </NoteInfo>
                    </TableCell>
                    {/* add multi select */}
                    <TableCell>
                      Here is some description of the payment request, No more
                      than 50 words. Here is some description of the payment
                      request.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </NoteInformation>
          {/* <ReactSelect /> */}
        </RequestDetails>
      </WorkspaceItemDetailsLayout>
    </Header>
  );
};

export default BookkeepingTransferDetails;

const RequestDetails = styled.div`
  padding-bottom: 50px;
`;
const TransferTable = styled.div`
  /* padding-bottom: 50px; */
  margin-inline: 46px;
  margin-top: 20px;
`;
const TransactionHash = styled.div`
  margin-inline: 46px;
  margin-top: 30px;
  h3 {
    font-size: 18px;
    padding-bottom: 8px;
    font-weight: 400;
  }
  div {
    border: 1px solid var(--border);
    padding: 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      color: var(--text-secondary);
      font-size: 16px;
    }
    img {
      width: 22px;
    }
  }
`;
export const SafeSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* height: 100%; */
`;
export const Logo = styled.div`
  /* flex: 0 0 30%; */
  /* height: 44px; */
  img {
    /* width: 20px; */
    /* height: 100%; */
  }
`;
