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
  const [list, setList] = useState<SafeMultisigTransactionResponse[]>([]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const workspaceId = Number(id);

  const getQueueList = async () => {
    const data = await getQueueTx(workspace.vault_wallet);
    data && setList(data);
  };

  useEffect(() => {
    isReady && workspace?.vault_wallet && getQueueList();
  }, [isReady, workspace?.vault_wallet]);

  useEffect(() => {
    list.length &&
      getPaymentRequestBySafeTxHash(
        workspaceId,
        list.map((item) => item.safeTxHash)
      );
  }, [list, workspaceId]);

  return (
    <QueueSection>
      {!hasCategory ? (
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
                <QueueNotice key={index}>
                  <h1>{index === 0 ? t("queue.NextUp") : "After that"}</h1>
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
                            {t("queue.Nonce")}: {item.nonce}
                          </h6>
                          <p>On 24 Oct 2023 at 12:05</p>
                        </HeaderTitle>
                        <h5>
                          {1} {t("queue.Action")}
                        </h5>
                      </Header>
                    </AccordionSummary>
                    {/* {queue.map((queueItem) => ( */}
                    <AccordionDetails sx={{ p: 0 }}>
                      {/* category property */}
                      <Action>
                        <Approvals>
                          <h4>
                            Approvals: {item.confirmations?.length || 0}/
                            {threshold}
                          </h4>
                          {item.confirmations?.map((owner) => (
                            <p key={owner.owner}>
                              {getShortAddress(owner.owner)}
                            </p>
                          ))}

                          <button disabled>{t("queue.Approve")}</button>
                          <button disabled={false}>{t("queue.Execute")}</button>
                        </Approvals>
                        <Approvals>
                          <h4>Rejections: 1/{owners.length - threshold + 1}</h4>
                          <p>0x4d4b...2915</p>
                          <p>0x4d4b...2915</p>
                          <button disabled={false}>Reject</button>
                          <button disabled={true}>Execute</button>
                        </Approvals>
                        {/* <Rejections></Rejections> */}
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
                            {(paymentRquestMap.get(item.safeTxHash) || []).map(
                              (queueItem: any) => (
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
                                    <CategoryCell>
                                      {queueItem.category_name}
                                    </CategoryCell>
                                  </TableCell>
                                  <TableCell>
                                    {queueItem.CreatedAt.slice(0, 10)}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="outlined"
                                      sx={{
                                        borderColor: "black",
                                        color: "black",
                                        textTransform: "lowercase",
                                      }}
                                      onClick={handleOpenModal}
                                    >
                                      view more
                                    </Button>
                                    <CustomModal
                                      open={openModal}
                                      setOpen={setOpenModal}
                                      component={PaymentRequestDetails}
                                    />
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TotalValue>Total value: $0</TotalValue>
                      {/* category property end */}
                    </AccordionDetails>
                    {/* ))} */}
                  </Accordion>
                </QueueNotice>
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
