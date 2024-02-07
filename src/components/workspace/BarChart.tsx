import styled from "@emotion/styled";
import { ResponsiveBar } from "@nivo/bar";
const data = [
  {
    column: "1",
    row: 300,
  },
  {
    column: "2",
    row: 1000,
  },
  {
    column: "3",
    row: 200,
  },
  {
    column: "4",
    row: 600,
  },
  {
    column: "5",
    row: 400,
  },
  {
    column: "6",
    row: 500,
  },
  {
    column: 7,
    row: 900,
  },
];
const BarChart = () => {
  return (
    <BarChartContainer>
      <h1>bar chart</h1>
      <ResponsiveBar
        data={data}
        keys={["row"]}
        indexBy="column"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.6}
        valueScale={{ type: "linear" }}
        colors="gray"
        animate={true}
        enableLabel={false}
        axisTop={null}
        axisRight={null}
        // axisLeft={{
        //   tickSize: 5,
        //   tickPadding: 5,
        //   tickRotation: 0,
        //   legendOffset: -40,
        // }}
        axisBottom={{
          tickSize: 5, // Remove row lines
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: "middle",
          legendOffset: 32,
        }}
        enableGridY={false}
      />
    </BarChartContainer>
  );
};

export default BarChart;

const BarChartContainer = styled.div`
  height: 70vh;
  width: 700px;
  /* position: relative; */
  /* border-left: 2px solid #ccc; */
  border: 1px solid #ccc; /* Add bottom border */
  padding-left: 10px;
`;
