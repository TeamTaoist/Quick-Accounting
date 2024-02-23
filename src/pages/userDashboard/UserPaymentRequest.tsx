import { TextField, InputAdornment } from "@mui/material";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { useState } from "react";
import searchIcon from "../../assets/workspace/search-icon.svg";
import CustomModal from "../../utils/CustomModal";
import PaymentRequestDetails from "../workspace/paymentRequest/PaymentRequestDetailsReadOnly";
import { useUserPayment } from "../../store/useUserPayment";
import usePaymentsStore from "../../store/usePayments";
import { formatNumber } from "../../utils/number";
import UserPaymentTable from "../../components/userDashboard/UserPaymentTable";

const UserPaymentRequest = () => {
  const { id } = useParams();
  const { userPayment, getUserPayment } = useUserPayment();
  const { setCurrentPaymentRequestDetail } = usePaymentsStore();

  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  // filter table data
  const filterData = userPayment.rows.filter(
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

  return (
    <UserPaymentContainer>
      {/* modal */}
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        component={PaymentRequestDetails}
      />
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
        <UserPaymentTable
          filterData={filterData}
          handleUserPaymentDetails={handleUserPaymentDetails}
        />
      </PaymentLIst>
    </UserPaymentContainer>
  );
};

export default UserPaymentRequest;

const UserPaymentContainer = styled.div`
  padding-inline: 30px;
  margin-top: 47px;
  flex: 1;
`;
const PaymentLIst = styled.div`
  margin-top: 60px;
`;
