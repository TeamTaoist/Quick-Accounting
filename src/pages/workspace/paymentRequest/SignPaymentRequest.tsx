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
import { useDomainStore } from "../../../store/useDomain";
import { Cell, HeaderCell } from "../../../components/table";

const HeaderStyles = {
  padding: "10px 15px",
  fontFamily: "Inter",
  fontSize: "16px",
  fontWeight: "500",
  color: "#0F172A",
  backgroundColor: "var(--clr-gray-200)",
  height: "50px",
};
interface SignPaymentRequestProps {
  setOpen: (open: boolean) => void;
  selectedItem: [];
}

const SignPaymentRequest = ({ setOpen, selectedItem, workSpaceId }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { signAndCreateTx } = useSafeStore();
  const { workspace, assetsList, getAssets, userWorkspaces } = useWorkspace();
  const { paymentRequestList, approvePaymentRequest } = usePaymentsStore();
  const paymentRequestIds = selectedItem.join(",");
  const [totalValue, setTotalValue] = useState("0.00");

  const { formatAddressToDomain } = useDomainStore();

  // get selected payments for sign to chain
  const signItems = paymentRequestList.filter((payment) =>
    selectedItem.includes(payment.payment_request_id)
  );

  useEffect(() => {
    if (!assetsList.length && !!workspace.chain_id) {
      getAssets();
    }
  }, [assetsList, workspace.chain_id]);

  useEffect(() => {
    if (signItems.length && assetsList.length) {
      let _value = BigNumber(0);
      signItems.forEach((item) => {
        const token = assetsList.find(
          (a) => a.tokenInfo.address === item.currency_contract_address
        );
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
  const [selectedWorkspaceName, setSelectedWorkspaceName] =
    useState<string>("");
  const [selectedWorkspaceAvatar, setSelectedWorkspaceAvatar] =
    useState<string>("");
  const [selectedWorkspaceSafeAddress, setSelectedWorkspaceSafeAddress] =
    useState<string>("");
  const selectedWorkspace = userWorkspaces.data.rows.find(
    (workspace) => workspace.ID === signItems[0].workspace_id
  );
  useEffect(() => {
    if (selectedWorkspace) {
      setSelectedWorkspaceName(selectedWorkspace?.name);
      setSelectedWorkspaceAvatar(selectedWorkspace?.avatar);
      setSelectedWorkspaceSafeAddress(selectedWorkspace.vault_wallet);
    }
  }, []);
  console.log(signItems);
  console.log(signItems[0].workspace_name);

  return (
    // <Header>
    <WorkspaceItemDetailsLayout
      title="Sign payment request on chain"
      // subtitle="Included actions will be grouped into a single transaction."
      setOpen={setOpen}
      workspaceName={selectedWorkspaceName}
      workspaceAvatar={selectedWorkspaceAvatar}
      address={selectedWorkspaceSafeAddress}
    >
      <PaymentRequestChain>
        {/* <p>Transaction value: $ {totalValue}</p> */}
        {/* table */}
        <TableContainer
          sx={{
            border: "1px solid var(--clr-gray-200)",
            borderRadius: "6px",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            scrollbarWidth: "none",
            // fontFamily: "Inter",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <HeaderCell width="160px">Recipient</HeaderCell>
                <HeaderCell width="200px">Amount</HeaderCell>
                <HeaderCell width="180px">Category</HeaderCell>
                <HeaderCell width="180px">Date</HeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {signItems.map((payment) => (
                <TableRow key={payment.ID}>
                  <Cell>
                    {formatAddressToDomain(
                      payment.counterparty,
                      workspace.chain_id,
                      workspace.name_service === "sns"
                    )}
                  </Cell>
                  <Cell>
                    {formatNumber(Number(payment.amount))}{" "}
                    {payment.currency_name}
                  </Cell>
                  <Cell>
                    <CategoryCell>{payment.category_name}</CategoryCell>
                  </Cell>
                  <Cell>{payment.CreatedAt.slice(0, 10)}</Cell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TotalValue>Total value: ${totalValue}</TotalValue>
        </TableContainer>
        <SignToChain onClick={handleApproveRequest}>Approve</SignToChain>
      </PaymentRequestChain>
    </WorkspaceItemDetailsLayout>
    // </Header>
  );
};

export default SignPaymentRequest;

const PaymentRequestChain = styled.div`
  padding: 30px 40px;
  p {
    font-size: 20px;
    margin-bottom: 30px;
  }
`;
const TotalValue = styled.button`
  font-family: "Inter";
  height: 100%;
  width: 100%;
  background: var(--clr-gray-100);
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 700;
  padding: 16px 0;
  width: 100%;
  border-radius: 0 0 6px 6px;
  cursor: pointer;
  /* color: var(--text-primary); */
  /* gap: 10px;*/
  img {
    width: 10px;
  }
`;
export const SignToChain = styled.button`
  background: var(--clr-primary-900);
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 400;
  padding: 10px 0;
  width: 100%;
  border-radius: 4px;
  margin-top: 21px;
  cursor: pointer;
  color: var(--clr-white);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  img {
    width: 10px;
  }
`;
const CategoryCell = styled.div`
  background: var(--clr-gray-100);
  padding: 2px 10px;
  height: 40px;
  display: block;
  font-size: 14px;
  display: grid;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;
