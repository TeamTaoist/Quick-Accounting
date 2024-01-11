import Header from "../../../components/layout/header/Header";
import {
  AddPayment,
  Btn,
  CreateRequest,
  DeleteIcon,
  Image,
  NoteInfo,
  NoteInformation,
  Request,
  RequestHeader,
  RequestSubmit,
  TableSection,
  // Table,
} from "./newPaymentRequest.style";
import cancel from "../../../assets/auth/cancel.svg";
import trash from "../../../assets/workspace/trash.svg";
import arrowBottom from "../../../assets/workspace/arrow-bottom.svg";
import add from "../../../assets/workspace/add.svg";
import categoryIcon from "../../../assets/workspace/category-icon.svg";
import selectIcon from "../../../assets/workspace/select.svg";
import multiSelect from "../../../assets/workspace/multi-select.svg";
import optionsIcon from "../../../assets/workspace/option.svg";

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
import { useNavigate } from "react-router-dom";
import ReactSelect from "../../../components/ReactSelect";

const NewPaymentRequest = () => {
  const navigate = useNavigate();
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

  const [selectedValues, setSelectedValues] = useState([]);

  const handleSelectChange = (selectedOptions: any) => {
    setSelectedValues(selectedOptions);
  };
  const options = [
    { value: "option 1", label: "Options 1" },
    { value: "option 2", label: "Options 2" },
    { value: "option 3", label: "Options 3" },
    { value: "option 4", label: "Options 4" },
    { value: "option 5", label: "Options 5" },
  ];
  return (
    <Header>
      <CreateRequest>
        <Request>
          <RequestHeader>
            <h1>New payment request</h1>
            <img onClick={() => navigate("/assets")} src={cancel} alt="" />
          </RequestHeader>
          <TableSection>
            <TableContainer
              sx={{
                paddingInline: "46px",
                paddingTop: "30px",
                // boxShadow: "none",
                boxShadow: "none",
              }}
            >
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
                        // borderRadius: "10px",
                      }}
                    >
                      <TableCell
                        sx={{
                          border: "1px solid var(--border-table)",
                          padding: 0,
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
                          border: "1px solid var(--border-table)",
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
                          border: "1px solid var(--border-table)",
                          borderRadius: "5px",
                          padding: 0,
                          paddingLeft: "10px",
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
                      sx={{
                        td: {
                          border: "1px solid var(--border-table)",
                          padding: 0,
                          paddingInline: "16px",
                        },
                      }}
                    >
                      <TableCell sx={{ height: 1, width: 200 }}>
                        <NoteInfo>
                          <Image src={categoryIcon} alt="" /> Category
                        </NoteInfo>
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
                                  style={{ marginRight: "20px" }}
                                />
                              </InputAdornment>
                            )}
                            sx={{
                              minWidth: "100%",
                              "& fieldset": { border: "none" },
                            }}
                          >
                            <MenuItem disabled value="Category">
                              Category name
                            </MenuItem>
                            <MenuItem
                              value={10}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "var(--hover-bg)",
                                },
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
                    <TableRow
                      sx={{
                        td: {
                          border: "1px solid var(--border-table)",
                          padding: 0,
                          paddingInline: "16px",
                        },
                      }}
                    >
                      <TableCell sx={{ height: 1, width: 200 }}>
                        <NoteInfo>
                          <Image src={selectIcon} alt="" /> Property name
                        </NoteInfo>
                      </TableCell>
                      {/* add multi select */}
                      <TableCell>
                        <ReactSelect
                          value={selectedValues}
                          onChange={handleSelectChange}
                          options={options}
                          defaultValues={[options[1]]}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        td: {
                          border: "1px solid var(--border-table)",
                          padding: 0,
                          paddingInline: "16px",
                        },
                      }}
                    >
                      <TableCell sx={{ height: 1, width: 200 }}>
                        <NoteInfo>
                          <Image src={multiSelect} alt="" /> Property name
                        </NoteInfo>
                      </TableCell>
                      {/* add multi select */}
                      <TableCell>
                        <ReactSelect
                          value={selectedValues}
                          onChange={handleSelectChange}
                          options={options}
                          defaultValues={[options[1], options[2]]}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        td: {
                          border: "1px solid var(--border-table)",
                          padding: 0,
                          paddingInline: "16px",
                        },
                      }}
                    >
                      <TableCell sx={{ height: 1, width: 200 }}>
                        <NoteInfo>
                          <Image src={optionsIcon} alt="" /> Property name
                        </NoteInfo>
                      </TableCell>
                      {/* add multi select */}
                      <TableCell>
                        <TextField
                          sx={{
                            "& fieldset": { border: "none" },
                          }}
                          size="small"
                          fullWidth
                          // id="fullWidth"
                          placeholder="Enter content"
                          InputProps={{
                            style: { padding: 0 },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </NoteInformation>
            <Btn>
              <RequestSubmit>Submit</RequestSubmit>
            </Btn>
          </TableSection>
        </Request>
      </CreateRequest>
    </Header>
  );
};

export default NewPaymentRequest;
