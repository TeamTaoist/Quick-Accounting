import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import searchIcon from "../../../assets/workspace/search-icon.svg";
import download from "../../../assets/workspace/download.svg";
import view from "../../../assets/workspace/view.svg";
import importIcon from "../../../assets/workspace/import-icon.svg";
import hide from "../../../assets/workspace/hide.svg";
import back from "../../../assets/workspace/back.svg";
import filterIcon from "../../../assets/workspace/filtering.svg";

import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  ActionBtn,
  BookkeepingRejectSection,
  Btn,
  Header,
  Image,
  Option,
  PaymentPagination,
  PaymentRequestBody,
  PaymentRequestContainer,
  TableSection,
  ViewReject,
} from "../paymentRequest/paymentRequest.style";
import BookkeepingRejectTable from "../../../components/workspace/bookkeeping/BookkeepingRejectTable";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../utils/CustomModal";
import BookkeepingTransferDetails from "./BookkeepingTransferDetails";
import { useBookkeeping } from "../../../store/useBookkeeping";
import ReactPaginate from "react-paginate";
import { useCategoryProperty } from "../../../store/useCategoryProperty";
import BookkeepingTable from "../../../components/workspace/bookkeeping/BookkeepingTable";
import Pagination from "../../../components/Pagination";

const Bookkeeping = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const {
    getBookkeepingList,
    exportBookkeepingList,
    importBookkeepingList,
    bookkeepingList,
    hideBookkeepingList,
    setCurrentBookkeepingDetail,
    bookkeepingHiddenList,
  } = useBookkeeping();
  const { getWorkspaceCategoryProperties } = useCategoryProperty();

  const [paymentRequest, setPaymentRequest] = useState(true);

  // pagination
  const [pageNumbers, setPageNumbers] = useState(0);
  const [totalItem, setTotalItem] = useState(0);

  const pageCount = Math.ceil(totalItem / 10);
  console.log(pageNumbers);

  const handlePageClick = (event: any) => {
    setPageNumbers(event.selected);
  };
  // visibility
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // modal
  const [openModal, setOpenModal] = useState(false);
  const workspaceId = Number(id);
  // get category
  useEffect(() => {
    getWorkspaceCategoryProperties(workspaceId, true);
  }, []);

  // fetch bookkeeping data
  useEffect(() => {
    getBookkeepingList(workspaceId, visible, pageNumbers).then((res) => {
      if (res) {
        setTotalItem(res);
      }
    });
  }, [
    getBookkeepingList,
    visible,
    workspaceId,
    loading,
    // paymentRequest,
    pageNumbers,
  ]);

  // table logic
  const [selected, setSelected] = useState<number[]>([]);
  console.log(selected);

  const handleBookkeepingDetails = (bookkeeping: IBookkeeping) => {
    setCurrentBookkeepingDetail(bookkeeping);
    setOpenModal(true);
  };

  // filter
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleDropdownChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  // filter table data
  const filterData = bookkeepingList.filter((bookkeeping) => {
    const searchItem = bookkeeping.recipient
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const filterByCategory =
      selectedValue === "" || bookkeeping.category_name === selectedValue;
    return searchItem && filterByCategory;
  });

  // export
  const paymentRequestIds = selected.join(",");
  const handleExportBookkeepingList = () => {
    if (selected.length) {
      exportBookkeepingList(workspaceId, paymentRequestIds);
      setSelected([]);
    }
  };
  // importBookkeepingList

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleImportBookkeepingList = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      await importBookkeepingList(workspaceId, formData);
      setLoading(false);
    }
  };
  // hide item
  const handleHideBookkeepingList = async () => {
    if (selected.length) {
      await hideBookkeepingList(workspaceId, paymentRequestIds);
      setVisible(false);
      setLoading(!loading);
      setSelected([]);
    }
  };

  const handleViewHiddenList = () => {
    setSelected([]);
    setPaymentRequest(false);
  };
  const handleBackBtn = () => {
    setPaymentRequest(true);
    setSelected([]);
  };
  // unique category name
  const uniqueCategoryNames = Array.from(
    new Set(bookkeepingList.map((payment) => payment.category_name))
  );

  return (
    <PaymentRequestContainer>
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        component={BookkeepingTransferDetails}
      />
      {bookkeepingList.length === 0 && paymentRequest && (
        <BookkeepingTitle>
          <h3>You don't have any transactions.</h3>
          <p style={{ width: "509px", textAlign: "center" }}>
            Transactions that add tokens to or remove tokens from your Safe will
            show up here.
          </p>
          <HideBtn onClick={handleViewHiddenList}>
            <img src={view} alt="" style={{ width: "20px" }} />
            <span>View hidden</span>
          </HideBtn>
        </BookkeepingTitle>
      )}
      {bookkeepingList.length > 0 && paymentRequest && (
        <Header>
          <TextField
            id="search"
            type="search"
            autoComplete="off"
            placeholder={t("paymentRequest.Search")}
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
          <FormControl sx={{ minWidth: 100 }}>
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
              {uniqueCategoryNames.map(
                (categoryName) =>
                  categoryName.trim() !== "" && (
                    <MenuItem value={categoryName} key={categoryName}>
                      {categoryName}
                    </MenuItem>
                  )
              )}
            </Select>
          </FormControl>
          <ViewReject onClick={() => setPaymentRequest(!paymentRequest)}>
            {paymentRequest && (
              <div onClick={handleViewHiddenList}>
                <Image src={view} alt="" />
                <p>{t("bookkeeping.ViewHidden")}</p>
              </div>
            )}
            {bookkeepingHiddenList.length > 0 && !paymentRequest && (
              <div onClick={handleBackBtn}>
                <Image src={back} alt="" />
                <p>{t("paymentRequest.Back")}</p>
              </div>
            )}
          </ViewReject>
        </Header>
      )}

      {bookkeepingList.length > 0 && paymentRequest && (
        <>
          <PaymentRequestBody>
            <ActionBtn>
              <Btn onClick={() => inputFileRef.current!.click()}>
                <img src={importIcon} alt="" />
                <p>{t("bookkeeping.Import")}</p>
                <input
                  type="file"
                  name=""
                  id=""
                  hidden
                  ref={inputFileRef}
                  onChange={handleImportBookkeepingList}
                />
              </Btn>
              <Btn onClick={handleExportBookkeepingList}>
                <img src={download} alt="" />
                <p>{t("paymentRequest.Download")}</p>
              </Btn>
              <Btn onClick={handleHideBookkeepingList}>
                <img src={hide} alt="" />
                <p>{t("paymentRequest.Hide")}</p>
              </Btn>
            </ActionBtn>
            <TableSection>
              <BookkeepingTable
                selected={selected}
                setSelected={setSelected}
                filterData={filterData}
                handleBookkeepingDetails={handleBookkeepingDetails}
              />

              {/* pagination */}
              {totalItem > 10 && (
                <PaymentPagination>
                  <Pagination
                    handlePageClick={handlePageClick}
                    pageCount={pageCount}
                  />
                </PaymentPagination>
              )}
            </TableSection>
          </PaymentRequestBody>
        </>
      )}
      {!paymentRequest && (
        <BookkeepingRejectSection>
          <BookkeepingRejectTable
            workspaceId={workspaceId}
            paymentRequest={paymentRequest}
            handleBackBtn={handleBackBtn}
            handleBookkeepingDetails={handleBookkeepingDetails}
          />
        </BookkeepingRejectSection>
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
export const BookkeepingTitle = styled.div`
  height: 90vh;
  /* border: 1px solid var(--border); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h3 {
    font-size: 30px;
    font-weight: 500;
  }
  p {
    font-size: 18px;
    padding: 30px 0;
  }
`;
export const HideBtn = styled.button`
  position: absolute;
  top: 0;
  right: 5%;
  top: 20px;
  background: var(--bg-primary);
  outline: none;
  border: none;
  font-size: 20px;
  font-weight: 400;
  padding: 10px 30px;
  border-radius: 4px;
  margin-top: 21px;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  img {
    width: 14px;
  }
`;
