import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import styled from "@emotion/styled";

export default function BasicBars() {
  return (
    <BarChartContainer>
      <ReportTitle>Report 1: Balance sheet</ReportTitle>
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          },
        ]}
        series={[
          {
            data: [250, 1000, 600, 400, 230, 777, 100, 900, 131],
            color: "#7c7777",
          },
        ]}
        // width={800}
        height={500}
      />
    </BarChartContainer>
  );
}

const BarChartContainer = styled.div`
  /* width: 30px; */
`;
const ReportTitle = styled.div`
  text-align: center;
  font-size: 20px;
  padding: 10px;
  background: var(--bg-primary);
  margin-bottom: 40px;
`;
