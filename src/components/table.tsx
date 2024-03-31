import { TableCell, TableCellProps } from "@mui/material";

interface CustomTableCellProps extends TableCellProps {
  width?: string;
  fontSize?: string;
}

export const HeaderCell = ({
  width,
  children,
  fontSize,
  ...props
}: CustomTableCellProps) => (
  <TableCell
    sx={{
      background: "var(--clr-gray-100)",
      fontWeight: "500",
      color: "var(--clr-primary-900)",
      height: "56px",
      padding: 0,
      paddingInline: 2,
      minWidth: width ? width : "auto",
      fontSize: fontSize ? fontSize : "14px",
      borderBottom: "none",
    }}
    {...props}
  >
    {children}
  </TableCell>
);

export const Cell = ({ children, width, ...props }: CustomTableCellProps) => (
  <TableCell
    sx={{
      borderBottom: "none",
      borderTop: "1px solid var(--clr-gray-200)",
      padding: 0,
      paddingInline: 2,
      height: "56px",
      minWidth: width ? width : "100%",
      fontSize: "14px",
      fontWeight: 400,
    }}
    {...props}
  >
    {children}
  </TableCell>
);
