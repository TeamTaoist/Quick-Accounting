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
import { useWorkspace } from "../../../store/useWorkspace";
import useAsync from "../../../hooks/useAsync";
import {
  SafeBalanceResponse,
  getBalances,
} from "@safe-global/safe-gateway-typescript-sdk";
import usePaymentsStore from "../../../store/usePayments";

interface SubmitRowData {
  recipient: string;
  amount: string;
  currency: string;
}
interface ReactSelectOption {
  value: string;
  label: string;
}

const NewPaymentRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { createPaymentRequest } = usePaymentsStore();

  const [category, setCategory] = useState("");

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  // add new payment request
  const [rows, setRows] = useState([
    { recipient: "", amount: "", currency: "" },
  ]);

  const handleAddPayment = () => {
    setRows([...rows, { recipient: "", amount: "", currency: "" }]);
  };
  // react select values
  const [selectSingleValue, setSelectSingleValue] =
    useState<ReactSelectOption>();
  const [selectedValues, setSelectedValues] = useState<ReactSelectOption[]>([]);

  // property values
  const [propertyValues, setPropertyValues] = useState<any>({});
  const [propertyMultiValues, setPropertyMultiValues] = useState<any>({});

  const handleSelectChange = (
    selectedOptions: ReactSelectOption[],
    name: string,
    type: string
  ) => {
    setSelectedValues(selectedOptions);
    console.log(selectedOptions, name, type);
    const v = selectedOptions?.map((p) => p.value);
    setPropertyMultiValues({
      name: name,
      type: type,
      values: v.join(";"),
    });
    if (v.length === 0) {
      setPropertyMultiValues({});
    }
  };

  const handleSelectSingleChange = (
    selectedOption: ReactSelectOption,
    name: string,
    type: string
  ) => {
    setSelectSingleValue(selectedOption);
    setPropertyValues({ name: name, type: type, values: selectedOption.value });
    if (selectedOption.value === "") {
      setPropertyMultiValues({});
    }
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

  const selectedCategory = workspaceCategoryProperties?.find(
    (f) => f.ID === selectedCategoryID
  );

  const handleDeletePayment = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const workspaceId = Number(id);
  useEffect(() => {
    getWorkspaceCategoryProperties(workspaceId);
  }, [getWorkspaceCategoryProperties, workspaceId]);

  // safe balance from assets
  const { workspace } = useWorkspace();

  const [data, error, loading] = useAsync<SafeBalanceResponse>(
    () => {
      return getBalances(String(workspace?.chain_id), workspace?.vault_wallet);
    },
    [workspace],
    false
  );

  // property text content
  const [propertyContent, setPropertyContent] = useState<string>("");
  const [proPertyTextValue, setPropertyTextValue] = useState<any>({});
  const handlePropertyText = (e: any, name: string, type: string) => {
    setPropertyContent(e.target.value);
    setPropertyTextValue({
      name: name,
      type: type,
      values: e.target.value,
    });
    if (e.target.value === "") {
      setPropertyTextValue({});
    }
  };
  const paymentRequestBody = {
    category_id: selectedCategory?.ID,
    category_name: selectedCategory?.name,
    category_properties: [
      ...(Object.keys(propertyValues).length !== 0 ? [propertyValues] : []),
      ...(Object.keys(propertyMultiValues).length !== 0
        ? [propertyMultiValues]
        : []),
      ...(Object.keys(proPertyTextValue).length !== 0
        ? [proPertyTextValue]
        : []),
    ],
    rows: rows.map((row) => ({
      amount: row.amount,
      currency_contract_address: row.currency,
      currency_name: row.currency,
      recipient: row.recipient,
    })),
  };
  console.log(paymentRequestBody);
  // submit
  const handlePaymentRequestSubmit = () => {
    createPaymentRequest(paymentRequestBody, navigate);
  };

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
                  {rows?.map((row, index) => (
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
                          {data?.items.map((item) => (
                            <MenuItem
                              value={item.tokenInfo.symbol}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "var(--hover-bg)",
                                },
                                "&.Mui-selected": {
                                  backgroundColor: "var(--hover-bg)",
                                },
                              }}
                            >
                              {item.tokenInfo.symbol}
                            </MenuItem>
                          ))}

                          {/* <MenuItem value="Option2">Twenty</MenuItem> */}
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
                            value={category}
                            label={category}
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
                            {workspaceCategoryProperties?.map((property) => (
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
                                value={selectSingleValue}
                                // onChange={handleSelectSingleChange}
                                onChange={(selectedOption: ReactSelectOption) =>
                                  handleSelectSingleChange(
                                    selectedOption,
                                    property.name,
                                    property.type
                                  )
                                }
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
                            {/* {propertyObjects.push({
                              type: property.type,
                              name: property.name,
                              values: property.values,
                            })} */}
                          </TableRow>
                          // {
                          //   propertyObjects
                          // }
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
                            {}
                            {/* add multi select */}
                            <TableCell>
                              <ReactSelect
                                value={selectedValues}
                                onChange={(
                                  selectedOptions: ReactSelectOption[]
                                ) =>
                                  handleSelectChange(
                                    selectedOptions,
                                    property.name,
                                    property.type
                                  )
                                }
                                options={property.values
                                  .split(";")
                                  .map((v) => ({
                                    value: v,
                                    label: v,
                                  }))}
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
                                value={propertyContent}
                                // id="fullWidth"
                                placeholder="Enter content"
                                onChange={(e) =>
                                  handlePropertyText(
                                    e,
                                    property.name,
                                    property.type
                                  )
                                }
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
              <RequestSubmit onClick={handlePaymentRequestSubmit}>
                Submit
              </RequestSubmit>
            </Btn>
          </TableSection>
        </Request>
      </CreateRequest>
    </Header>
  );
};

export default NewPaymentRequest;
