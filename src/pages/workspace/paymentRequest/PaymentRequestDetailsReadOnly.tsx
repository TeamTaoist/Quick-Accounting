import WorkspaceItemDetailsLayout from "../../../components/layout/WorkspaceItemDetailsLayout";
import React, { useEffect, useState } from "react";
import {
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import categoryIcon from "../../../assets/workspace/category-icon.svg";
import statusIcon from "../../../assets/workspace/status.svg";
import transferArrow from "../../../assets/workspace/transfer-arrow.svg";
import linkIcon from "../../../assets/workspace/link-icon.svg";

import {
  Image,
  NoteInfo,
  NoteInformation,
} from "../../workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import styled from "@emotion/styled";
import usePaymentsStore from "../../../store/usePayments";
import {
  PAYMENT_REQUEST_STATUS,
  getPaymentStatus,
  getPropertyIconByType,
} from "../../../utils/payment";
import { getShortAddress } from "../../../utils";
import { formatTimestamp } from "../../../utils/time";
import { getChainExplorer } from "../../../utils/chain";

interface PaymentRequestDetailsProps {
  setOpen: (open: boolean) => void;
  currentDetail?: IPaymentRequest;
}
export interface ReactSelectOption {
  value: string;
  label: string;
}

const NotTransferTop = ({
  data: paymentRequestDetails,
}: {
  data: IPaymentRequest;
}) => {
  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell
            sx={{
              width: 200,
              border: 0,
              paddingInline: 0,
              paddingBottom: 1,
            }}
          >
            Recipient
          </TableCell>
          <TableCell
            sx={{ width: 150, border: 0, paddingInline: 0, paddingBottom: 1 }}
          >
            Amount
          </TableCell>
          <TableCell
            sx={{ width: 200, border: 0, paddingInline: 0, paddingBottom: 1 }}
          >
            Currency
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow
          sx={{
            height: "30px",
            borderRadius: "10px",
          }}
        >
          <TableCell
            sx={{
              border: "1px solid var(--border-table)",
              padding: 0,
              paddingLeft: "10px",
            }}
          >
            {getShortAddress(paymentRequestDetails?.recipient)}
          </TableCell>
          <TableCell
            sx={{
              border: "1px solid var(--border-table)",
              borderRadius: "5px",
              padding: 0,
              paddingLeft: "10px",
            }}
          >
            {paymentRequestDetails.amount}
          </TableCell>
          <TableCell
            sx={{
              border: "1px solid var(--border-table)",
              padding: 0,
              paddingLeft: "10px",
            }}
          >
            {paymentRequestDetails?.currency_name}
          </TableCell>
        </TableRow>
        {/* ))} */}
      </TableBody>
    </>
  );
};

const Cell = ({ children }: { children: React.ReactNode }) => (
  <TableCell
    sx={{
      border: "1px solid var(--border-table)",
      borderRadius: "5px",
      padding: 0,
      paddingLeft: "10px",
    }}
  >
    {children}
  </TableCell>
);

const TransferTop = ({
  data: paymentRequestDetails,
}: {
  data: IPaymentRequest;
}) => {
  return (
    <>
      <TableHead sx={{ paddingBottom: 8 }}>
        <TableRow>
          <TableCell sx={{ padding: 0, width: 200, paddingBottom: 1 }}>
            Safe
          </TableCell>
          <TableCell sx={{ padding: 0, width: 150, paddingBottom: 1 }}>
            Counterparty
          </TableCell>
          <TableCell sx={{ padding: 0, width: 150, paddingBottom: 1 }}>
            Amount
          </TableCell>
          <TableCell sx={{ padding: 0, width: 150, paddingBottom: 1 }}>
            Currency
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow
          sx={{
            height: "30px",
            borderRadius: "10px",
          }}
        >
          <TableCell
            sx={{
              border: "1px solid var(--border-table)",
              padding: 0,
              paddingLeft: "10px",
            }}
          >
            <SafeSection>
              <div>{getShortAddress(paymentRequestDetails?.vault_wallet)}</div>
              <div>
                <img src={transferArrow} alt="" />
              </div>
            </SafeSection>
          </TableCell>
          <Cell>{getShortAddress(paymentRequestDetails?.recipient)}</Cell>
          <Cell>{paymentRequestDetails.amount}</Cell>
          <Cell>{paymentRequestDetails?.currency_name}</Cell>
        </TableRow>
        {/* ))} */}
      </TableBody>
    </>
  );
};

