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

const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};

const SignPaymentRequest = ({ setOpen }: any) => {
  return (
    // <Header>
    <WorkspaceItemDetailsLayout
      title="Sign payment request on chain"
      subtitle="Included actions will be grouped into a single transaction."
      setOpen={setOpen}
    >
      <PaymentRequestChain>
        <p>Transaction value：$21.99</p>
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
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{recipientFormate(row.recipient)}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>
                    <CategoryCell>{row.category}</CategoryCell>
                  </TableCell>
                  <TableCell>{row.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <SignToChain>Sign</SignToChain>
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
