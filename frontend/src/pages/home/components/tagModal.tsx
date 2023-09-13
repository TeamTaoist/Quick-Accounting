import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface IProps {
  open: boolean;
  handleClose: () => void;
}

export default function TagModal({ open, handleClose }: IProps) {
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

  const onConfirm = () => {
    // TODO
    console.log(category, usage, sender, receiver, comment);
    // check values

    try {
      // upload to ipfs
      // insert to db
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
          <div>TODO: here to display the tx details</div>
          <TextField
            fullWidth
            label="Category"
            size="small"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <TextField
            fullWidth
            label="Usage"
            size="small"
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
          />
          <TextField
            fullWidth
            label="Sender"
            size="small"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
          />
          <TextField
            fullWidth
            label="Receiver"
            size="small"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          <TextField
            fullWidth
            label="Comment"
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
`;
