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
            width: "100%",
            maxWidth: "100vw",
            maxHeight: "100%",
            position: "fixed",
            inset: "0",
            // overflowY: "auto",
            // "&::-webkit-scrollbar": {
            //   display: "none",
            // },
            background: "var(--clr-modal-mask)",
            // "-ms-overflow-style": "none",
            // scrollbarWidth: "none",
          }}
        >
          <Component setOpen={setOpen} {...additionalProps} />
        </Box>
      </Modal>
    </div>
  );
};

export default CustomModal;
