import styled from "@emotion/styled";
import { useState } from "react";
import { formatHash } from "../../../utils/index";
import "bootstrap-table/dist/bootstrap-table.min.css";
import "bootstrap-table";
import Button from "@mui/material/Button";
import TagModal from "./tagModal";

export default function Table({
  data,
  txMap,
}: {
  data: ITransaction[];
  txMap: any;
}) {
  const [open, setOpen] = useState(false);
  const [showTx, setShowTx] = useState<ITransaction>();

  const handleTag = (item: ITransaction) => {
    setOpen(true);
    setShowTx(item);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TableStyle data-toggle="table">
        <thead>
          <tr>
            <th>Tx Hash</th>
            <th>Transfer Value</th>
            <th>Tag</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td>{formatHash(item.hash)}</td>
              <td>
                {item.isOut ? "-" : "+"} {item.value} {item.tokenSymbol}
              </td>
              <td>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleTag(item)}
                >
                  Tag
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </TableStyle>
      <TagModal open={open} handleClose={handleClose} tx={showTx} />
    </>
  );
}

const TableStyle = styled.table`
  .no-records-found {
    display: none;
  }
`;
