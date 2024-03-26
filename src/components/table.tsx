import { TableCell, TableCellProps } from "@mui/material";

interface CustomTableCellProps extends TableCellProps {
  width?: string;
}

export const HeaderCell = ({
  width,
  children,
  ...props
}: CustomTableCellProps) => (
  <TableCell
    sx={{
      background: "var(--clr-gray-200)",
      fontWeight: "500",
      color: "var(--clr-primary-900)",
      height: "56px",
      padding: 0,
      paddingInline: 2,
      minWidth: width ? width : "auto",
    }}
    {...props}
  >
    {children}
  </TableCell>
);

export const Cell = ({ children }: { children: React.ReactNode }) => (
  <TableCell
    sx={{
      borderBottom: "none",
      borderTop: "1px solid var(--clr-gray-200)",
      padding: 0,
      paddingInline: 2,
      height: "56px",
    }}
  >
    {children}
  </TableCell>
);
