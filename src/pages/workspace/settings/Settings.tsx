import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import data from "../../../data/tableData";

const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};
const Settings = () => {
  return (
    <div>
      <TableContainer component={Paper} sx={{ maxHeight: 200, minWidth: 800 }}>
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
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{recipientFormate(row.recipient)}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <button>Details</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Settings;
