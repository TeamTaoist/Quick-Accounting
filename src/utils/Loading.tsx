import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";

const Loading = () => {
  return (
    <LoadingContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    </LoadingContainer>
  );
};

export default Loading;

const LoadingContainer = styled.div`
  background: rgba(10, 22, 11, 0.4);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99999;
`;
