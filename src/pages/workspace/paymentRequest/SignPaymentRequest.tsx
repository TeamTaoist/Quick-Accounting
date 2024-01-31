import React, { useEffect, useState } from "react";
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
import { formatNumber, getShortDisplay } from "../../../utils/number";
import { getShortAddress } from "../../../utils";
import BigNumber from "bignumber.js";

interface SignPaymentRequestProps {
  setOpen: (open: boolean) => void;
  selectedItem: [];
}

const SignPaymentRequest = ({ setOpen, selectedItem, workSpaceId }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { signAndCreateTx } = useSafeStore();
  const { workspace, assetsList, getAssets } = useWorkspace();
  const { paymentRequestList, approvePaymentRequest } = usePaymentsStore();
  const paymentRequestIds = selectedItem.join(",");
  const [totalValue, setTotalValue] = useState("0.00");

  // get selected payments for sign to chain
  const signItems = paymentRequestList.filter((payment) =>
    selectedItem.includes(payment.payment_request_id)
  );

  useEffect(() => {
    if (!assetsList.length) {
      getAssets();
    } 
  }, [assetsList])

  useEffect(() => {
    if (signItems.length && assetsList.length) {
      let _value = BigNumber(0);
      signItems.forEach(item => {
        const token = assetsList.find(a => a.tokenInfo.address === item.currency_contract_address);
        if (token) {
          _value = _value.plus(
            BigNumber(token.fiatConversion).multipliedBy(BigNumber(item.amount))
          );
        }
      });
      setTotalValue(getShortDisplay(_value.toString(), 4));
    }
  }, [assetsList, signItems]);

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
        <p>Transaction value: $ {totalValue}</p>
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
                  <TableCell>{getShortAddress(payment.recipient)}</TableCell>
                  <TableCell>
                    {formatNumber(Number(payment.amount))}{" "}
                    {payment.currency_name}
                  </TableCell>
                  <TableCell>
                    <CategoryCell>{payment.category_name}</CategoryCell>
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
