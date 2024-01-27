import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import {
  TransactionListItemType,
  ConflictType,
} from "@safe-global/safe-gateway-typescript-sdk";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Trans, useTranslation } from "react-i18next";
import { formatTime } from "../../utils/time";
import { useSafeStore } from "../../store/useSafeStore";
import { getShortAddress } from "../../utils";
import { useAccount } from "wagmi";
import usePaymentsStore from "../../store/usePayments";
import { useWorkspace } from "../../store/useWorkspace";

// label
const QueueLabelItem = ({ data }: { data: IQueueGroupItemProps }) => {
  return <QueueLabelItemStyle>{data.label}</QueueLabelItemStyle>;
};

const QueueTransactionItem = ({
  transactions,
  handleOpenModal,
}: {
  transactions: IQueueTransaction[];
  handleOpenModal: () => void;
}) => {
  const { t } = useTranslation();
  const approveTransaction = transactions[0]!;
  const rejectTransaction = transactions[1];
  const { workspace } = useWorkspace();
  const { owners, threshold, confirmTx, executeTx, getConfirmedOwners } =
    useSafeStore();
  const { paymentRquestMap, setCurrentPaymentRequestDetail } =
    usePaymentsStore();
  const payments = paymentRquestMap.get(approveTransaction.safeTxHash) || [];
  const { address } = useAccount();

  const [filterConfirmSigners, setConfirmedList] = useState<string[]>([]);
  const [filterRejectSigners, setRejectedList] = useState<string[]>([]);

  const hasConfirmed = !!filterConfirmSigners.find((s) => s === address);
  const hasRejected = !!filterRejectSigners.find((s) => s === address);

  const canExecuteConfirm =
    approveTransaction.confirmationsSubmitted >= threshold;
  const canExecuteReject =
    rejectTransaction?.confirmationsSubmitted >= owners.length - threshold + 1;

  const handleApprove = () => {
    confirmTx(approveTransaction.safeTxHash);
    //   TODO update ui
  };
  const handleExecuteApprove = () => {
    address &&
      executeTx(
        workspace.ID,
        address,
        approveTransaction.safeTxHash,
        approveTransaction.nonce,
        payments
      );
  };

  const handleReject = () => {
    rejectTransaction && confirmTx(rejectTransaction.safeTxHash);
    //   TODO update ui
  };
  const handleExecuteReject = () => {};

  const onOpenMoreModal = (item: IPaymentRequest) => {
    setCurrentPaymentRequestDetail(item);
    handleOpenModal();
  };

  useEffect(() => {
    if (
      approveTransaction.safeTxHash &&
      approveTransaction.confirmationsSubmitted
    ) {
      getConfirmedOwners(approveTransaction.safeTxHash).then(setConfirmedList);
    }
    if (
      rejectTransaction?.safeTxHash &&
      rejectTransaction?.confirmationsSubmitted
    ) {
      getConfirmedOwners(rejectTransaction.safeTxHash).then(setRejectedList);
    }
  }, [approveTransaction, rejectTransaction]);

  return (
    <QueueNotice>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ backgroundColor: "var(--hover-bg)" }}
        >
          <Header>
            <HeaderTitle>
              <h6>
                {t("queue.Nonce")}: {approveTransaction.nonce}
              </h6>
              <p>{formatTime(approveTransaction.timestamp)}</p>
            </HeaderTitle>
            <h5>
              {approveTransaction.actionCount || 1} {t("queue.Action")}
            </h5>
          </Header>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          {/* category property */}
          <Action>
            <Approvals>
              <h4>
                Approvals: {approveTransaction.confirmationsSubmitted || 0}/
                {approveTransaction.confirmationsRequired || threshold}
              </h4>
              {filterConfirmSigners?.map((owner) => (
                <p key={owner}>{getShortAddress(owner)}</p>
              ))}

              <button disabled={hasConfirmed} onClick={handleApprove}>
                {t("queue.Approve")}
              </button>
              <button
                disabled={!canExecuteConfirm}
                onClick={handleExecuteApprove}
              >
                {t("queue.Execute")}
              </button>
            </Approvals>
            <Approvals>
              <h4>
                Rejections: {rejectTransaction?.confirmationsSubmitted || 0}/
                {rejectTransaction?.confirmationsRequired ||
                  owners.length - threshold + 1}
              </h4>
              {filterRejectSigners?.map((owner) => (
                <p key={owner}>{getShortAddress(owner)}</p>
              ))}
              <button disabled={hasRejected} onClick={handleReject}>
                Reject
              </button>
              <button
                disabled={!canExecuteReject}
                onClick={handleExecuteReject}
              >
                Execute
              </button>
            </Approvals>
          </Action>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 200,
              minWidth: 800,
              boxShadow: "none",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Safe</TableCell>
                  <TableCell>Counterparty</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(payments || []).map((queueItem: IPaymentRequest) => (
                  <TableRow key={queueItem.ID}>
                    <TableCell>
                      {getShortAddress(queueItem.recipient)}
                    </TableCell>
                    <TableCell>
                      {getShortAddress(queueItem.recipient)}
                    </TableCell>
                    <TableCell>
                      {queueItem.amount} {queueItem.currency_name}
                    </TableCell>
                    <TableCell>
                      <CategoryCell>{queueItem.category_name}</CategoryCell>
                    </TableCell>
                    <TableCell>{queueItem.CreatedAt.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "black",
                          color: "black",
                          textTransform: "lowercase",
                        }}
                        onClick={() => onOpenMoreModal(queueItem)}
                      >
                        view more
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </QueueNotice>
  );
};

export default function QueueItem({
  data,
  handleOpenModal,
}: {
  data: IQueueGroupItemProps;
  handleOpenModal: () => void;
}) {
  if (data.type === TransactionListItemType.LABEL) {
    return <QueueLabelItem data={data} />;
  } else if (data.type === TransactionListItemType.TRANSACTION) {
    return (
      <QueueTransactionItem
        transactions={data.transactions!}
        handleOpenModal={handleOpenModal}
      />
    );
  } else {
    return null;
  }
}

const QueueLabelItemStyle = styled.h1`
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: 400;
`;

const QueueNotice = styled.div`
  margin-top: 30px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h5 {
    margin-right: 20px;
    font-size: 20px;
    font-weight: 400;
  }
  /* {
    width: 24px;
  } */
`;
const HeaderTitle = styled.div`
  h6 {
    font-size: 20px;
    font-weight: 400;
  }
  p {
    font-size: 12px;
    color: var(--text-secondary);
  }
`;

const Action = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 16px 0;
`;
const Approvals = styled.div`
  h4 {
    font-size: 20px;
    font-weight: 400;
  }
  p {
    font-size: 12px;
    color: #7c7777;
    padding-top: 5px;
  }
  button {
    border: 1px solid var(--border);
    background: transparent;
    outline: none;
    padding: 6px 12px;
    border-radius: 7px;
    font-size: 18px;
    margin-right: 10px;
    margin-top: 12px;
    cursor: pointer;
  }
  button[disabled]:hover {
    cursor: not-allowed;
  }
`;
const TotalValue = styled.div`
  padding: 10px 0;
  text-align: center;
  background: var(--bg-primary);
  overflow: hidden;
  /* margin-top: 20px; */
`;
const CategoryCell = styled.div`
  background: var(--bg-primary);
  padding: 4px 10px;
  text-align: center;
  border-radius: 4px;
`;
