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
  updateTx,
}: {
  data: ITransaction[];
  txMap: { [tx: string]: ITransactionMore };
  daoAddress: string;
  tokenAddress: string;
  children: React.ReactNode;
  updateTx: (hash: string, tx: ITransactionMore) => void;
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

  const formatName = (name: string, address: string) => {
    return (
      <>
        {name && <p>{name}</p>}
        <p>{formatHash(address)}</p>
      </>
    );
  };

  return (
    <>
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
              <th>Time</th>
              <th>Tag</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td>
                  <Hash
                    href={`https://etherscan.io/tx/${item.hash}`}
                  >
                    {formatHash(item.hash)}
                  </Hash>
                </td>
                <td>
                  {item.isOut ? (
                    <TagStyle className="minus">-</TagStyle>
                  ) : (
                    <TagStyle>+</TagStyle>
                  )}{" "}
                  {item.valueDisplay} {item.tokenSymbol}
                </td>
                <td className="tc">{txMap[item.hash]?.category}</td>
                <td className="tc">
                  {item.isOut
                    ? formatHash(item.from)
                    : formatName(txMap[item.hash]?.fromName, item.from)}
                </td>
                <td className="tc">
                  {item.isOut
                    ? formatName(txMap[item.hash]?.toName, item.from)
                    : formatHash(item.to)}
                </td>
                <td className="tc">{txMap[item.hash]?.items}</td>
                <td className="tc">{txMap[item.hash]?.note}</td>
                <td className="tc">{item.dateDisplay}</td>
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
                      Look up
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleTag(item)}
                    >
                      Audit
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
        updateTx={updateTx}
      />
    </>
  );
}

const TableBox = styled.div`
  background-color: #fff;
  margin-inline: 20px;
  padding: 20px;
  border-radius: 6px;
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

const TagStyle = styled.span`
  color: green;
  &.minus {
    color: orange;
  }
`;

const Hash = styled.a`
  cursor: pointer;
  color: unset;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    color: darkblue;
  }
`;