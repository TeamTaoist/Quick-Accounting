import { TextField, InputAdornment } from "@mui/material";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import searchIcon from "../../../assets/workspace/search-icon.svg";
import CustomModal from "../../../utils/CustomModal";
import PaymentRequestDetails from "../../workspace/paymentRequest/PaymentRequestDetailsReadOnly";
import { useUserPayment } from "../../../store/useUserPayment";
import usePaymentsStore from "../../../store/usePayments";
import { formatNumber } from "../../../utils/number";
import UserPaymentTable from "../../../components/userDashboard/UserPaymentTable";
import Pagination from "../../../components/Pagination";
import { useWorkspace } from "../../../store/useWorkspace";
import { useDomainStore } from "../../../store/useDomain";
import SearchInput from "../../../components/workspace/SearchInput";

const UserPaymentRequest = () => {
  const { id } = useParams();
  const { userPaymentRequest, getUserPaymentRequest, userFilterList } =
    useUserPayment();
  const { setCurrentPaymentRequestDetail } = usePaymentsStore();
  const { workspace } = useWorkspace();
  const { queryNameService } = useDomainStore();

  // filter table data
  // const filterData = userPaymentRequest.rows.filter(
  //   (payment) =>
  //     payment.workspace_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     payment.vault_wallet.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // modal
  const [openModal, setOpenModal] = useState(false);

  const handleUserPaymentDetails = (data: IPaymentRequest) => {
    setCurrentPaymentRequestDetail(data);
    setOpenModal(true);
  };

  // pagination
  const [pageNumbers, setPageNumbers] = useState(0);
  const pageSize = userPaymentRequest.size;
  const totalItem = userPaymentRequest.total;

  const pageCount = Math.ceil(totalItem / pageSize);

  const handlePageClick = (event: { selected: number }) => {
    setPageNumbers(event.selected);
  };
  // get user payment request
  useEffect(() => {
    getUserPaymentRequest(pageNumbers);
  }, [getUserPaymentRequest, pageNumbers]);

  useEffect(() => {
    if (userPaymentRequest.rows.length && workspace.chain_id) {
      queryNameService(userPaymentRequest.rows);
    }
  }, [userPaymentRequest, workspace.chain_id]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const handleSearchPayment = async (e: any) => {
    e.preventDefault();
    await getUserPaymentRequest(pageNumbers, 10, searchTerm);
    setIsSearch(true);
  };
  useEffect(() => {
    const fetchPaymentList = async () => {
      if (!searchTerm && isSearch) {
        await getUserPaymentRequest(pageNumbers, 10, searchTerm);
        setIsSearch(true);
      }
    };
    fetchPaymentList();
  }, [searchTerm]);

  return (
    <UserPaymentContainer>
      {/* modal */}
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        component={PaymentRequestDetails}
      />
      {userPaymentRequest.rows.length === 0 ? (
        <Details>
          <h2>You don't have any payment requests.</h2>
        </Details>
      ) : (
        <PaymentTable>
          {/* <TextField
            id="search"
            type="search"
            size="small"
            autoComplete="off"
            placeholder="Search workspace / recipient / token"
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
          /> */}
          <SearchInput
            handleSearchPayment={handleSearchPayment}
            placeholder="Search workspace / recipient / token"
            searchTerm={searchTerm}
            handleChange={handleChange}
            width="350px"
          />
          <PaymentLIst>
            <UserPaymentTable
              filterData={userFilterList}
              handleUserPaymentDetails={handleUserPaymentDetails}
            />
          </PaymentLIst>
          {totalItem >= 10 && (
            <Pagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
              pageNumbers={pageNumbers}
            />
          )}
        </PaymentTable>
      )}
    </UserPaymentContainer>
  );
};

export default UserPaymentRequest;

const UserPaymentContainer = styled.div`
  padding: 30px;
  flex: 1;
`;
const PaymentLIst = styled.div`
  margin-top: 20px;
`;
export const Details = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 500px;
  height: 80vh;
  h2 {
    font-size: 24px;
    font-weight: 600;
    text-align: center;
  }
`;
export const PaymentTable = styled.div`
  flex: 1;
`;
export const PaymentPagination = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 0px;
`;
