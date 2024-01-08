import styled from "@emotion/styled";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";
import reject from "../../../assets/workspace/reject.svg";
import back from "../../../assets/workspace/back.svg";
import { CategoryTitle } from "../category/Category";
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
import {
  Image,
  RejectSection,
  ViewReject,
} from "../paymentRequest/PaymentRequest";
import RejectDataTable from "../../../components/workspace/RejectDataTable";

const Queue = () => {
  const navigate = useNavigate();
  const [hasCategory, setHasCategory] = useState(true);
  const recipientFormate = (n: string) => {
    return `${n.slice(0, 6)}...${n.slice(-4)}`;
  };
  const [paymentRequest, setPaymentRequest] = useState(true);
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
                    <p>View rejection</p>
                  </div>
                ) : (
                  <div>
                    <Image src={back} alt="" />
                    <p>Back</p>
                  </div>
                )}
              </ViewReject>
            </QueHeader>
            {/*  */}
            {paymentRequest ? (
              <QueueNotice>
                <h1>Next Up</h1>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ backgroundColor: "var(--hover-bg)" }}
                  >
                    <Header>
                      <HeaderTitle>
                        <h6>Nonce: 1</h6>
                        <p>On 24 Oct 2023 at 12:05</p>
                      </HeaderTitle>
                      <h5>1 action</h5>
                    </Header>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    {/* category property */}
                    <Action>
                      <Approvals>
                        <h4>Approvals: 2/2</h4>
                        <p>0x4d4b...2915</p>
                        <p>0x4d4b...2915</p>
                        <button disabled>Approve</button>
                        <button disabled={false}>Execute</button>
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
                            <TableCell>Recipient</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.slice(0, 2).map((row) => (
                            <TableRow key={row.id}>
                              <TableCell>
                                {recipientFormate(row.recipient)}
                              </TableCell>
                              <TableCell>{row.amount}</TableCell>
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
                                  onClick={() =>
                                    navigate(`/payment-request/${row.id}`)
                                  }
                                >
                                  view more
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TotalValue>Total value: $123.29</TotalValue>
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
  padding: 50px 0;
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
  margin-top: 50px;
  h1 {
    font-size: 20px;
    margin-bottom: 40px;
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
  margin-top: 20px;
`;
const CategoryCell = styled.div`
  background: var(--bg-primary);
  padding: 4px 10px;
  text-align: center;
  border-radius: 4px;
`;
