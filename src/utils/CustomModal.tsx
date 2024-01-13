import { Modal, Box } from "@mui/material";

interface CustomModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  component: any;
}

const CustomModal = ({
  open,
  setOpen,
  component: Component,
}: CustomModalProps) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
          }}
        >
          <Component setOpen={setOpen} />
          {/* {Component} */}
        </Box>
      </Modal>
    </div>
  );
};

export default CustomModal;
