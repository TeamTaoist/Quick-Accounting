import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { tagTx, uploadJson } from "../../../request/api";

interface IProps {
  daoAddress: string;
  tokenAddress: string;
  tx?: ITransaction;
  open: boolean;
  handleClose: () => void;
  updateTx: (hash:string, tx: ITransactionMore) => void;
}

export default function TagModal({
  open,
  handleClose,
  tx,
  daoAddress,
  tokenAddress,
  updateTx,
}: IProps) {
  const [category, setCategory] = useState("");
  const [usage, setUsage] = useState("");
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [comment, setComment] = useState("");

  const beforCloseModal = () => {
    setCategory("");
    setUsage("");
    setSender("");
    setReceiver("");
    setComment("");
  };
  const onClose = () => {
    beforCloseModal();
    handleClose();
  };

  const onConfirm = async () => {
    if (!tx) {
      return;
    }
    // TODO
    console.log(category, usage, sender, receiver, comment);
    // check values

    try {
      // upload to ipfs
      const p: any = { hash: tx.hash, items: usage, note: comment };
      if (sender) {
        p.fromName = sender;
      }
      if (receiver) {
        p.toName = receiver;
      }

      const resp = await uploadJson(p);
      const { IpfsHash } = resp.data;

      // insert to db
      const uresp = await tagTx({
        wallet: daoAddress,
        tokenAddress,
        blockNumber: Number(tx.blockNumber),
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        fromName: sender,
        toName: receiver,
        value: tx.value,
        tokenName: tx.tokenName,
        tokenSymbol: tx.tokenSymbol,
        tokenDecimal: tx.tokenDecimal,
        items: usage,
        note: comment,
        ipfs: IpfsHash,
        category,
      });
      updateTx(tx.hash, uresp.data.data.attributes);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalContainer>
        <Title>
          <h2>Tag the Transaction</h2>
        </Title>
        <ModalContent>
          <div>
            <p className="display-item">Hash: {tx?.hash}</p>
            <p className="display-item">
              Transfer Value: {tx?.isOut ? "-" : "+"} {tx?.value}{" "}
              {tx?.tokenSymbol}
            </p>
          </div>

          <TextField
            fullWidth
            label="Category"
            size="small"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <TextField
            fullWidth
            label="Items"
            size="small"
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
          />
          {tx?.isOut ? (
            <TextField
              fullWidth
              label="Receiver"
              size="small"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            />
          ) : (
            <TextField
              fullWidth
              label="Sender"
              size="small"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            />
          )}

          <TextField
            fullWidth
            label="Note"
            size="small"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={onConfirm} variant="contained">
            Confirm Tag
          </Button>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
}

const ModalContainer = styled(Box)`
  width: 500px;
  background-color: #fff;
  float: right;
  height: 100%;
  padding: 20px;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  .display-item {
    font-size: 12px;
  }
`;
