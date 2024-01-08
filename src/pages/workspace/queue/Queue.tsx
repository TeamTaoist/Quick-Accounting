import styled from "@emotion/styled";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";
import reject from "../../../assets/workspace/reject.svg";
import archive from "../../../assets/workspace/archive.svg";
import add from "../../../assets/workspace/add.svg";
import { CategoryTitle } from "../category/Category";
import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Queue = () => {
  const [hasCategory, setHasCategory] = useState(true);
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
              <ViewReject>
                <img src={reject} alt="" />
                <p>View rejection</p>
              </ViewReject>
            </QueHeader>
            {/*  */}
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
                    <Rejections></Rejections>
                  </Action>
                  {/* category property end */}
                </AccordionDetails>
              </Accordion>
            </QueueNotice>
          </QueueContainer>
        )}
      </QueueSection>
    </WorkspaceLayout>
  );
};

export default Queue;
const QueueContainer = styled.div``;

const QueueSection = styled.div`
  padding-top: 40px;
  margin-inline: 40px;
  border: 1px solid red;
`;
const QueHeader = styled.div`
  display: flex;
  justify-content: end;
`;
const ViewReject = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--bg-primary);
  padding: 6px 10px;
  border-radius: 5px;
  img {
    width: 20px;
  }
  p {
    font-size: 20px;
  }
`;
const QueueNotice = styled.div`
  margin-top: 50px;
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
    color: var(--test-secondary);
  }
`;
const Action = styled.div``;
const Approvals = styled.div`
  button {
    border: 1px solid var(--border);
    background: transparent;
    outline: none;
    padding: 8px 12px;
    border-radius: 7px;
    font-size: 18px;
  }
  button[disabled]:hover {
    cursor: not-allowed;
  }
`;
const Rejections = styled.div``;
