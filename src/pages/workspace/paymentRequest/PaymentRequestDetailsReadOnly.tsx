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
import { css } from "@emotion/react";

import categoryIcon from "../../../assets/workspace/category-icon.svg";
import statusIcon from "../../../assets/workspace/status.svg";
import transferArrow from "../../../assets/workspace/transfer-arrow.svg";
import linkIcon from "../../../assets/workspace/link-icon.svg";

import {
  Image,
  NoteHeader,
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
import { useWorkspace } from "../../../store/useWorkspace";
import PaymentCurrencyTable from "../../../components/paymentRequestDetails/PaymentCurrencyTable";
import { Status, StatusBtn, SubmissionTime } from "./PaymentRequestDetails";
import { useDomainStore } from "../../../store/useDomain";
import { useLocation } from "react-router-dom";
import { Cell, HeaderCell } from "../../../components/table";

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
      {/* <TableHead sx={{ backgroundColor: "var(--bg-secondary)" }}>
        <TableRow>
          <TableCell
            sx={{
              width: "30.2%",
              border: 0,
              borderRight: "1px solid var(--border-table)",
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            Recipient
          </TableCell>
          <TableCell
            sx={{
              width: "23%",
              border: 0,
              borderRight: "1px solid var(--border-table)",
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            Amount
          </TableCell>
          <TableCell
            sx={{
              width: "37%",
              border: 0,
              borderRight: "1px solid var(--border-table)",
              fontWeight: 500,
              fontSize: "16px",
            }}
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
            {getShortAddress(paymentRequestDetails?.counterparty)}
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
      </TableBody> */}
      <PaymentCurrencyTable />
    </>
  );
};

// const Cell = ({ children }: { children: React.ReactNode }) => (
//   <TableCell
//     sx={{
//       padding: 1,
//       paddingLeft: "17px",
//     }}
//   >
//     {children}
//   </TableCell>
// );

