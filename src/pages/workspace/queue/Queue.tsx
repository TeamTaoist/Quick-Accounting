import styled from "@emotion/styled";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";
import reject from "../../../assets/workspace/reject.svg";
import back from "../../../assets/workspace/back.svg";
import { CategoryTitle } from "../category/category.style";
import { useEffect, useState } from "react";
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
import data from "../../../data/tableData";
import { useNavigate, useParams } from "react-router-dom";
import RejectDataTable from "../../../components/workspace/RejectDataTable";
import { Image, ViewReject } from "../paymentRequest/paymentRequest.style";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../utils/CustomModal";
import PaymentRequestDetails from "../paymentRequest/PaymentRequestDetails";
import { useQueue } from "../../../store/UseQueue";
import { useSafeStore } from "../../../store/useSafeStore";
import { useWorkspace } from "../../../store/useWorkspace";
import { SafeMultisigTransactionResponse } from "@safe-global/safe-core-sdk-types";
import { getShortAddress } from "../../../utils";
import usePaymentsStore from "../../../store/usePayments";
import { TransactionListItem } from "@safe-global/safe-gateway-typescript-sdk";
import QueueItem from "../../../components/workspace/QueueItem";

const Queue = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const { threshold, owners, getQueueTx, isReady } = useSafeStore();
  const { workspace } = useWorkspace();
  const { paymentRquestMap, getPaymentRequestBySafeTxHash } =
    usePaymentsStore();
  const [hasCategory, setHasCategory] = useState(true);

  const [paymentRequest, setPaymentRequest] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [list, setList] = useState<IQueueGroupItemProps[]>([]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const workspaceId = Number(id);

  const getQueueList = async () => {
    const data = await getQueueTx(workspace.chain_id, workspace.vault_wallet);
    data && setList(data);
  };

  useEffect(() => {
    isReady && workspace?.vault_wallet && getQueueList();
  }, [isReady, workspace?.vault_wallet]);

  // useEffect(() => {
  //   list.length &&
  //     getPaymentRequestBySafeTxHash(
  //       workspaceId,
  //       list.map((item) => item.safeTxHash)
  //     );
  // }, [list, workspaceId]);

  return (
    <QueueSection>
      {list.length === 0 ? (
        <CategoryTitle>
          <h3>You don't have any transactions.</h3>
          <p style={{ width: "450px", textAlign: "center" }}>
            Transactions that add tokens to or remove tokens from your Safe will
            show up here.
          </p>
        </CategoryTitle>
      ) : (
        <QueueContainer>
          <QueHeader>
            <ViewReject onClick={() => setPaymentRequest(!paymentRequest)}>
              {paymentRequest ? (
                <div>
                  <Image src={reject} alt="" />
                  <p>{t("paymentRequest.ViewRejection")}</p>
                </div>
              ) : (
                <div>
                  <Image src={back} alt="" />
                  <p>{t("paymentRequest.Back")}</p>
                </div>
              )}
            </ViewReject>
          </QueHeader>
          {/*  */}
          {paymentRequest ? (
            <>
              {list.map((item, index) => (
                <QueueItem data={item} key={index} />
              ))}
            </>
          ) : (
            <RejectSection>
              <RejectDataTable />
            </RejectSection>
          )}
        </QueueContainer>
      )}
    </QueueSection>
  );
};

export default Queue;
const QueueContainer = styled.div`
  padding: 30px 0;
`;

const QueueSection = styled.div`
  padding-top: 40px;
  margin-inline: 40px;
`;
const QueHeader = styled.div`
  display: flex;
  justify-content: end;
`;
// const ViewReject = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 5px;
//   background: var(--bg-primary);
//   padding: 6px 10px;
//   border-radius: 5px;
//   img {
//     width: 20px;
//   }
//   p {
//     font-size: 20px;
//   }
// `;
const QueueNotice = styled.div`
  margin-top: 30px;
  h1 {
    font-size: 20px;
    margin-bottom: 10px;
    font-weight: 400;
  }
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
export const RejectSection = styled.div`
  margin-top: 50px;
`;
