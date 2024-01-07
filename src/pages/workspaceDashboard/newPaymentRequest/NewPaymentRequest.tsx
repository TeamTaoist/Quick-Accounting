import Header from "../../../components/layout/header/Header";
import {
  AddPayment,
  CreateRequest,
  DeleteIcon,
  NoteInformation,
  Request,
  RequestHeader,
  // Table,
} from "./newPaymentRequest.style";
import cancel from "../../../assets/auth/cancel.svg";
import trash from "../../../assets/workspace/trash.svg";
import arrowBottom from "../../../assets/workspace/arrow-bottom.svg";
import add from "../../../assets/workspace/add.svg";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";

const NewPaymentRequest = () => {
  const [selectedValue, setSelectedValue] = useState("Option1");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };

  const [age, setAge] = useState("Category");

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  // add new payment request
  const [rows, setRows] = useState([{ id: 1 }]);

  const handleAddPayment = () => {
    const newRow = { id: rows.length + 1 };
    setRows([...rows, newRow]);
  };
  return (
    <Header>
      <CreateRequest>
        <Request>
          <RequestHeader>
            <h1>New payment request</h1>
            <img src={cancel} alt="" />
          </RequestHeader>
          <TableContainer sx={{ paddingInline: "46px", paddingTop: "30px" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: 200,
                      border: 0,
                      paddingInline: 0,
                    }}
                  >
                    Recipient
                  </TableCell>
                  <TableCell sx={{ width: 150, border: 0, paddingInline: 0 }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ width: 200, border: 0, paddingInline: 0 }}>
                    Currency
                  </TableCell>
                  <TableCell sx={{ width: 50, border: 0 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* <TableRow sx={{ td: { border: 1, padding: 0 } }}> */}
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      height: "30px",
                      borderRadius: "10px",
                    }}
                  >
                    <TableCell
                      // size="small"
                      sx={{
                        border: "1px solid var(--border)",
                        padding: 0,
                        borderTopLeftRadius: "10px !important",
                        borderBottomLeftRadius: "10px !important",
                      }}
                    >
                      <TextField
                        sx={{
                          "& fieldset": { border: "none" },
                        }}
                        size="small"
                        fullWidth
                        // id="fullWidth"
                        placeholder="Enter wallet address"
                        InputProps={{
                          style: { padding: 0 },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid var(--border)",
                        borderRadius: "5px",
                        padding: 0,
                        paddingLeft: "10px",
                        // minHeight: "40px",
                      }}
                    >
                      0.00
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid var(--border)",
                        padding: 0,
                        borderTopRightRadius: "5px",
                        borderBottomRightRadius: "5px",
                        // minHeight: "40px",
                      }}
                    >
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={selectedValue}
                        onChange={handleChange}
                        size="small"
                        IconComponent={() => (
                          <InputAdornment position="start">
                            <img
                              src={arrowBottom}
                              alt="Custom Arrow Icon"
                              style={{ marginRight: "50px" }}
                            />
                          </InputAdornment>
                        )}
                        sx={{
                          minWidth: "100%",
                          "& fieldset": { border: "none" },
                        }}
                      >
                        <MenuItem
                          value="Option1"
                          sx={{
                            "&:hover": { backgroundColor: "var(--hover-bg)" },
                            "&.Mui-selected": {
                              backgroundColor: "var(--hover-bg)",
                            },
                          }}
                        >
                          Ten
                        </MenuItem>
                        <MenuItem value="Option2">Twenty</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "none",
                        padding: 0,
                        // minHeight: "40px",
                      }}
                    >
                      <DeleteIcon>
                        <img src={trash} alt="" />
                      </DeleteIcon>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <AddPayment onClick={handleAddPayment}>
              <img src={add} alt="" />
              <span>Add</span>
            </AddPayment>
          </TableContainer>
          {/* note info */}
          <NoteInformation>
            <h3>Note Information</h3>

            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                  <TableRow
                    sx={{ td: { border: 1, padding: 0, paddingInline: 1 } }}
                  >
                    <TableCell sx={{ height: 1, width: 200 }}>
                      Category
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={age}
                          label="Age"
                          size="small"
                          onChange={handleCategoryChange}
                          IconComponent={() => (
                            <InputAdornment position="start">
                              <img
                                src={arrowBottom}
                                alt="Custom Arrow Icon"
                                style={{ marginRight: "30px" }}
                              />
                            </InputAdornment>
                          )}
                          sx={{
                            minWidth: "100%",
                            "& fieldset": { border: "none" },
                          }}
                        >
                          <MenuItem disabled value="Category">
                            Placeholder
                          </MenuItem>
                          <MenuItem
                            value={10}
                            sx={{
                              "&:hover": { backgroundColor: "var(--hover-bg)" },
                              "&.Mui-selected": {
                                backgroundColor: "var(--hover-bg)",
                              },
                            }}
                          >
                            Ten
                          </MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </NoteInformation>
        </Request>
      </CreateRequest>
    </Header>
  );
};

export default NewPaymentRequest;
