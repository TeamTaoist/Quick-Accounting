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
import { ChangeEvent, useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { useNavigate, useParams } from "react-router-dom";
import ReactSelect from "../../../components/ReactSelect";
import { useCategoryProperty } from "../../../store/useCategoryProperty";

interface SubmitRowData {
  recipient: string;
  amount: string;
  currency: string;
}

const NewPaymentRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedValue, setSelectedValue] = useState("Option1");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };

  const [age, setAge] = useState("");

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
    console.log(event.target.value);
  };
  // console.log(age);

  // add new payment request
  const [rows, setRows] = useState([
    { recipient: "", amount: "", currency: "" },
  ]);

  // const handleAddPayment = () => {
  //   // const newRow = { id: rows.length + 1 };
  //   // setRows([...rows, newRow]);
  // };
  const handleAddPayment = () => {
    setRows([...rows, { recipient: "", amount: "", currency: "" }]);
  };
  const [selectedValues, setSelectedValues] = useState([]);

  const handleSelectChange = (selectedOptions: any) => {
    setSelectedValues(selectedOptions);
  };
  const handleServiceChange = (
    e:
      | ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
      | SelectChangeEvent<string>,
    index: number,
    property: string
  ) => {
    const { value } = e.target as { value: string };
    const list = [...rows];
    list[index][property as keyof SubmitRowData] = value;
    setRows(list);
  };
  const { getWorkspaceCategoryProperties, workspaceCategoryProperties } =
    useCategoryProperty();
  const [selectedCategoryID, setSelectedCategoryID] = useState<number>();

  const selectedCategory = workspaceCategoryProperties.find(
    (f) => f.ID === selectedCategoryID
  );
  // const options = selectedCategory
  //   ? selectedCategory?.properties?.map((property) => ({
  //       value: property.name,
  //       label: property.name,
  //     }))
  //   : [];
  // const singleSelect = selectedCategory
  // console.log(rows);
  const handleDeletePayment = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const workspaceId = Number(id);
  useEffect(() => {
    getWorkspaceCategoryProperties(workspaceId);
  }, [getWorkspaceCategoryProperties, workspaceId]);

  console.log(selectedValues);
  console.log(selectedCategory);

  return (
    <Header>
      <CreateRequest>
        <Request>
          <RequestHeader>
            <h1>New payment request</h1>
            <img onClick={() => navigate(-1)} src={cancel} alt="" />
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
                  {rows.map((row, index) => (
                    <TableRow
                      key={index}
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
                          name={`service-${index}`}
                          type="text"
                          id={`service-${index}`}
                          value={row.recipient}
                          onChange={(e) =>
                            handleServiceChange(e, index, "recipient")
                          }
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
                        <TextField
                          sx={{
                            "& fieldset": { border: "none" },
                          }}
                          size="small"
                          fullWidth
                          // id="fullWidth"
                          placeholder="0.00"
                          InputProps={{
                            style: { padding: 0 },
                          }}
                          name={`service-${index}`}
                          type="text"
                          id={`service-${index}`}
                          value={row.amount}
                          onChange={(e) =>
                            handleServiceChange(e, index, "amount")
                          }
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
                        <Select
                          labelId={`dropdown-${index}-label`}
                          id={`dropdown-${index}`}
                          value={row.currency}
                          onChange={(e) =>
                            handleServiceChange(e, index, "currency")
                          }
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
                        <DeleteIcon onClick={() => handleDeletePayment(index)}>
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
                            // value={age}
                            // value={selectedCategory}
                            // label="Age"
                            label="Category"
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
                            {workspaceCategoryProperties.map((property) => (
                              <MenuItem
                                onClick={() =>
                                  setSelectedCategoryID(property.ID)
                                }
                                value={property.name}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: "var(--hover-bg)",
                                  },
                                  "&.Mui-selected": {
                                    backgroundColor: "var(--hover-bg)",
                                  },
                                }}
                              >
                                {property.name}
                              </MenuItem>
                            ))}

                            {/* <MenuItem value={20}>Twenty</MenuItem> */}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                    {selectedCategory?.properties?.map((property) => (
                      <>
                        {property.type === "single-select" && (
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
                                <Image src={selectIcon} alt="" />{" "}
                                {property.name}
                              </NoteInfo>
                            </TableCell>
                            {/* add multi select */}
                            <TableCell>
                              <ReactSelect
                                // value={selectedValues}
                                value={selectedValues}
                                onChange={handleSelectChange}
                                // options={property.values}
                                options={[
                                  {
                                    value: property.values,
                                    label: property.values,
                                  },
                                ]}
                                isMulti={false}
                                // defaultValues={[options[1]]}
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                    {selectedCategory?.properties?.map((property) => (
                      <>
                        {property.type === "multi-select" && (
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
                                <Image src={multiSelect} alt="" />{" "}
                                {property.name}
                              </NoteInfo>
                            </TableCell>
                            {/* add multi select */}
                            <TableCell>
                              <ReactSelect
                                value={selectedValues}
                                onChange={handleSelectChange}
                                options={[
                                  {
                                    value: property.values,
                                    label: property.values,
                                  },
                                  {
                                    value: property.values,
                                    label: property.values,
                                  },
                                ]}
                                // defaultValues={[options[1], options[2]]}
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}

                    {/* single select */}
                    {selectedCategory?.properties?.map((property) => (
                      <>
                        {property.type === "Text" && (
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
                                <Image src={optionsIcon} alt="" />{" "}
                                {property.name}
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
                                value={property.values}
                                // id="fullWidth"
                                placeholder="Enter content"
                                InputProps={{
                                  style: { padding: 0 },
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
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
