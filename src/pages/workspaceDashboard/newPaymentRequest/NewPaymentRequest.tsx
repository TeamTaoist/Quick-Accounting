import {
  FullScreenDialog,
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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactSelect from "../../../components/ReactSelect";
import { useCategoryProperty } from "../../../store/useCategoryProperty";
import { useWorkspace } from "../../../store/useWorkspace";
import useAsync from "../../../hooks/useAsync";
import {
  SafeBalanceResponse,
  getBalances,
} from "@safe-global/safe-gateway-typescript-sdk";
import usePaymentsStore from "../../../store/usePayments";
import { formatBalance } from "../../../utils/number";
import { toast } from "react-toastify";
import { isAddress } from "viem";
import { parseUnits } from "ethers";

interface SubmitRowData {
  recipient: string;
  amount: string;
  currency: string;
}
export interface ReactSelectOption {
  value: string;
  label: string;
}
interface PropertyValues {
  name?: string;
  type?: string;
  values?: string;
}

const NewPaymentRequest = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();

  const { createPaymentRequest, getPaymentRequestList } = usePaymentsStore();

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
  const [propertyValues, setPropertyValues] = useState<{
    [key: string]: PropertyValues;
  }>({});
  const [propertyMultiValues, setPropertyMultiValues] = useState<{
    [key: string]: PropertyValues;
  }>({});

  const handleSelectChange = (
    selectedOptions: ReactSelectOption[],
    name: string,
    type: string
  ) => {
    setSelectedValues(selectedOptions);
    console.log(selectedOptions, name, type);
    const v = selectedOptions?.map((p) => p.value);
    setPropertyMultiValues({
      ...propertyMultiValues,
      [name]: {
        name: name,
        type: type,
        values: selectedOptions.map((option) => option.value).join(";"),
      },
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
    setPropertyValues({
      ...propertyValues,
      [name]: {
        name: name,
        type: type,
        values: selectedOption.value,
      },
    });
    if (selectedOption.value === "") {
      setSelectSingleValue(undefined);
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

  // get assets list
  const { workspace, assetsList, getAssets, getHideAssets } = useWorkspace();

  useEffect(() => {
    const fetchAssetsList = async () => {
      workspace?.vault_wallet && (await getAssets());
      workspace?.vault_wallet && (await getHideAssets());
    };
    fetchAssetsList();
  }, [workspace?.vault_wallet]);
  console.log(assetsList);

  // property text content

  const [textPropertyValues, setTextPropertyValues] = useState<{
    [key: string]: string;
  }>({});

  const handlePropertyText = (e: any, name: string, type: string) => {
    const value = e.target.value;
    setTextPropertyValues({ ...textPropertyValues, [name]: value });
    if (e.target.value === "") {
      setTextPropertyValues({});
    }
  };
  const handleSelectedCategory = (id: number) => {
    setSelectedCategoryID(id);
    setPropertyValues({});
    setPropertyMultiValues({});
    setTextPropertyValues({});
    setSelectSingleValue(undefined);
    setSelectedValues([]);
  };

  const paymentRequestBody = {
    category_id: selectedCategory?.ID,
    category_name: selectedCategory?.name,
    category_properties: [
      ...Object.keys(propertyValues).map(
        (key) =>
          ({
            name: key as string,
            type: "single-select",
            values: propertyValues[key as keyof PropertyValues]?.values,
          } as ICategoryProperties)
      ),
      ...Object.keys(propertyMultiValues).map(
        (key) =>
          ({
            name: key as string,
            type: "multi-select",
            values: propertyMultiValues[key as keyof PropertyValues]?.values,
          } as ICategoryProperties)
      ),
      ...Object.keys(textPropertyValues).map(
        (key) =>
          ({
            name: key,
            type: "Text",
            values: textPropertyValues[key],
          } as ICategoryProperties)
      ),
    ],
    rows: rows.map((row) => {
      const token = assetsList?.find(
        (item) => item.tokenInfo.address === row.currency
      );
      return token
        ? {
            amount: row.amount,
            currency_contract_address: row.currency,
            currency_name: token?.tokenInfo.symbol!,
            decimals: token.tokenInfo.decimals,
            recipient: row.recipient,
          }
        : {
            amount: row.amount,
            currency_contract_address: row.currency,
            currency_name: "",
            decimals: 18,
            recipient: row.recipient,
          };
    }),
  };

  const checkAllFields = () => {
    if (!paymentRequestBody.rows.length) {
      return;
    }
    for (const item of paymentRequestBody.rows) {
      if (!item.recipient || !item.amount || !item.currency_contract_address) {
        toast.error("Please fill all fields");
        return;
      }
      if (!isAddress(item.recipient)) {
        toast.error(`Invalid address: ${item.recipient}`);
        return;
      }
      if (Number(item.amount) <= 0) {
        toast.error(`Invalid amount: ${item.amount}`);
        return;
      }
      try {
        const amountBigInt = parseUnits(item.amount, item.decimals);
        const selectToken = assetsList?.find(
          (s) => s.tokenInfo.address === item.currency_contract_address
        );
        if (BigInt(selectToken?.balance || 0) < amountBigInt) {
          toast.error(
            `Insufficient balance: ${item.amount} ${item.currency_name}`
          );
          return;
        }
      } catch (error) {
        toast.error(`Invalid decimal amount: ${item.amount}`);
        return;
      }
    }
    return true;
  };

  // submit
  const handlePaymentRequestSubmit = () => {
    // check all of fields
    if (!checkAllFields()) {
      return;
    }
    createPaymentRequest(Number(id), paymentRequestBody, navigate).then((r) => {
      if (r) {
        onClose();
        const target_path = `/workspace/${id}/payment-request`;
        if (pathname === target_path) {
          getPaymentRequestList(Number(id), false);
        } else {
          navigate(target_path);
        }
      }
    });
  };
  console.log(paymentRequestBody);

  return (
    <FullScreenDialog>
      <CreateRequest>
        <Request>
          <RequestHeader>
            <h1>New payment request</h1>
            <img onClick={onClose} src={cancel} alt="" />
          </RequestHeader>
          <TableSection>
            <TableContainer
              sx={{
                boxShadow: "none",
                border: "1px solid var(--border-table)",
                borderRadius: "10px",
                // maxWidth: 680,
                // margin: "26px auto",
              }}
            >
              <Table sx={{ width: "100%" }} aria-label="simple table">
                <TableHead style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: 200,
                        borderRight: "1px solid var(--border-table)",
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                    >
                      Recipient
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 150,
                        borderRight: "1px solid var(--border-table)",
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 200,
                        border: 0,
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                    >
                      Currency
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 50,
                        border: 0,
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* <TableRow sx={{ td: { border: 1, padding: 0 } }}> */}
                  {rows?.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        height: "30px",
                      }}
                    >
                      <TableCell
                        sx={{
                          border: "1px solid var(--border-table)",
                          padding: 0,
                          borderLeft: 0,
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
                        }}
                      >
                        <TextField
                          sx={{
                            "& fieldset": { border: "none" },
                          }}
                          size="small"
                          fullWidth
                          autoComplete="off"
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
                          {assetsList?.map((item, i) => (
                            <MenuItem
                              key={i}
                              value={item.tokenInfo.address}
                              disabled={item.hidden}
                              sx={{
                                "&:hover": {
                                  backgroundColor: "var(--hover-bg)",
                                },
                                "&.Mui-selected": {
                                  backgroundColor: "var(--hover-bg)",
                                },
                              }}
                            >
                              {item.tokenInfo.symbol}(
                              {formatBalance(
                                item.balance,
                                item.tokenInfo.decimals
                              )}
                              )
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
              {/* </TableContainer> */}
              {/* note info */}
              <NoteInformation style={{ marginTop: "30px" }}>
                <h3>Note Information</h3>

                {/* <TableContainer> */}
                <Table sx={{ width: "100%" }} aria-label="simple table">
                  <TableBody>
                    <TableRow
                      sx={{
                        td: {
                          padding: 0,
                          paddingInline: "16px",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          height: 1,
                          width: 200,
                          borderRight: "1px solid var(--border-table)",
                        }}
                      >
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
                                  handleSelectedCategory(property.ID)
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
                                padding: 0,
                                paddingInline: "16px",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                height: 1,
                                width: 200,
                                borderRight: "1px solid var(--border-table)",
                              }}
                            >
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
                                isDisabled={false}
                                // onChange={handleSelectSingleChange}
                                onChange={(selectedOption: ReactSelectOption) =>
                                  handleSelectSingleChange(
                                    selectedOption,
                                    property.name,
                                    property.type
                                  )
                                }
                                // options={property.values}
                                options={property.values
                                  .split(";")
                                  .map((v) => ({
                                    value: v,
                                    label: v,
                                  }))}
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
                        )}
                      </>
                    ))}
                    {selectedCategory?.properties?.map((property) => (
                      <>
                        {property.type === "multi-select" && (
                          <TableRow
                            sx={{
                              td: {
                                padding: 0,
                                paddingInline: "16px",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                height: 1,
                                width: 200,
                                borderRight: "1px solid var(--border-table)",
                              }}
                            >
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
                            key={property.name}
                            sx={{
                              td: {
                                padding: 0,
                                paddingInline: "16px",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                height: 1,
                                width: 200,
                                borderRight: "1px solid var(--border-table)",
                              }}
                            >
                              <NoteInfo>
                                <Image src={optionsIcon} alt="" />{" "}
                                {property.name}
                              </NoteInfo>
                            </TableCell>
                            <TableCell>
                              <TextField
                                sx={{
                                  "& fieldset": { border: "none" },
                                }}
                                size="small"
                                fullWidth
                                value={textPropertyValues[property.name] || ""}
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
                {/* </TableContainer> */}
              </NoteInformation>
            </TableContainer>
            <Btn>
              <RequestSubmit onClick={handlePaymentRequestSubmit}>
                Submit
              </RequestSubmit>
            </Btn>
          </TableSection>
        </Request>
      </CreateRequest>
    </FullScreenDialog>
  );
};

export default NewPaymentRequest;
