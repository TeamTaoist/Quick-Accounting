import styled from "@emotion/styled";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  CategoryTitle,
  CreateBtn,
  CreateOptionButton,
} from "../category/category.style";
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
  CategoryCell,
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
import { useTranslation } from "react-i18next";
import CustomModal from "../../../utils/CustomModal";
import BookkeepingTransferDetails from "./BookkeepingTransferDetails";
import { useBookkeeping } from "../../../store/useBookkeeping";

const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};

const Bookkeeping = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { getBookkeepingList } = useBookkeeping();

  // visibility
  const [visible, setVisible] = useState<boolean>(false);

  // fetch bookkeeping data
  useEffect(() => {
    getBookkeepingList(visible);
  }, [getBookkeepingList, visible]);

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
  const [paymentRequest, setPaymentRequest] = useState(true);

  // modal
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // modal end
  // filter
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleDropdownChange = (event: any) => {
    setSelectedValue(event.target.value);
  };
  // hide the selected table row
  const [hiddenRows, setHiddenRows] = useState<number[]>([]);
  const handleHideClick = () => {
    const updatedHiddenRows = [...hiddenRows, ...selected];
    setHiddenRows(updatedHiddenRows);

    setSelected([]);
    // console.log("hidden");
  };
  // filter table data
  const filterData = data.filter((f) => {
    const searchItem = f.safe.toLowerCase().includes(searchTerm.toLowerCase());
    const filterByCategory =
      selectedValue === "" || f.category === selectedValue;
    return searchItem && filterByCategory;
  });
  console.log(hiddenRows);

  return (
    <PaymentRequestContainer>
      {!hasCategory && (
        <CategoryTitle>
          <h3>No payment request yet.</h3>
          <p style={{ width: "509px", textAlign: "center" }}>
            Payments requests are requested by share link or drafted directly by
            multi-signer will show up here.
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
          placeholder={t("paymentRequest.SearchToken")}
          value={searchTerm}
          onChange={handleChange}
          sx={{ width: 350 }}
          size="small"
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
            size="small"
          >
            <MenuItem value="" disabled>
              <Option>
                <Image src={filterIcon} alt="" />
                {t("paymentRequest.Filter")}
              </Option>
            </MenuItem>
            <MenuItem value="category 1">Category 1</MenuItem>
            <MenuItem value="category 2">Category 2</MenuItem>
            <MenuItem value="category 3">Category 3</MenuItem>
          </Select>
        </FormControl>
        <ViewReject onClick={() => setPaymentRequest(!paymentRequest)}>
          {paymentRequest ? (
            <div>
              <Image src={view} alt="" />
              <p>{t("bookkeeping.ViewHidden")}</p>
            </div>
          ) : (
            <div>
              <Image src={back} alt="" />
              <p>{t("paymentRequest.Back")}</p>
            </div>
          )}
        </ViewReject>
      </Header>
      {paymentRequest ? (
        <PaymentRequestBody>
          <ActionBtn>
            <Btn>
              <img src={importIcon} alt="" />
              <p>{t("bookkeeping.Import")}</p>
            </Btn>
            <Btn>
              <img src={download} alt="" />
              <p>{t("paymentRequest.Download")}</p>
            </Btn>
            <Btn onClick={handleHideClick}>
              <img src={hide} alt="" />
              <p>{t("paymentRequest.Hide")}</p>
            </Btn>
          </ActionBtn>
          {/* table */}
          <TableContainer
            sx={{
              border: "1px solid var(--border)",
              borderRadius: "10px",
              maxHeight: 500,
            }}
          >
            <Table stickyHeader>
              <TableHead style={{ backgroundColor: "#f0f0f0" }}>
                <TableRow>
                  <TableCell sx={{ background: "var(--bg-primary)" }}>
                    <Checkbox
                      indeterminate={
                        selected.length > 0 && selected.length < data.length
                      }
                      checked={selected.length === data.length}
                      onChange={handleSelectAllClick}
                    />
                    Safe
                  </TableCell>
                  <TableCell sx={{ background: "var(--bg-primary)" }}>
                    Recipient
                  </TableCell>
                  <TableCell sx={{ background: "var(--bg-primary)" }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ background: "var(--bg-primary)" }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ background: "var(--bg-primary)" }}>
                    Date
                  </TableCell>
                  <TableCell
                    sx={{ background: "var(--bg-primary)" }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterData.map((book) => (
                  <>
                    {!hiddenRows.includes(book.id) && (
                      <TableRow key={book.id}>
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
                        <TableCell>{book.amount} USDT</TableCell>
                        <TableCell>
                          <CategoryCell>{book.category}</CategoryCell>
                        </TableCell>
                        <TableCell>{book.date}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            sx={{
                              borderColor: "black",
                              color: "black",
                              textTransform: "lowercase",
                            }}
                            onClick={handleOpenModal}
                          >
                            view more
                          </Button>
                          {/* modal */}
                          <CustomModal
                            open={openModal}
                            setOpen={setOpenModal}
                            component={BookkeepingTransferDetails}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </PaymentRequestBody>
      ) : (
        <RejectSection>
          <BookkeepingRejectTable hiddenRows={hiddenRows} />
        </RejectSection>
      )}
    </PaymentRequestContainer>
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
