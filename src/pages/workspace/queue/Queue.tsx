import styled from "@emotion/styled";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";
import reject from "../../../assets/workspace/reject.svg";
import back from "../../../assets/workspace/back.svg";
import { CategoryTitle } from "../category/category.style";
import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import RejectDataTable from "../../../components/workspace/RejectDataTable";
import { Image, ViewReject } from "../paymentRequest/paymentRequest.style";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../utils/CustomModal";
import PaymentRequestDetails from "../paymentRequest/PaymentRequestDetails";

const Queue = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [hasCategory, setHasCategory] = useState(true);
  const recipientFormate = (n: string) => {
    return `${n.slice(0, 6)}...${n.slice(-4)}`;
  };
  const [paymentRequest, setPaymentRequest] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  return (
    <WorkspaceLayout>
      <QueueSection>
        {!hasCategory ? (
          <CategoryTitle>
            <h3>You don't have any transactions.</h3>
            <p style={{ width: "450px", textAlign: "center" }}>
              Transactions that add tokens to or remove tokens from your Safe
              will show up here.
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
              <QueueNotice>
                <h1>{t("queue.NextUp")}</h1>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ backgroundColor: "var(--hover-bg)" }}
                  >
                    <Header>
                      <HeaderTitle>
                        <h6>{t("queue.Nonce")}: 1</h6>
                        <p>On 24 Oct 2023 at 12:05</p>
                      </HeaderTitle>
                      <h5>1 {t("queue.Action")}</h5>
                    </Header>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    {/* category property */}
                    <Action>
                      <Approvals>
                        <h4>Approvals: 2/2</h4>
                        <p>0x4d4b...2915</p>
                        <p>0x4d4b...2915</p>
                        <button disabled>{t("queue.Approve")}</button>
                        <button disabled={false}>{t("queue.Execute")}</button>
                      </Approvals>
                      <Approvals>
                        <h4>Rejections: 1/2</h4>
                        <p>0x4d4b...2915</p>
                        <p>0x4d4b...2915</p>
                        <button disabled={false}>Reject</button>
                        <button disabled={true}>Execute</button>
                      </Approvals>
                      {/* <Rejections></Rejections> */}
                    </Action>
                    <TableContainer
                      component={Paper}
                      sx={{ maxHeight: 200, minWidth: 800 }}
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
                          {data.slice(0, 1).map((row) => (
                            <TableRow key={row.id}>
                              <TableCell>
                                {recipientFormate(row.safe)}
                              </TableCell>
                              <TableCell>
                                {recipientFormate(row.recipient)}
                              </TableCell>
                              <TableCell>{row.amount} USDT</TableCell>
                              <TableCell>
                                <CategoryCell>{row.category}</CategoryCell>
                              </TableCell>
                              <TableCell>{row.date}</TableCell>
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
                          ))}
                        </TableBody>
                      </Table>
                      <TotalValue>Total value: $123.29</TotalValue>
                    </TableContainer>
                    {/* category property end */}
                  </AccordionDetails>
                </Accordion>
              </QueueNotice>
            ) : (
              <RejectSection>
                <RejectDataTable />
              </RejectSection>
            )}
          </QueueContainer>
        )}
      </QueueSection>
    </WorkspaceLayout>
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
