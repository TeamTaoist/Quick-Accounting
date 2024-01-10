import styled from "@emotion/styled";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";
import React, { ChangeEvent, useState } from "react";
import {
  CategoryTitle,
  CreateBtn,
  CreateOptionButton,
} from "../category/Category";
import add from "../../../assets/workspace/add.svg";
import archive from "../../../assets/workspace/archive.svg";
import searchIcon from "../../../assets/workspace/search-icon.svg";
import approve from "../../../assets/workspace/select.svg";
import download from "../../../assets/workspace/download.svg";
import view from "../../../assets/workspace/view.svg";
import importIcon from "../../../assets/workspace/import-icon.svg";
import hide from "../../../assets/workspace/hide.svg";
import back from "../../../assets/workspace/back.svg";
import filterIcon from "../../../assets/workspace/filtering.svg";
import rightArrow from "../../../assets/workspace/right-arrow.svg";

// table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RejectDataTable from "../../../components/workspace/RejectDataTable";
import {
  ActionBtn,
  Btn,
  Header,
  Image,
  Option,
  PaymentRequestBody,
  PaymentRequestContainer,
  RejectSection,
  ViewReject,
} from "../paymentRequest/paymentRequest.style";
import data from "../../../data/tableData";
import BookkeepingRejectTable from "../../../components/workspace/BookkeepingRejectTable";

interface SubPayment {
  id: number;
  idNumber: string;
}

interface Payment {
  id: number;
  idNumber: string;
  category: string;
  amount: number;
  date: string;
  subPayment: SubPayment[];
}

const payments: Payment[] = [
  {
    id: 1,
    idNumber: "0Xdf344...4324",
    amount: 100,
    category: "John Doe",
    date: "2022-01-01",
    subPayment: [],
  },
  {
    id: 2,
    idNumber: "0Xdf344...4324",
    amount: 150,
    category: "Jane Doe",
    date: "2022-01-02",
    subPayment: [],
  },
  {
    id: 3,
    idNumber: "0Xdf344...4324",
    amount: 200,
    category: "Bob Smith",
    date: "2022-01-03",
    subPayment: [],
  },
  {
    id: 4,
    idNumber: "0Xdf344...4324",
    amount: 120,
    category: "Alice Johnson",
    date: "2022-01-04",
    subPayment: [
      { id: 31, idNumber: "Subcategory 3-1" },
      { id: 32, idNumber: "Subcategory 3-2" },
      { id: 33, idNumber: "Subcategory 3-3" },
    ],
  },
];
const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};

const Bookkeeping = () => {
  const navigate = useNavigate();
  // table logic
  const [selected, setSelected] = useState<number[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(data.map((c) => c.id));
    } else {
      setSelected([]);
    }
  };

  const handleCheckboxClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    categoryId: number
  ) => {
    if (event.target.checked) {
      setSelected((prevSelected) => [...prevSelected, categoryId]);
    } else {
      setSelected((prevSelected) =>
        prevSelected.filter((id) => id !== categoryId)
      );
    }
  };

  const isSelected = (categoryId: number) => {
    return selected.indexOf(categoryId) !== -1;
  };

  // end
  const [hasCategory, setHasCategory] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleDropdownChange = (event: any) => {
    setSelectedValue(event.target.value);
  };
  const [paymentRequest, setPaymentRequest] = useState(true);

  return (
    <WorkspaceLayout>
      <PaymentRequestContainer>
        {!hasCategory && (
          <CategoryTitle>
            <h3>No payment request yet.</h3>
            <p style={{ width: "509px", textAlign: "center" }}>
              Payments requests are requested by share link or drafted directly
              by multi-signer will show up here.
            </p>
            <CreateOptionButton>
              <CreateBtn>
                <img src={add} alt="" />
                <span>Create category</span>
              </CreateBtn>
              <CreateBtn>
                <img src={archive} alt="" />
                <span>View archive</span>
              </CreateBtn>
            </CreateOptionButton>
          </CategoryTitle>
        )}
        {/* header */}
        <Header>
          <TextField
            id="search"
            type="search"
            placeholder="Search Token"
            value={searchTerm}
            onChange={handleChange}
            sx={{ width: 350 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={searchIcon} alt="" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl>
            <Select
              value={selectedValue}
              onChange={handleDropdownChange}
              displayEmpty
              inputProps={{ "aria-label": "Select a value" }}
            >
              <MenuItem value="" disabled>
                <Option>
                  <Image src={filterIcon} alt="" />
                  Filter by Category
                </Option>
              </MenuItem>
              <MenuItem value="option1">Option 1</MenuItem>
              <MenuItem value="option2">Option 2</MenuItem>
              <MenuItem value="option3">Option 3</MenuItem>
            </Select>
          </FormControl>
          <ViewReject onClick={() => setPaymentRequest(!paymentRequest)}>
            {paymentRequest ? (
              <div>
                <Image src={view} alt="" />
                <p>View hidden</p>
              </div>
            ) : (
              <div>
                <Image src={back} alt="" />
                <p>Back</p>
              </div>
            )}
          </ViewReject>
        </Header>
        {paymentRequest ? (
          <PaymentRequestBody>
            <ActionBtn>
              <Btn>
                <img src={importIcon} alt="" />
                <p>Import</p>
              </Btn>
              <Btn>
                <img src={download} alt="" />
                <p>Download</p>
              </Btn>
              <Btn>
                <img src={hide} alt="" />
                <p>Reject</p>
              </Btn>
            </ActionBtn>
            {/* table */}
            <TableContainer
              sx={{ border: "1px solid var(--border)", borderRadius: "10px" }}
            >
              <Table>
                <TableHead style={{ backgroundColor: "#f0f0f0" }}>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        indeterminate={
                          selected.length > 0 &&
                          selected.length < payments.length
                        }
                        checked={selected.length === payments.length}
                        onChange={handleSelectAllClick}
                      />
                      Safe
                    </TableCell>
                    <TableCell>Recipient</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((book) => (
                    <>
                      <TableRow>
                        <TableCell
                          style={{
                            padding: 0,
                            paddingLeft: "16px",
                            borderBottom: "1px solid #ddd",
                            borderTop: "none",
                          }}
                        >
                          <SafeSection>
                            <div>
                              <Checkbox
                                checked={isSelected(book.id)}
                                onChange={(event) =>
                                  handleCheckboxClick(event, book.id)
                                }
                              />
                              {`${book.recipient.slice(
                                0,
                                6
                              )}...${book.recipient.slice(-4)}`}
                            </div>
                            <Logo>
                              <img src={rightArrow} alt="" />
                            </Logo>
                          </SafeSection>
                        </TableCell>
                        <TableCell>{`${book.recipient.slice(
                          0,
                          6
                        )}...${book.recipient.slice(-4)}`}</TableCell>
                        <TableCell>{book.amount}</TableCell>
                        <TableCell>{book.date}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            sx={{
                              borderColor: "black",
                              color: "black",
                              textTransform: "lowercase",
                            }}
                            onClick={() => navigate(`/bookkeeping/${book.id}`)}
                          >
                            view more
                          </Button>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </PaymentRequestBody>
        ) : (
          <RejectSection>
            <BookkeepingRejectTable />
          </RejectSection>
        )}
      </PaymentRequestContainer>
    </WorkspaceLayout>
  );
};

export default Bookkeeping;

export const SafeSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const Logo = styled.div`
  flex: 0 0 30%;
  img {
    width: 20px;
  }
`;
