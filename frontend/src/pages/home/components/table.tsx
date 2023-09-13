import styled from "@emotion/styled";
import React, { useState } from "react";
import { formatHash } from "../../../utils/index";
import "bootstrap-table/dist/bootstrap-table.min.css";
import "bootstrap-table";
import Button from "@mui/material/Button";
import TagModal from "./tagModal";

export default function Table({
  data,
  txMap,
  daoAddress,
  tokenAddress,
  children,
}: {
  data: ITransaction[];
  txMap: { [tx: string]: ITransactionMore };
  daoAddress: string;
  tokenAddress: string;
  children: React.ReactNode;
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
      <BasicDataBox>
        <p>Dao: {daoAddress}</p>
        <p>Token: {tokenAddress}</p>
      </BasicDataBox>
      <TableBox>
        <TableStyle data-toggle="table">
          <thead>
            <tr>
              <th>Tx Hash</th>
              <th>Transfer Value</th>
              <th>Category</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Items</th>
              <th>Note</th>
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
                <td className="tc">{txMap[item.hash]?.category}</td>
                <td className="tc">
                  {item.isOut ? "" : txMap[item.hash]?.fromName}
                </td>
                <td className="tc">
                  {item.isOut ? txMap[item.hash]?.toName : ""}
                </td>
                <td className="tc">{txMap[item.hash]?.items}</td>
                <td className="tc">{txMap[item.hash]?.note}</td>
                <td className="tc">
                  {txMap[item.hash] ? (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        window.open(
                          `https://ipfs.io/ipfs/${txMap[item.hash].ipfs}`,
                          "_blank"
                        )
                      }
                    >
                      {" "}
                      Look up
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleTag(item)}
                    >
                      Add Tag
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </TableStyle>
        {children}
      </TableBox>
      <TagModal
        open={open}
        handleClose={handleClose}
        tx={showTx}
        daoAddress={daoAddress}
        tokenAddress={tokenAddress}
      />
    </>
  );
}

const TableBox = styled.div`
  background-color: #fff;
  margin-inline: 20px;
  padding: 20px;
`; 

const TableStyle = styled.table`
  width: 100%;
  .tc {
    text-align: center;
  }
  tbody tr:hover {
    background-color: #fff;
  }
  .no-records-found {
    display: none;
  }
`;

const BasicDataBox = styled.div`
  background-color: #fff;
  padding: 10px 20px;
  margin: 0 20px 20px;
`;

