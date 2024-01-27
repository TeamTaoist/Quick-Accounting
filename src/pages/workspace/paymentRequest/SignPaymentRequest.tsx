import React from "react";
import Header from "../../../components/layout/header/Header";
import WorkspaceItemDetailsLayout from "../../../components/layout/WorkspaceItemDetailsLayout";
import styled from "@emotion/styled";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import data from "../../../data/tableData";
import usePaymentsStore from "../../../store/usePayments";
import { useNavigate, useParams } from "react-router-dom";
import { useSafeStore } from "../../../store/useSafeStore";
import { useAccount } from "wagmi";
import { useWorkspace } from "../../../store/useWorkspace";

interface SignPaymentRequestProps {
  setOpen: (open: boolean) => void;
  selectedItem: [];
}

const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};

const SignPaymentRequest = ({ setOpen, selectedItem, workSpaceId }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { signAndCreateTx } = useSafeStore();
  const { workspace } = useWorkspace();
  const { paymentRequestList, approvePaymentRequest } = usePaymentsStore();
  const paymentRequestIds = selectedItem.join(",");
 
  // get selected payments for sign to chain
  const signItems = paymentRequestList.filter((payment) =>
    selectedItem.includes(payment.payment_request_id)
  );

  const totalTransactionValue = signItems.reduce(
    (acc, value) => acc + parseFloat(value.amount),
    0
  );
  // approve payment request
  const handleApproveRequest = async () => {
    if (address) {
      const safeTxHash = await signAndCreateTx(
        address,
        workspace.vault_wallet,
        signItems
      );
      safeTxHash &&
        approvePaymentRequest(id, paymentRequestIds, navigate, safeTxHash);
    }
  };

  return (
    // <Header>
    <WorkspaceItemDetailsLayout
      title="Sign payment request on chain"
      subtitle="Included actions will be grouped into a single transaction."
      setOpen={setOpen}
    >
      <PaymentRequestChain>
        <p>Transaction value: ${totalTransactionValue}</p>
        {/* table */}
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 200, width: "100%" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Recipient</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {signItems.map((payment) => (
                <TableRow key={payment.ID}>
                  <TableCell>{recipientFormate(payment.recipient)}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>
                    <CategoryCell>{payment.currency_name}</CategoryCell>
                  </TableCell>
                  <TableCell>{payment.CreatedAt.slice(0, 10)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <SignToChain onClick={handleApproveRequest}>Sign</SignToChain>
      </PaymentRequestChain>
    </WorkspaceItemDetailsLayout>
    // </Header>
  );
};

export default SignPaymentRequest;

const PaymentRequestChain = styled.div`
  padding: 30px 20px;
  p {
    font-size: 20px;
    margin-bottom: 30px;
  }
`;
export const SignToChain = styled.button`
  background: var(--bg-primary);
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 400;
  padding: 10px 0;
  width: 100%;
  border-radius: 4px;
  margin-top: 21px;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  img {
    width: 10px;
  }
`;
const CategoryCell = styled.div`
  background: var(--bg-primary);
  padding: 4px 10px;
  text-align: center;
  border-radius: 4px;
`;
