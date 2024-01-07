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
import reject from "../../../assets/workspace/reject.svg";
import filterIcon from "../../../assets/workspace/filtering.svg";

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

const PaymentRequest = () => {
  // table logic
  const [selected, setSelected] = useState<number[]>([]);
  const [openRows, setOpenRows] = useState<number[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(payments.map((category) => category.id));
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

  const handleRowToggle = (categoryId: number) => {
    setOpenRows((prevOpenRows) =>
      prevOpenRows.includes(categoryId)
        ? prevOpenRows.filter((id) => id !== categoryId)
        : [...prevOpenRows, categoryId]
    );
  };

  const isSelected = (categoryId: number) =>
    selected.indexOf(categoryId) !== -1;

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
          <ViewReject>
            <Image src={reject} alt="" />
            <p>View rejection</p>
          </ViewReject>
        </Header>
        <ActionBtn>
          <Btn>
            <img src={download} alt="" />
            <p>Download</p>
          </Btn>
          <Btn>
            <img src={reject} alt="" />
            <p>Reject</p>
          </Btn>
          <Btn>
            <img src={approve} alt="" />
            <p>Approve</p>
          </Btn>
        </ActionBtn>
        {/* table */}
        <TableContainer
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Table size="small">
            <TableHead style={{ backgroundColor: "#f0f0f0" }}>
              <TableRow>
                <TableCell>
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < payments.length
                    }
                    checked={selected.length === payments.length}
                    onChange={handleSelectAllClick}
                  />
                  Category
                </TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <React.Fragment key={payment.id}>
                  {payment.subPayment.length > 0 ? (
                    <TableRow
                      onClick={() => handleRowToggle(payment.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell
                        colSpan={5}
                        style={{
                          padding: 0,
                          paddingLeft: "16px",
                          borderBottom: "1px solid #ddd",
                          borderTop: "none",
                          position: "relative",
                        }}
                      >
                        <Checkbox
                          checked={isSelected(payment.id)}
                          onChange={(event) =>
                            handleCheckboxClick(event, payment.id)
                          }
                        />
                        {payment.idNumber}
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          style={{
                            position: "absolute",
                            left: "200px",
                          }}
                        >
                          {openRows.includes(payment.id) ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell
                        style={{
                          padding: 0,
                          paddingLeft: "16px",
                          borderBottom: "1px solid #ddd",
                          borderTop: "none",
                        }}
                      >
                        <Checkbox
                          checked={isSelected(payment.id)}
                          onChange={(event) =>
                            handleCheckboxClick(event, payment.id)
                          }
                        />
                        {payment.idNumber}
                      </TableCell>
                      <TableCell>{payment.category}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: "black",
                            color: "black",
                            textTransform: "lowercase",
                          }}
                          onClick={() => console.log("Button Clicked")}
                        >
                          view more
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      style={{
                        padding: 0,
                        paddingLeft: "16px",
                        borderTop: "1px solid #ddd",
                      }}
                    >
                      <Collapse
                        in={openRows.includes(payment.id)}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Table size="small">
                          <TableBody>
                            {payment.subPayment.map((subCategory) => (
                              <TableRow key={subCategory.id}>
                                <TableCell>{subCategory.idNumber}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </PaymentRequestContainer>
    </WorkspaceLayout>
  );
};

export default PaymentRequest;

const PaymentRequestContainer = styled.div`
  padding-top: 30px;
  margin-inline: 40px;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ActionBtn = styled.div`
  display: flex;
  justify-content: end;
  gap: 20px;
  width: 100%;
  margin: 20px 0;
  margin-top: 60px;
  img {
    width: 20px;
  }
`;
const Btn = styled.div`
  display: flex;
  gap: 8px;
  border: 1px solid var(--border);
  padding: 6px 10px;
  border-radius: 5px;
  p {
    font-size: 20px;
  }
`;
const Image = styled.img`
  width: 20px;
`;
const Option = styled.div`
  display: flex;
  gap: 5px;
`;
const ViewReject = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--bg-primary);
  padding: 6px 10px;
  border-radius: 5px;
  p {
    font-size: 20px;
  }
`;
