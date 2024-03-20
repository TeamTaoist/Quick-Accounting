import React, { useEffect, useState } from "react";
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
import { getPaymentUpdateTime } from "../../../utils/payment";
import { useDomainStore } from "../../../store/useDomain";
import { useWorkspace } from "../../../store/useWorkspace";
import { Tooltip } from "@mui/material";
import details from "../../../assets/details.svg";
import { CheckBoxStyle } from "../category/CategoryArchivedList";

interface PaymentRequestTableListProps {
  items: IPaymentRequest[];
  index: number;
  selected: number[];
  setSelected: (selected: any) => void;
  handleGroupPaymentDetails: (items: IPaymentRequest[]) => void;
  handleOpenModal: (payment: IPaymentRequest) => void;
  paymentId: string;
}

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
  const { formatAddressToDomain } = useDomainStore();
  const { workspace } = useWorkspace();

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
  console.log("items", items);

  return (
    <React.Fragment key={paymentId}>
      {items.length > 1 ? (
        <TableRow
          onClick={() => handleRowToggle(Number(id))}
          style={{ cursor: "pointer" }}
          sx={{
            "& > .MuiTableCell-root": {
              // borderBottom: "none",
            },
            background: "var(--clr-gray-100)",
            height: "55px",
          }}
        >
          <TableCell
            colSpan={4}
            style={{
              padding: 0,
              paddingLeft: "16px",
              position: "relative",
              borderBottom: "none",
              borderTop: "1px solid var(--clr-gray-200)",
            }}
          >
            <Checkbox
              checked={isSelected(Number(paymentId))}
              onChange={(event) =>
                handleCheckboxClick(event, Number(paymentId))
              }
              sx={CheckBoxStyle}
            />
            {items.length} payment requests
            <IconButton
              aria-label="expand row"
              size="small"
              style={{
                position: "absolute",
                left: "240px",
              }}
            >
              {openRows.includes(Number(id)) ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell
            sx={{
              borderBottom: "none",
              borderTop: "1px solid var(--clr-gray-200)",
            }}
          >
            <Tooltip
              title="View details"
              placement="top"
              componentsProps={{
                tooltip: {
                  sx: {
                    background: "var(--clr-white)",
                    color: "#111",
                    padding: "8px 16px",
                    fontSize: "12px",
                  },
                },
              }}
            >
              <img
                src={details}
                alt=""
                style={{ width: "16px" }}
                onClick={() => handleGroupPaymentDetails(items)}
              />
            </Tooltip>
          </TableCell>
        </TableRow>
      ) : (
        // )}
        <>
          {items.map((payment) => (
            <TableRow
              key={payment.ID}
              sx={{
                "& > .MuiTableCell-root": {
                  borderBottom: "none",
                },
                height: "55px",
              }}
            >
              <TableCell
                style={{
                  padding: 0,
                  paddingLeft: "16px",
                  borderBottom: "none",
                  borderTop: "1px solid var(--clr-gray-200)",
                }}
              >
                <Checkbox
                  checked={isSelected(payment.payment_request_id)}
                  onChange={(event) =>
                    handleCheckboxClick(event, payment.payment_request_id)
                  }
                  sx={CheckBoxStyle}
                />
                {formatAddressToDomain(
                  payment.counterparty,
                  workspace.chain_id,
                  workspace.name_service === "sns"
                )}
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "none",
                  borderTop: "1px solid var(--clr-gray-200)",
                }}
              >
                {formatNumber(Number(payment.amount))} {payment.currency_name}
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "none",
                  borderTop: "1px solid var(--clr-gray-200)",
                }}
              >
                {payment.category_name && (
                  <CategoryCell>{payment.category_name}</CategoryCell>
                )}
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "none",
                  borderTop: "1px solid var(--clr-gray-200)",
                }}
              >
                {getPaymentUpdateTime(payment)}
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: "none",
                  borderTop: "1px solid var(--clr-gray-200)",
                }}
              >
                <Tooltip
                  title="View details"
                  placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        background: "var(--clr-white)",
                        color: "#111",
                        border: "1px solid var(--clr-gray-200)",
                        padding: "8px 16px",
                        fontSize: "12px",
                      },
                    },
                  }}
                >
                  <img
                    src={details}
                    alt=""
                    style={{ width: "16px" }}
                    onClick={() => handleOpenModal(payment)}
                  />
                </Tooltip>
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
            // paddingLeft: "16px",
            // borderTop: "1px solid #ddd",
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
                  <TableRow
                    key={payments.ID}
                    sx={{ background: "var(--clr-gray-100)", height: "55px" }}
                  >
                    <TableCell
                      // colSpan={1}
                      sx={{
                        paddingLeft: "90px",
                        width: "29%",
                        borderBottom: "none",
                        borderTop: "1px solid var(--clr-gray-200)",
                      }}
                    >
                      {formatAddressToDomain(
                        payments.counterparty,
                        workspace.chain_id
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "20.5%",
                        borderBottom: "none",
                        borderTop: "1px solid var(--clr-gray-200)",
                      }}
                    >
                      {payments.amount} {payments.currency_name}
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "20%",
                        borderBottom: "none",
                        borderTop: "1px solid var(--clr-gray-200)",
                      }}
                    >
                      <CategoryCell>{payments.category_name}</CategoryCell>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        borderTop: "1px solid var(--clr-gray-200)",
                      }}
                    >
                      {getPaymentUpdateTime(payments)}
                    </TableCell>
                    <TableCell
                      sx={{
                        // visibility: "hidden",
                        borderBottom: "none",
                        borderTop: "1px solid var(--clr-gray-200)",
                      }}
                    >
                      {/* <Button
                        variant="outlined"
                        sx={{
                          borderColor: "black",
                          color: "black",
                          textTransform: "lowercase",
                        }}
                        // onClick={() => handleOpenModal(payment)}
                      >
                        view more
                      </Button> */}
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
