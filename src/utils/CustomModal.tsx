import { Modal, Box } from "@mui/material";

interface CustomModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  component: React.ComponentType<{ setOpen: (open: boolean) => void }>;
  additionalProps?: any;
}

const CustomModal = ({
  open,
  setOpen,
  component: Component,
  additionalProps,
}: CustomModalProps) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableScrollLock={false}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "block",
            overflowY: "scroll",
            height: "100%",
            minWidth: 450,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            scrollbarWidth: "none",
          }}
        >
          <Component setOpen={setOpen} {...additionalProps} />
          {/* {Component} */}
        </Box>
      </Modal>
    </div>
  );
};

export default CustomModal;
