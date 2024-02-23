import ReactPaginate from "react-paginate";

interface PaginationProps {
  handlePageClick: (event: any) => void;
  pageCount: number;
}

const Pagination = ({ handlePageClick, pageCount }: PaginationProps) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      pageCount={pageCount}
      previousLabel="<"
      renderOnZeroPageCount={null}
      containerClassName="pagination"
      pageLinkClassName="page-num"
      previousLinkClassName="page-arrow"
      nextLinkClassName="page-arrow"
      activeLinkClassName="active"
      // initialPage={2}
      forcePage={0}
    />
  );
};

export default Pagination;
