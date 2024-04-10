import styled from "@emotion/styled";
// import BarChart from "../../../components/workspace/BarChart";
import BasicBars from "../../../components/workspace/BasicBars";
import WorkspaceLayout from "../../../components/layout/workspaceLayout/WorkspaceLayout";
import { useTranslation } from "react-i18next";

const Reports = () => {
  const { t } = useTranslation();
  return (
    <ReportsContainer>
      {/* <ReportHeader>
        <p>{t("reports.Report")} 1</p>
        <p>{t("reports.Report")} 2</p>
        <p>{t("reports.Report")} 3</p>
      </ReportHeader>
      <BasicBars /> */}
      <ReportMsg>
        <h3>Coming soon!</h3>
        <p>These reports provide insight into your vault assets</p>
      </ReportMsg>
    </ReportsContainer>
  );
};

export default Reports;

const ReportsContainer = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
`;
const ReportMsg = styled.div`
  text-align: center;
  h3 {
    font-size: 24px;
    font-weight: 600;
  }
  p {
    font-size: 14px;
    color: var(--clr-gray-700);
    margin-top: 10px;
  }
`;
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
