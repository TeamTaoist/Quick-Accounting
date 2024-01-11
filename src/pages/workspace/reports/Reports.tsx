import styled from "@emotion/styled";
// import BarChart from "../../../components/workspace/BarChart";
import BasicBars from "../../../components/workspace/BasicBars";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";

const Reports = () => {
  return (
    <WorkspaceLayout>
      <ReportsContainer>
        <ReportHeader>
          <p>Report1</p>
          <p>Report1</p>
          <p>Report1</p>
        </ReportHeader>
        <BasicBars />
      </ReportsContainer>
    </WorkspaceLayout>
  );
};

export default Reports;

const ReportsContainer = styled.div``;
const ReportHeader = styled.div`
  display: flex;
  gap: 20px;
  padding: 80px 60px;
  p {
    font-size: 18px;
    background: var(--bg-primary);
    padding: 4px 14px;
    border-radius: 7px;
  }
`;