const PaymentRequestDetails = ({ setOpen }: PaymentRequestDetailsProps) => {
  const { paymentRequestDetails } = usePaymentsStore();

  const [categoryProperties, setCategoryProperties] = useState<any>([]);

  useEffect(() => {
    if (paymentRequestDetails) {
      try {
        setCategoryProperties(
          JSON.parse(paymentRequestDetails.category_properties)
        );
      } catch (error) {}
    }
  }, [paymentRequestDetails]);

  const isTransfer = ![
    PAYMENT_REQUEST_STATUS.Draft,
    PAYMENT_REQUEST_STATUS.Submitted,
    PAYMENT_REQUEST_STATUS.Rejected,
  ].includes(paymentRequestDetails.status);

  return (
    <>
      <WorkspaceItemDetailsLayout
        title={isTransfer ? "Transfer Details" : "Payment Request Details"}
        setOpen={setOpen}
      >
        <RequestDetails>
          <TableContainer sx={{ paddingInline: "40px", paddingTop: "30px" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              {isTransfer ? (
                <TransferTop data={paymentRequestDetails} />
              ) : (
                <NotTransferTop data={paymentRequestDetails} />
              )}
            </Table>
          </TableContainer>
          {isTransfer && (
            <>
              <TransactionHash>
                <h3>Transaction hash</h3>
                <div>
                  <p>{paymentRequestDetails.tx_hash}</p>
                  <a
                    href={`${getChainExplorer(
                      paymentRequestDetails.workspace_chain_id
                    )}/tx/${paymentRequestDetails.tx_hash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={linkIcon} alt="" />
                  </a>
                </div>
              </TransactionHash>
              <TransactionHash>
                <h3>Transaction date</h3>
                <div>
                  <p>{formatTimestamp(paymentRequestDetails.tx_timestamp)}</p>
                </div>
              </TransactionHash>
            </>
          )}
          {/* note info */}
          <NoteInformation>
            <div className="note">Note Information</div>

            <TableContainer sx={{ borderRadius: "7px" }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                  <TableRow
                    sx={{
                      td: {
                        border: "1px solid var(--border-table)",
                        padding: 1,
                        paddingInline: 1,
                      },
                    }}
                  >
                    <TableCell sx={{ height: 1, width: 200 }}>
                      <NoteInfo>
                        <Image src={categoryIcon} alt="" /> Category
                      </NoteInfo>
                    </TableCell>
                    <TableCell>
                      {paymentRequestDetails?.category_name}
                    </TableCell>
                  </TableRow>
                  {categoryProperties?.map((property: any) => (
                    <TableRow
                      sx={{
                        td: {
                          border: "1px solid var(--border-table)",
                          padding: 1,
                          paddingInline: 1,
                        },
                      }}
                    >
                      <TableCell sx={{ height: 1, width: 200 }}>
                        <NoteInfo>
                          <Image
                            src={getPropertyIconByType(property.type)}
                            alt=""
                          />{" "}
                          {property.name}
                        </NoteInfo>
                      </TableCell>
                      <TableCell>
                        {property.type === "multi-select"
                          ? property?.values
                              .split(";")
                              .map((v: string, idx: number) => (
                                <MultiOption key={idx}>{v}</MultiOption>
                              ))
                          : property.values}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <PaymentStatus>
              <img src={statusIcon} alt="" />
              <p>Status: {getPaymentStatus(paymentRequestDetails?.status)}</p>
            </PaymentStatus>
          </NoteInformation>
        </RequestDetails>
      </WorkspaceItemDetailsLayout>
    </>
  );
};

export default PaymentRequestDetails;

const RequestDetails = styled.div`
  padding-bottom: 50px;
`;
const PaymentStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 20px;
  img {
    width: 20px;
  }
  p {
    font-size: 18px;
  }
`;

const MultiOption = styled.span`
  display: inline-block;
  border-radius: 3px;
  background-color: var(--bg-primary);
  padding: 2px 4px;
  margin-right: 8px;
  min-width: 40px;
  text-align: center;
`;

export const SafeSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  /* height: 100%; */
`;

const TransactionHash = styled.div`
  margin-inline: 40px;
  margin-top: 30px;
  img {
    cursor: pointer;
  }
  h3 {
    font-size: 18px;
    padding-bottom: 8px;
    font-weight: 400;
  }
  div {
    border: 1px solid var(--border-table);
    padding: 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      color: var(--text-secondary);
      font-size: 16px;
    }
    img {
      width: 22px;
    }
  }
`;
