import styled from "@emotion/styled";
import { useState } from "react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  handlePageClick: (event: any) => void;
  pageCount: number;
  pageNumbers?: number;
}

const Pagination = ({
  handlePageClick,
  pageCount,
  pageNumbers,
}: PaginationProps) => {
  const [selectedPage, setSelectedPage] = useState(0);
  const [page, setPage] = useState("");
  const handleInput = (e: any) => {
    const value = e.target.value;
    if (value > pageCount) {
      setPage("");
    } else {
      setPage(e.target.value);
    }
  };
  const handlePage = (e: any) => {
    e.preventDefault();
    // const test = Number(page) - 1;
    let inputPageNumber = Number(page);
    if (page === "") {
      inputPageNumber = 0;
    } else {
      inputPageNumber = Number(page) - 1;
    }
    setSelectedPage(inputPageNumber);
    handlePageClick({ selected: inputPageNumber });
  };

  return (
    <PaymentPagination>
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={4}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName={pageNumbers === 0 ? "disabled" : "prv-arrow"}
        nextLinkClassName={
          pageCount - 1 === pageNumbers ? "disabled" : "next-arrow"
        }
        activeLinkClassName="active"
        // initialPage={pageNumber}
        forcePage={selectedPage}
      />
      <p>跳至第</p>
      <form onSubmit={handlePage}>
        <input type="text" value={page} onChange={handleInput} />
      </form>
      <p>页</p>
    </PaymentPagination>
  );
};

export default Pagination;

export const PaymentPagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 26px 0px;
  p {
    font-size: 14px;
  }
  input {
    width: 56px;
    height: 28px;
    border: 1px solid var(--clr-gray-300);
    border-radius: 6px;
    text-align: center;
    outline: none;
  }
  /* pagination */
  .pagination {
    display: flex;
    justify-content: start;
    gap: 8px;
  }

  .page-num {
    padding: 4px 12px;
    cursor: pointer;
    border-radius: 4px;
    font-weight: 400;
  }

  .page-num:hover {
    background-color: var(--clr-primary-900);
    color: #fff;
  }

  .pagination .active {
    background-color: var(--clr-primary-900);
    color: #fff;
  }

  .prv-arrow {
    padding: 4px 12px;
    cursor: pointer;
    border-radius: 4px;
    color: var(--clr-primary-900);
  }
  .next-arrow {
    padding: 4px 12px;
    cursor: pointer;
    border-radius: 4px;
    color: var(--clr-primary-900);
  }
  .disabled {
    color: #cbd5e1;
    padding-inline: 8px;
  }
`;
