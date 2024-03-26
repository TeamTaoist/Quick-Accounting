import styled from "@emotion/styled";
import { css } from "@emotion/react";
import React, { useEffect, useRef, useState } from "react";
import download from "../../../assets/workspace/download-icon.svg";
import view from "../../../assets/workspace/view.svg";
import importIcon from "../../../assets/workspace/archive.svg";
import hide from "../../../assets/workspace/hide.svg";

import { useParams } from "react-router-dom";
import {
  ActionBtn,
  BookkeepingRejectSection,
  Btn,
  Filter,
  Header,
  Image,
  PaymentPagination,
  PaymentRequestBody,
  PaymentRequestContainer,
  TableSection,
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
import { useDomainStore } from "../../../store/useDomain";
import { useWorkspace } from "../../../store/useWorkspace";
import SearchInput from "../../../components/workspace/SearchInput";
import FilterCategorySelect from "../../../components/workspace/FilterCategorySelect";

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
    bookkeepingFilterList,
  } = useBookkeeping();
  const { getWorkspaceCategoryProperties } = useCategoryProperty();
  const { queryNameService } = useDomainStore();
  const { workspace } = useWorkspace();

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

  const handleBookkeepingDetails = (bookkeeping: IPaymentRequest) => {
    setCurrentBookkeepingDetail(bookkeeping);
    setOpenModal(true);
  };

  // filter
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [isSearch, setIsSearch] = useState(false);

  const handleDropdownChange = (event: any) => {
    setSelectedValue(event.target.value);
  };
  const handleSearchPayment = (e: any) => {
    e.preventDefault();
    getBookkeepingList(workspaceId, false, pageNumbers, 10, searchTerm).then(
      (res) => {
        if (res) {
          setTotalItem(res);
          setIsSearch(true);
        }
      }
    );
  };
  useEffect(() => {
    if (!searchTerm && isSearch) {
      getBookkeepingList(workspaceId, false, pageNumbers, 10, searchTerm).then(
        (res) => {
          if (res) {
            setTotalItem(res);
            setIsSearch(false);
          }
        }
      );
    }
  }, [searchTerm]);
  // filter table data
  // const filterData = bookkeepingList.filter((bookkeeping) => {
  //   const searchItem = bookkeeping.counterparty
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase());
  //   const filterByCategory =
  //     selectedValue === "" || bookkeeping.category_name === selectedValue;
  //   return searchItem && filterByCategory;
  // });

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

  useEffect(() => {
    if (bookkeepingList.length && workspace.chain_id) {
      queryNameService(
        bookkeepingList,
        workspace.name_service === "sns",
        workspace.chain_id
      );
    }
  }, [bookkeepingList, workspace, queryNameService]);

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
            <span>View failed</span>
          </HideBtn>
        </BookkeepingTitle>
      )}
      {/* {bookkeepingList.length > 0 && paymentRequest && (
        
      )} */}

      {bookkeepingList.length > 0 && paymentRequest && (
        <>
          <PaymentRequestBody>
            <Header>
              <Filter>
                <SearchInput
                  handleSearchPayment={handleSearchPayment}
                  placeholder="Search token"
                  searchTerm={searchTerm}
                  handleChange={handleChange}
                  width="220px"
                />
                <FilterCategorySelect
                  selectedValue={selectedValue}
                  handleDropdownChange={handleDropdownChange}
                  uniqueCategoryNames={uniqueCategoryNames}
                />
              </Filter>
              <BookkeepingAction>
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
                {/* <ViewReject onClick={() => setPaymentRequest(!paymentRequest)}>
                  {paymentRequest && (
                    <div onClick={handleViewHiddenList}>
                      <Image src={view} alt="" />
                      <p>{t("bookkeeping.ViewHidden")}</p>
                    </div>
                  )} */}
                {/* {bookkeepingHiddenList.length > 0 && !paymentRequest && (
                    <div onClick={handleBackBtn}>
                      <Image src={back} alt="" />
                      <p>{t("paymentRequest.Back")}</p>
                    </div>
                  )} */}
                {/* </ViewReject> */}
                {paymentRequest && (
                  <ViewHidden onClick={handleViewHiddenList}>
                    <Image src={view} alt="" />
                    <p>{t("bookkeeping.ViewHidden")}</p>
                  </ViewHidden>
                )}
              </BookkeepingAction>
            </Header>
            <TableSection>
              <BookkeepingTable
                selected={selected}
                setSelected={setSelected}
                filterData={bookkeepingFilterList}
                handleBookkeepingDetails={handleBookkeepingDetails}
              />

              {/* pagination */}
              {totalItem > 10 && (
                <Pagination
                  handlePageClick={handlePageClick}
                  pageCount={pageCount}
                  pageNumbers={pageNumbers}
                />
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

const LeftDirStyle = css`
  transform: rotate(180deg);
`;

export const Logo = styled.div<{ $dir?: string }>`
  img {
    width: 20px;
    ${({ $dir }) => $dir === "i" && LeftDirStyle}
  }
`;
export const BookkeepingTitle = styled.div`
  height: 60vh;
  /* border: 1px solid var(--border); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h3 {
    font-size: 24px;
    font-weight: 600;
  }
  p {
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 20px;
    line-height: 20px;
    width: 460px;
  }
`;
export const HideBtn = styled.button<any>`
  background: ${(props) => props.bg || "transparent"};
  outline: none;
  border: 1px solid var(--clr-gray-300);
  padding: 12px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: ${(props) => props.clr || "#0f172a"};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  img {
    width: 14px;
  }
`;
export const BookkeepingAction = styled.div`
  display: flex;
  align-items: center;
`;
const ViewHidden = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  align-items: center;
  gap: 10px;
  background: var(--clr-gray-50);
  padding: 12px 14px;
  border-radius: 6px;
  width: 100%;
  margin-left: 20px;
  /* min-width: 165px; */
  p {
    font-size: 14px;
    font-weight: 500;
    display: block;
  }
`;
