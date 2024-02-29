import styled from "@emotion/styled";
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
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
import BigNumber from "bignumber.js";
import { getShortDisplay } from "../../utils/number";
import { toast } from "react-toastify";
import { formatEther, formatUnits, zeroAddress } from "viem";
import CHAINS from "../../utils/chain";
import { UpdateEvent } from "../../pages/workspace/paymentRequest/PaymentRequestDetails";

export const isArrayParameter = (parameter: string): boolean =>
  /(\[\d*?])+$/.test(parameter);
export const isAddress = (type: string): boolean =>
  type.indexOf("address") === 0;
export const isByte = (type: string): boolean => type.indexOf("byte") === 0;

// label
const QueueLabelItem = ({ data }: { data: IQueueGroupItemProps }) => {
  return <QueueLabelItemStyle>{data.label}</QueueLabelItemStyle>;
};

const QueueTransactionItem = ({
  transactions,
  handleOpenModal,
  afterExecute,
}: {
  transactions: IQueueTransaction[];
  handleOpenModal: () => void;
  afterExecute: () => void;
}) => {
  const { t } = useTranslation();
  const approveTransaction = transactions[0]!;
  const rejectTransaction = transactions[1];
  const { workspace, assetsList } = useWorkspace();
  const {
    threshold,
    confirmTx,
    executeTx,
    createRejectTx,
    getConfirmedOwners,
    currentNonce,
    getTransactionDetail,
  } = useSafeStore();
  const {
    paymentRquestMap,
    updatePaymentRquestMap,
    setCurrentPaymentRequestDetail,
    createAndApprovePaymentRequest,
  } = usePaymentsStore();
  const payments = paymentRquestMap.get(approveTransaction.safeTxHash);
  const { address } = useAccount();

  const [filterConfirmSigners, setConfirmedList] = useState<string[]>([]);
  const [filterRejectSigners, setRejectedList] = useState<string[]>([]);
  const [totalValue, setTotalValue] = useState("0.00");

  const hasConfirmed = !!filterConfirmSigners.find((s) => s === address);
  const hasRejected = !!filterRejectSigners.find((s) => s === address);

  const canExecuteConfirm =
    (filterConfirmSigners.length ||
      approveTransaction.confirmationsSubmitted) >= threshold;
  const canExecuteReject =
    (filterRejectSigners.length || rejectTransaction?.confirmationsSubmitted) >=
    threshold;

  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const handleRefresh = (e: any) => {
      let isUpdate = false;
      const data = payments?.map((p) => {
        if (p.ID === e.id) {
          isUpdate = true;
          return e.data as IPaymentRequest;
        } else {
          return p;
        }
      });
      if (isUpdate && !!data) {
        updatePaymentRquestMap(approveTransaction.safeTxHash, data);
      }
    };
    document.addEventListener("updatePaymentRequest", handleRefresh);
    return () => {
      document.removeEventListener("updatePaymentRequest", handleRefresh);
    };
  }, [payments]);

  useEffect(() => {
    if (creating) {
      return;
    }
    if (payments && payments.length === 0 && assetsList.length) {
      setCreating(true);
      // create and approve payment requests
      if (approveTransaction.isMultiSend) {
        getTransactionDetail(workspace.chain_id, approveTransaction.id).then(
          (r) => {
            if (r) {
              const data = r.txData?.dataDecoded;
              const addressInfoIndex = r.txData?.addressInfoIndex;
              const rows: TxInfoType[] = [];
              console.error(`======= ${approveTransaction.nonce} =======`);
              if (data) {
                data.parameters?.forEach((param) => {
                  if (param.type === "bytes") {
                    param.valueDecoded?.forEach((v) => {
                      if (v.dataDecoded?.method === "transfer") {
                        // transfer erc20
                        let d: any = {};
                        v.dataDecoded.parameters?.forEach((p) => {
                          if (p.name === "to") {
                            d.recipient = p.value;
                          } else if (p.name === "value") {
                            // check decimals
                            const assets = assetsList.find(
                              (a) => a.tokenInfo.address === v.to
                            );
                            d.decimals = assets?.tokenInfo.decimals || 18;
                            d.currency_contract_address = v.to;
                            d.amount = formatUnits(
                              BigInt(p.value as string),
                              d.decimals
                            );
                            d.currency_name = assets?.tokenInfo?.symbol || "";
                            d.category_properties = "[]";
                          }
                        });
                        rows.push(d);
                      } else if (v.value && v.value !== "0") {
                        // transfer native
                        const chain = CHAINS.find(
                          (c) => c.chainId === workspace.chain_id
                        );
                        rows.push({
                          recipient: v.to,
                          currency_contract_address: zeroAddress,
                          currency_name: chain?.nativeToken?.symbol || "",
                          amount: formatEther(BigInt(v.value)),
                          decimals: chain?.nativeToken?.decimals || 18,
                          category_properties: "[]",
                        });
                      }
                    });
                  }
                });
              }
              console.log("rows", rows);
              if (rows.length) {
                createAndApprovePaymentRequest(
                  workspace.ID,
                  approveTransaction.nonce,
                  rows,
                  approveTransaction.safeTxHash,
                  Math.ceil(approveTransaction.timestamp / 1000)
                ).finally(() => {
                  setCreating(false);
                });
              }
            }
          }
        );
      } else {
        if (approveTransaction.transferInfo)
          createAndApprovePaymentRequest(
            workspace.ID,
            approveTransaction.nonce,
            [{ ...approveTransaction.transferInfo, category_properties: "[]" }],
            approveTransaction.safeTxHash,
            Math.ceil(approveTransaction.timestamp / 1000)
          ).finally(() => {
            setCreating(false);
          });
      }
    }
  }, [payments, assetsList]);

  const handleApprove = async () => {
    const r = await confirmTx(approveTransaction.safeTxHash);
    if (r) {
      getConfirmedOwners(approveTransaction.safeTxHash).then(setConfirmedList);
    }
  };
  const handleExecuteApprove = async () => {
    if (currentNonce && approveTransaction.nonce > currentNonce) {
      toast.error("please execute the previous transaction first");
      return;
    }
    const r = await executeTx(
      workspace.ID,
      approveTransaction.safeTxHash,
      payments || []
    );
    if (r) {
      afterExecute();
    }
  };

  const handleReject = async () => {
    if (rejectTransaction) {
      const r = await confirmTx(rejectTransaction.safeTxHash);
      if (r) {
        getConfirmedOwners(rejectTransaction.safeTxHash).then(setRejectedList);
      }
    } else {
      if (address) {
        const r = await createRejectTx(
          workspace.vault_wallet,
          address,
          approveTransaction.nonce
        );
        if (r) {
          afterExecute();
        }
      }
    }
  };
  const handleExecuteReject = async () => {
    if (currentNonce && rejectTransaction.nonce > currentNonce) {
      toast.error("please execute the previous transaction first");
      return;
    }
    const r = await executeTx(
      workspace.ID,
      rejectTransaction.safeTxHash,
      payments || [],
      true
    );
    if (r) {
      afterExecute();
    }
  };

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

  useEffect(() => {
    if (payments?.length && assetsList.length) {
      let _value = BigNumber(0);
      payments.forEach((item) => {
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
  }, [assetsList, payments]);

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
                Approvals:{" "}
                {filterConfirmSigners.length ||
                  approveTransaction.confirmationsSubmitted ||
                  0}
                /{approveTransaction.confirmationsRequired || threshold}
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
                Rejections:{" "}
                {filterRejectSigners.length ||
                  rejectTransaction?.confirmationsSubmitted ||
                  0}
                /
                {rejectTransaction?.confirmationsRequired ||
                  approveTransaction.confirmationsRequired ||
                  threshold}
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
              // maxHeight: 200,
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
                      {getShortAddress(workspace?.vault_wallet)}
                    </TableCell>
                    <TableCell>
                      {getShortAddress(queueItem.counterparty)}
                    </TableCell>
                    <TableCell>
                      {queueItem.amount} {queueItem.currency_name}
                    </TableCell>
                    <TableCell>
                      <CategoryCell>{queueItem.category_name}</CategoryCell>
                    </TableCell>
                    <TableCell>
                      {formatTime(queueItem.approve_ts * 1000)}
                    </TableCell>
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
        <TotalValue>Total value: ${totalValue}</TotalValue>
      </Accordion>
    </QueueNotice>
  );
};

export default function QueueItem({
  data,
  handleOpenModal,
  afterExecute,
}: {
  data: IQueueGroupItemProps;
  handleOpenModal: () => void;
  afterExecute: () => void;
}) {
  if (data.type === TransactionListItemType.LABEL) {
    return <QueueLabelItem data={data} />;
  } else if (data.type === TransactionListItemType.TRANSACTION) {
    return (
      <QueueTransactionItem
        transactions={data.transactions!}
        handleOpenModal={handleOpenModal}
        afterExecute={afterExecute}
      />
    );
  } else {
    return null;
  }
}

const QueueLabelItemStyle = styled.h1`
  font-size: 20px;
  margin-block: 10px;
  font-weight: 400;
`;

const QueueNotice = styled.div`
  margin-block: 10px;
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
