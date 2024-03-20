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
  Tooltip,
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
import { useDomainStore } from "../../store/useDomain";
import details from "../../assets/details.svg";

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
  const { formatAddressToDomain } = useDomainStore();

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
                  approveTransaction.timestamp
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
            approveTransaction.timestamp
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
          sx={{
            backgroundColor: "var(--clr-gray-200)",
            border: "1px solid var(--clr-gray-200)",
            height: "75px",
            fontFamily: "Inter",
            "&:before": {
              borderRadius: "6px",
            },
            borderBottom: "none",
            paddingInline: "24px",
            minWidth: "900px",
          }}
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
        <AccordionDetails sx={{ p: "24px" }}>
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
              <Owners>
                {filterConfirmSigners?.map((owner) => (
                  // <p key={owner}>{getShortAddress(owner)}</p>
                  <p key={owner}>{owner}</p>
                ))}
              </Owners>

              <ActionButtons>
                <ApproveBtn disabled={hasConfirmed} onClick={handleApprove}>
                  {t("queue.Approve")}
                </ApproveBtn>
                <ExecuteBtn
                  disabled={!canExecuteConfirm}
                  onClick={handleExecuteApprove}
                >
                  {t("queue.Execute")}
                </ExecuteBtn>
              </ActionButtons>
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
              <ExecuteBtn disabled={hasRejected} onClick={handleReject}>
                Reject
              </ExecuteBtn>
              <ApproveBtn
                disabled={!canExecuteReject}
                onClick={handleExecuteReject}
              >
                Execute
              </ApproveBtn>
            </Approvals>
          </Action>
          <TableContainer
            sx={{
              minWidth: 800,
              boxShadow: "none",
              border: "1px solid var(--clr-gray-200)",
              borderRadius: "6px",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: "var(--clr-gray-200)",
                      width: "15%",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Safe
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "var(--clr-gray-200)",
                      width: "15%",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Counterparty
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "var(--clr-gray-200)",
                      width: "15%",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "var(--clr-gray-200)",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Category
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "var(--clr-gray-200)",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "var(--clr-gray-200)",
                    }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(payments || []).map((queueItem: IPaymentRequest) => (
                  <TableRow key={queueItem.ID}>
                    <TableCell sx={{ padding: "8px 14px" }}>
                      {getShortAddress(workspace?.vault_wallet)}
                    </TableCell>
                    <TableCell sx={{ padding: "8px 14px" }}>
                      {formatAddressToDomain(
                        queueItem.counterparty,
                        workspace.chain_id,
                        workspace.name_service === "sns"
                      )}
                    </TableCell>
                    <TableCell sx={{ padding: "8px 14px" }}>
                      {queueItem.amount} {queueItem.currency_name}
                    </TableCell>
                    <TableCell sx={{ padding: "8px 14px" }}>
                      <CategoryCell>{queueItem.category_name}</CategoryCell>
                    </TableCell>
                    <TableCell sx={{ padding: "8px 14px" }}>
                      {formatTime(
                        queueItem.approve_ts || approveTransaction.timestamp,
                        "-",
                        false
                      )}
                    </TableCell>
                    <TableCell sx={{ padding: "8px 14px" }}>
                      <Tooltip
                        title="View details"
                        placement="top"
                        componentsProps={{
                          tooltip: {
                            sx: {
                              background: "var(--clr-white)",
                              color: "#111",
                              border: "1px solid var(--clr-gray-200)",
                              padding: "8px 16px",
                              fontSize: "12px",
                            },
                          },
                        }}
                      >
                        <img
                          src={details}
                          alt=""
                          style={{ width: "16px" }}
                          onClick={() => onOpenMoreModal(queueItem)}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TotalValue>Total value: ${totalValue}</TotalValue>
          </TableContainer>
        </AccordionDetails>
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
    font-size: 16px;
    font-weight: 500;
  }
  /* {
    width: 24px;
  } */
`;
const HeaderTitle = styled.div`
  h6 {
    font-size: 16px;
    font-weight: 400;
    padding-bottom: 7px;
  }
  p {
    font-size: 12px;
    color: var(--clr-gray-500);
  }
`;

const Action = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  gap: 40px;
`;
const Approvals = styled.div`
  width: 50%;
  h4 {
    font-size: 14px;
    font-weight: 500;
  }
`;
const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 8px;
`;
const ExecuteBtn = styled.button`
  border: none;
  background: var(--clr-primary-900);
  color: #fff;
  outline: none;
  padding: 8px 14px;
  border-radius: 7px;
  font-size: 14px;
  margin-right: 10px;
  margin-top: 12px;
  cursor: pointer;
  &:disabled {
    background: #cbd5e1;
  }
  &:disabled:hover {
    cursor: not-allowed;
  }
`;
const ApproveBtn = styled.button`
  border: 1px solid var(--clr-gray-200);
  background: transparent;
  outline: none;
  padding: 8px 14px;
  border-radius: 7px;
  font-size: 14px;
  margin-right: 10px;
  margin-top: 12px;
  cursor: pointer;
  &:disabled:hover {
    cursor: not-allowed;
  }
`;
const Owners = styled.div`
  border: 1px solid var(--clr-gray-200);
  border-radius: 6px;
  padding: 16px 14px;
  width: 100%;
  height: 68px;
  margin-top: 10px;
  p {
    font-size: 12px;
    color: var(--clr-gray-500);
  }
`;
const TotalValue = styled.div`
  padding: 12px 0;
  text-align: center;
  background: var(--clr-gray-100);
  overflow: hidden;
  font-size: 16px;
  font-weight: 700;
  /* margin-top: 20px; */
`;
const CategoryCell = styled.div`
  background: var(--clr-gray-200);
  padding: 6px;
  font-size: 14px;
  text-align: center;
  border-radius: 5px;
`;
