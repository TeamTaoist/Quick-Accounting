import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Cell, HeaderCell } from "../table";
import React, { useEffect, useState } from "react";
import usePaymentsStore from "../../store/usePayments";
import { useParams } from "react-router-dom";
import {
  Logo,
  SafeSection,
} from "../../pages/workspace/bookkeeping/BookkeepingTransferDetails";
import { getShortAddress } from "../../utils";
import { useWorkspace } from "../../store/useWorkspace";
import rightArrow from "../../assets/workspace/right-arrow.svg";
import back from "../../assets/workspace/back.svg";
import details from "../../assets/details.svg";
import { formatNumber } from "../../utils/number";
import { CategoryCell } from "../../pages/workspace/paymentRequest/paymentRequest.style";
import { getPaymentUpdateTime } from "../../utils/payment";
import { useDomainStore } from "../../store/useDomain";
import styled from "@emotion/styled";
import Button from "../button";
import CustomModal from "../../utils/CustomModal";
import PaymentRequestDetails from "../../pages/workspace/paymentRequest/PaymentRequestDetailsReadOnly";

interface QueueFailedTable {
  paymentRequest: boolean;
  setPaymentRequest: (paymentRequest: boolean) => void;
}

const QueueFailedTable = ({
  paymentRequest,
  setPaymentRequest,
}: QueueFailedTable) => {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [list, setList] = useState<IPaymentRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNumbers, setPageNumbers] = useState(0);
  const {
    getFailedPaymentRequestList,
    setCurrentPaymentRequestDetail,
    paymentRequestDetails,
  } = usePaymentsStore();
  const { workspace, userWorkspaces } = useWorkspace();
  const { formatAddressToDomain } = useDomainStore();

  const handleOpenModal = (payment: IPaymentRequest) => {
    setCurrentPaymentRequestDetail({
      ...payment,
      vault_wallet: workspace.vault_wallet,
    });
    setOpenModal(true);
  };

  useEffect(() => {
    getFailedPaymentRequestList(Number(id), true, pageNumbers).then(
      (res: IPageResponse<IPaymentRequest>) => {
        setTotal(res?.total || 0);
        setList(res?.rows || []);
      }
    );
  }, [pageNumbers]);

  return (
    <QueueFailedContainer>
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        component={PaymentRequestDetails}
      />
      <BackBtn>
        <Button
          icon={back}
          bg="#F8FAFC"
          onClick={() => setPaymentRequest(!paymentRequest)}
        >
          Back
        </Button>
      </BackBtn>
      <TableContainer
        sx={{
          border: "1px solid var(--clr-gray-200)",
          borderRadius: "6px",
          maxHeight: "100%",
          overflow: "auto",
          minWidth: "1100px",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          scrollbarWidth: "none",
        }}
      >
        <Table stickyHeader>
          <TableHead
            style={{ background: "var(--clr-gray-200)", height: "55px" }}
          >
            <TableRow>
              <HeaderCell width="230px">Safe</HeaderCell>
              <HeaderCell width="154px">Counterparty</HeaderCell>
              <HeaderCell width="290px">Amount</HeaderCell>
              <HeaderCell width="180px">Category</HeaderCell>
              <HeaderCell width="176px">Date</HeaderCell>
              <HeaderCell width="96px"></HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((bookkeeping) => (
              <React.Fragment key={bookkeeping.ID}>
                <TableRow sx={{ height: "56px" }}>
                  <Cell>
                    <SafeSection>
                      <div>{getShortAddress(workspace?.vault_wallet)}</div>
                      <Logo $dir={bookkeeping.direction}>
                        <img src={rightArrow} alt="" />
                      </Logo>
                    </SafeSection>
                  </Cell>
                  <Cell>
                    {formatAddressToDomain(
                      bookkeeping.counterparty,
                      workspace.chain_id,
                      workspace.name_service === "sns"
                    )}
                  </Cell>
                  <Cell>
                    {formatNumber(Number(bookkeeping.amount))}{" "}
                    {bookkeeping.currency_name}
                  </Cell>
                  <Cell>
                    <CategoryCell>{bookkeeping.category_name}</CategoryCell>
                  </Cell>
                  <Cell>{getPaymentUpdateTime(bookkeeping)}</Cell>
                  <Cell>
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
                        onClick={() => handleOpenModal(bookkeeping)}
                      />
                    </Tooltip>
                  </Cell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </QueueFailedContainer>
  );
};

export default QueueFailedTable;

const QueueFailedContainer = styled.div``;
const BackBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;
