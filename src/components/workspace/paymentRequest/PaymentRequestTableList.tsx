import React, { useState } from "react";
// table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useParams } from "react-router-dom";
import { formatNumber } from "../../../utils/number";
import { CategoryCell } from "../../../pages/workspace/paymentRequest/paymentRequest.style";
import { formatDate } from "../../../utils/time";

interface PaymentRequestTableListProps {
  items: IPaymentRequest[];
  index: number;
  selected: number[];
  setSelected: (selected: any) => void;
  handleGroupPaymentDetails: (items: IPaymentRequest[]) => void;
  handleOpenModal: (payment: IPaymentRequest) => void;
  paymentId: string;
}

const recipientFormate = (n: string) => {
  return `${n.slice(0, 6)}...${n.slice(-4)}`;
};

const PaymentRequestTableList = ({
  items,
  index,
  selected,
  setSelected,
  handleGroupPaymentDetails,
  handleOpenModal,
  paymentId,
}: PaymentRequestTableListProps) => {
  const { id } = useParams();
  const [openRows, setOpenRows] = useState<number[]>([]);

  const handleRowToggle = (categoryId: number) => {
    setOpenRows((prevOpenRows) =>
      prevOpenRows.includes(categoryId)
        ? prevOpenRows.filter((id) => id !== categoryId)
        : [...prevOpenRows, categoryId]
    );
  };
  const isSelected = (categoryId: number) =>
    selected.indexOf(categoryId) !== -1;

  const handleCheckboxClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    categoryId: number
  ) => {
    if (event.target.checked) {
      setSelected([...selected, categoryId]);
    } else {
      setSelected(selected.filter((id) => id !== categoryId));
    }
  };
  return (
    <React.Fragment key={index}>
      {items.length > 1 ? (
        <TableRow
          onClick={() => handleRowToggle(Number(id))}
          style={{ cursor: "pointer" }}
        >
          <TableCell
            colSpan={4}
            style={{
              padding: 0,
              paddingLeft: "16px",
              borderBottom: "1px solid #ddd",
              borderTop: "none",
              position: "relative",
            }}
          >
            <Checkbox
              checked={isSelected(Number(paymentId))}
              onChange={(event) =>
                handleCheckboxClick(event, Number(paymentId))
              }
            />
            {items.length} payment requests
            <IconButton
              aria-label="expand row"
              size="small"
              style={{
                position: "absolute",
                left: "200px",
              }}
            >
              {openRows.includes(Number(id)) ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell>
            <Button
              variant="outlined"
              sx={{
                borderColor: "black",
                color: "black",
                textTransform: "lowercase",
              }}
              onClick={() => handleGroupPaymentDetails(items)}
            >
              view more
            </Button>
          </TableCell>
        </TableRow>
      ) : (
        // )}
        <>
          {items.map((payment) => (
            <TableRow key={payment.ID}>
              <TableCell
                style={{
                  padding: 0,
                  paddingLeft: "16px",
                  borderBottom: "1px solid #ddd",
                  borderTop: "none",
                }}
              >
                <Checkbox
                  checked={isSelected(payment.payment_request_id)}
                  onChange={(event) =>
                    handleCheckboxClick(event, payment.payment_request_id)
                  }
                />
                {recipientFormate(payment.recipient)}
              </TableCell>
              <TableCell>
                {formatNumber(Number(payment.amount))} {payment.currency_name}
              </TableCell>
              <TableCell>
                {payment.category_name && (
                  <CategoryCell>{payment.category_name}</CategoryCell>
                )}
              </TableCell>
              <TableCell>{formatDate(payment.CreatedAt)}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "black",
                    color: "black",
                    textTransform: "lowercase",
                  }}
                  onClick={() => handleOpenModal(payment)}
                >
                  view more
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </>
      )}
      <TableRow>
        <TableCell
          colSpan={5}
          sx={{
            padding: 0,
            paddingLeft: "16px",
            borderTop: "1px solid #ddd",
          }}
        >
          <Collapse
            in={openRows.includes(Number(id))}
            timeout="auto"
            unmountOnExit
          >
            <Table size="small">
              <TableBody>
                {items.map((payments) => (
                  <TableRow key={payments.ID}>
                    <TableCell
                      // colSpan={1}
                      sx={{
                        paddingLeft: "42px",
                        width: "29%",
                      }}
                    >
                      {recipientFormate(payments.recipient)}
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "20.5%",
                      }}
                    >
                      {payments.amount} {payments.currency_name}
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "20%",
                      }}
                    >
                      <CategoryCell>{payments.category_name}</CategoryCell>
                    </TableCell>
                    <TableCell>{formatDate(payments.CreatedAt)}</TableCell>
                    <TableCell sx={{ visibility: "hidden" }}>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "black",
                          color: "black",
                          textTransform: "lowercase",
                        }}
                        // onClick={() => handleOpenModal(payment)}
                      >
                        view more
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default PaymentRequestTableList;
