import { TextField, InputAdornment } from "@mui/material";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import searchIcon from "../../assets/workspace/search-icon.svg";
import CustomModal from "../../utils/CustomModal";
import PaymentRequestDetails from "../workspace/paymentRequest/PaymentRequestDetailsReadOnly";
import { useUserPayment } from "../../store/useUserPayment";
import usePaymentsStore from "../../store/usePayments";
import { formatNumber } from "../../utils/number";
import MyPaymentTable from "../../components/userDashboard/MyPaymentTable";
import Pagination from "../../components/Pagination";

const MyPayment = () => {
  const { id } = useParams();
  const { myPayment, getMyPayment } = useUserPayment();
  const { setCurrentPaymentRequestDetail } = usePaymentsStore();

  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  // filter table data
  const filterData = myPayment.rows.filter(
    (payment) =>
      payment.workspace_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.vault_wallet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // modal
  const [openModal, setOpenModal] = useState(false);

  const handleUserPaymentDetails = (data: IPaymentRequest) => {
    setCurrentPaymentRequestDetail(data);
    setOpenModal(true);
  };

  // pagination
  const [pageNumbers, setPageNumbers] = useState(0);
  const pageSize = myPayment.size;
  const totalItem = myPayment.total;

  const pageCount = Math.ceil(totalItem / pageSize);

  const handlePageClick = (event: any) => {
    setPageNumbers(event.selected);
  };
  // get user payment request
  useEffect(() => {
    getMyPayment(pageNumbers);
  }, [getMyPayment, pageNumbers]);

  return (
    <UserPaymentContainer>
      {/* modal */}
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        component={PaymentRequestDetails}
      />
      {myPayment.rows.length === 0 ? (
        <Details>
          <h2>
            You don't have any payment <br /> request
          </h2>
        </Details>
      ) : (
        <PaymentTable>
          <TextField
            id="search"
            type="search"
            autoComplete="off"
            placeholder="Search workspace name"
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
          <PaymentLIst>
            <MyPaymentTable
              filterData={filterData}
              handleUserPaymentDetails={handleUserPaymentDetails}
            />
          </PaymentLIst>
          {totalItem >= 10 && (
            <PaymentPagination>
              <Pagination
                handlePageClick={handlePageClick}
                pageCount={pageCount}
              />
            </PaymentPagination>
          )}
        </PaymentTable>
      )}
    </UserPaymentContainer>
  );
};

export default MyPayment;

const UserPaymentContainer = styled.div`
  padding-inline: 30px;
  margin-top: 47px;
  flex: 1;
`;
const PaymentLIst = styled.div`
  margin-top: 60px;
`;
export const Details = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 500px;
  height: 90vh;
  h2 {
    font-size: 30px;
    font-weight: 500;
    text-align: center;
  }
`;
export const PaymentTable = styled.div`
  flex: 1;
`;
export const PaymentPagination = styled.div`
  /* display: flex; */
  padding: 20px 30px;
`;