const TransferTop = ({
  data: paymentRequestDetails,
}: {
  data: IPaymentRequest;
}) => {
  const { formatAddressToDomain } = useDomainStore();
  const { workspace } = useWorkspace();
  const { pathname } = useLocation();
  return (
    <>
      <TableHead>
        <TableRow>
          <HeaderCell fontSize="16px">Safe</HeaderCell>
          <HeaderCell fontSize="16px">Counterparty</HeaderCell>
          <HeaderCell fontSize="16px">Amount</HeaderCell>
          <HeaderCell fontSize="16px">Currency</HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <Cell
            sx={{
              padding: 1,
            }}
          >
            <SafeSection>
              <div>{getShortAddress(paymentRequestDetails?.vault_wallet)}</div>
              <Logo $dir={paymentRequestDetails?.direction}>
                <img src={transferArrow} alt="" />
              </Logo>
            </SafeSection>
          </Cell>
          <Cell>
            {formatAddressToDomain(
              paymentRequestDetails?.counterparty,
              paymentRequestDetails?.workspace_chain_id || workspace?.chain_id,
              pathname.startsWith("/user")
                ? paymentRequestDetails.name_service === "sns"
                : workspace.name_service === "sns"
            )}
          </Cell>
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
  const { userWorkspaces } = useWorkspace();

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
    // PAYMENT_REQUEST_STATUS.Draft,
    PAYMENT_REQUEST_STATUS.Submitted,
    PAYMENT_REQUEST_STATUS.Rejected,
    PAYMENT_REQUEST_STATUS.Pending,
  ].includes(paymentRequestDetails.status);

  // let selectedWorkspace;
  // const [workspaceinfo, setWorkspaceInfo] = useState({})
  const [selectedWorkspaceName, setSelectedWorkspaceName] =
    useState<string>("");
  const [selectedWorkspaceAvatar, setSelectedWorkspaceAvatar] =
    useState<string>("");
  const [selectedWorkspaceSafeAddress, setSelectedWorkspaceSafeAddress] =
    useState<string>("");
  useEffect(() => {
    if (paymentRequestDetails.workspace_name) {
      setSelectedWorkspaceName(paymentRequestDetails.workspace_name);
      setSelectedWorkspaceAvatar(paymentRequestDetails.workspace_avatar);
      setSelectedWorkspaceSafeAddress(paymentRequestDetails.vault_wallet);
    } else {
      const selectedWorkspace = userWorkspaces?.data.rows.find(
        (workspace) => workspace.ID === paymentRequestDetails.workspace_id
      );
      if (selectedWorkspace) {
        setSelectedWorkspaceName(selectedWorkspace?.name);
        setSelectedWorkspaceAvatar(selectedWorkspace?.avatar);
        setSelectedWorkspaceSafeAddress(selectedWorkspace.vault_wallet);
      }
    }
  }, []);
  return (
    <>
      <WorkspaceItemDetailsLayout
        title={isTransfer ? "Transfer Details" : "Payment Request Details"}
        setOpen={setOpen}
        // workspaceInfo={selectedWorkspace}
        workspaceName={selectedWorkspaceName}
        workspaceAvatar={selectedWorkspaceAvatar}
        address={selectedWorkspaceSafeAddress}
      >
        <RequestDetails>
          <TableContainer
            sx={{
              boxShadow: "none",
              border: "1px solid var(--clr-gray-200)",
              borderRadius: "6px",
              minWidth: "722px",
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              "-ms-overflow-style": "none",
              scrollbarWidth: "none",
            }}
          >
            <Table aria-label="simple table">
              {isTransfer ? (
                <TransferTop data={paymentRequestDetails} />
              ) : (
                <NotTransferTop data={paymentRequestDetails} />
              )}
            </Table>
            {/* note info */}
            <NoteInformation>
              {/* <div className="note">Note Information</div> */}
              {/* <h3>Note Information</h3> */}
              <NoteHeader>
                <h3>Note Information</h3>
              </NoteHeader>

              {/* <TableContainer sx={{ borderRadius: "7px" }}> */}
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <Cell width="220px">
                      <NoteInfo>
                        <Image src={categoryIcon} alt="" /> Category
                      </NoteInfo>
                    </Cell>
                    <Cell width="500px">
                      {paymentRequestDetails?.category_name}
                    </Cell>
                  </TableRow>
                  {categoryProperties?.map((property: any) => (
                    <TableRow>
                      <Cell width="220px">
                        <NoteInfo>
                          <Image
                            src={getPropertyIconByType(property.type)}
                            alt=""
                          />{" "}
                          {property.name}
                        </NoteInfo>
                      </Cell>
                      <Cell width="500px">
                        {property.type === "multi-select"
                          ? property?.values
                              .split(";")
                              .map((v: string, idx: number) => (
                                <MultiOption key={idx}>{v}</MultiOption>
                              ))
                          : property.values}
                      </Cell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* </TableContainer> */}
              {/* <PaymentStatus>
              <img src={statusIcon} alt="" />
              <p>Status: {getPaymentStatus(paymentRequestDetails?.status)}</p>
            </PaymentStatus> */}
            </NoteInformation>
          </TableContainer>
          {/* submission details */}
          <SubmissionTime>
            <p>Submission time</p>
            <div>{formatTimestamp(paymentRequestDetails.submit_ts)}</div>
          </SubmissionTime>
          {!!paymentRequestDetails.reject_ts && (
            <RejectTime>
              <p>Rejection time</p>
              <div>{formatTimestamp(paymentRequestDetails.reject_ts)}</div>
            </RejectTime>
          )}
          {!!paymentRequestDetails.execute_ts && (
            <RejectTime>
              <p>Execution time</p>
              <div>{formatTimestamp(paymentRequestDetails.execute_ts)}</div>
            </RejectTime>
          )}
          {!!paymentRequestDetails.tx_hash && (
            <TransactionHash>
              <p>Transaction hash</p>
              <div>
                <span>{paymentRequestDetails.tx_hash}</span>
                <a
                  href={`${getChainExplorer(
                    paymentRequestDetails.workspace_chain_id
                  )}/tx/${paymentRequestDetails.tx_hash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {/* <img src={linkIcon} alt="" /> */}
                </a>
              </div>
            </TransactionHash>
          )}

          <Status status={getPaymentStatus(paymentRequestDetails.status)}>
            <h6>Status</h6>
            <div>
              <p></p>
              {getPaymentStatus(paymentRequestDetails.status)}
            </div>
          </Status>
        </RequestDetails>
      </WorkspaceItemDetailsLayout>
    </>
  );
};

export default PaymentRequestDetails;

const RequestDetails = styled.div`
  margin: 30px;
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

const TransactionHash = styled(SubmissionTime)`
  div {
    color: var(--clr-gray-400);
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

const LeftDirStyle = css`
  transform: rotate(180deg);
`;

const Logo = styled.div<{ $dir?: string }>`
  img {
    ${({ $dir }) => $dir === "i" && LeftDirStyle}
  }
`;
const RejectTime = styled.div`
  padding-top: 18px;
  p {
    font-size: 14px;
    font-weight: 500;
    padding-bottom: 8px;
  }
  div {
    border: 1px solid var(--clr-gray-200);
    padding: 8.5px 10px;
    font-size: 14px;
    border-radius: 8px;
  }
`;
