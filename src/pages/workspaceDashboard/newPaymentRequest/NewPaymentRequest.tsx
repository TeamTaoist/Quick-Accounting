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
  NoteHeader,
  HeaderTitle,
  WorkspaceInfo,
  WorkspaceLogo,
  WorkspaceDetails,
  WorkspaceItem,
  UpdateInfo,
  PaymentRequestInput,
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
import checkCircle from "../../../assets/workspace/check-circle.svg";

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
import { isAddress, zeroAddress } from "viem";
import { parseUnits } from "ethers";
import { useDomainStore } from "../../../store/useDomain";
import { useLoading } from "../../../store/useLoading";
import { formatTime } from "../../../utils/time";

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
  const { setLoading } = useLoading();

  const { createPaymentRequest, getPaymentRequestList } = usePaymentsStore();
  const { parseENS, parseSNS } = useDomainStore();

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
  // useEffect(() => {
  //   getWorkspaceCategoryProperties(workspaceId);
  // }, [getWorkspaceCategoryProperties, workspaceId]);

  // get assets list
  const { workspace, assetsList, getAssets, getHideAssets } = useWorkspace();

  // useEffect(() => {
  //   const fetchAssetsList = async () => {
  //     workspace?.vault_wallet && (await getAssets());
  //     workspace?.vault_wallet && (await getHideAssets());
  //   };
  //   fetchAssetsList();
  // }, [workspace?.vault_wallet]);
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
  const [datePicker, setDatePicker] = useState<{
    [key: string]: string;
  }>({});
  console.log(datePicker);

  const handleDatePickerProperty = (e: any, name: string) => {
    const value = e.target.value;
    setDatePicker({ ...datePicker, [name]: value });
    if (e.target.value === "") {
      setDatePicker({});
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
      ...Object.keys(datePicker).map(
        (key) =>
          ({
            name: key,
            type: "date-picker",
            values: datePicker[key],
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
  console.log("body", paymentRequestBody);

  const checkAllFields = async () => {
    if (!paymentRequestBody.rows.length) {
      return;
    }
    const sns_check_list: string[] = [];
    const ens_check_list: string[] = [];
    for (const item of paymentRequestBody.rows) {
      if (!item.recipient || !item.amount || !item.currency_contract_address) {
        toast.error("Please fill all fields");
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
      if (item.recipient.endsWith(".seedao")) {
        sns_check_list.push(item.recipient);
      } else if (item.recipient.endsWith(".eth")) {
        ens_check_list.push(item.recipient);
      } else if (!isAddress(item.recipient)) {
        toast.error(`Invalid address: ${item.recipient}`);
        return;
      }
    }
    const name_address_map = new Map<string, string>();
    if (sns_check_list.length) {
      const res = await parseSNS(Array.from(new Set(sns_check_list)));
      console.log("parse sns", res);
      for (let i = 0; i < sns_check_list.length; i++) {
        if (res[i] === zeroAddress) {
          toast.error(`Invalid SNS: ${sns_check_list[i]}`);
          return;
        }
        name_address_map.set(sns_check_list[i], res[i]);
      }
    }

    if (ens_check_list.length) {
      const res = await parseENS(
        Array.from(new Set(ens_check_list)),
        workspace.chain_id
      );
      console.log("parse ens", res);
      for (let i = 0; i < ens_check_list.length; i++) {
        if (!res[i]) {
          toast.error(`Invalid ENS: ${ens_check_list[i]}`);
          return;
        }
        name_address_map.set(ens_check_list[i], res[i]!);
      }
    }
    return name_address_map;
  };

  // submit
  const handlePaymentRequestSubmit = async () => {
    // check all of fields
    setLoading(true);
    const name_address_map = await checkAllFields();
    setLoading(false);

    if (!name_address_map) {
      return;
    }

    createPaymentRequest(
      Number(id),
      {
        ...paymentRequestBody,
        rows: paymentRequestBody.rows.map((row) => {
          return {
            ...row,
            recipient: name_address_map.get(row.recipient) || row.recipient,
          };
        }),
      },
      navigate
    ).then((r) => {
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
            <HeaderTitle>
              <h1>New payment request</h1>
              <img onClick={onClose} src={cancel} alt="" />
            </HeaderTitle>
            <WorkspaceInfo>
              <WorkspaceItem>
                <WorkspaceLogo>
                  {workspace.avatar === "" ? (
                    <p>{workspace.name.slice(0, 1)}</p>
                  ) : (
                    <img src={workspace.avatar} alt={workspace.name} />
                  )}
                </WorkspaceLogo>
                <WorkspaceDetails>
                  <h6>{workspace.name}</h6>
                  <p>{workspace.vault_wallet}</p>
                </WorkspaceDetails>
              </WorkspaceItem>
              <UpdateInfo>
                <img src={checkCircle} alt="" />
                <p>Last updated at {formatTime(workspace.UpdatedAt)}</p>
              </UpdateInfo>
            </WorkspaceInfo>
          </RequestHeader>
          <TableSection>
            <TableContainer
              sx={{
                boxShadow: "none",
                border: "1px solid var(--clr-gray-200)",
                borderRadius: "6px",
                // maxWidth: 680,
                // margin: "26px auto",
              }}
            >
              <Table sx={{ width: "100%" }} aria-label="simple table">
                <TableHead style={{ backgroundColor: "var(--clr-gray-200)" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: 200,
                        // borderRight: "1px solid var(--border-table)",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Recipient
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 150,
                        // borderRight: "1px solid var(--border-table)",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 200,
                        border: 0,
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Currency
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 50,
                        border: 0,
                        fontSize: "14px",
                        fontWeight: "600",
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
                        // border: "1px solid red",
                      }}
                    >
                      <TableCell
                        sx={{
                          paddingTop: 0,
                          paddingBottom: 0,
                          width: "40%",
                          // borderLeft: 0,
                        }}
                      >
                        <PaymentRequestInput
                          placeholder="Enter content"
                          value={row.recipient}
                          onChange={(e) =>
                            handleServiceChange(e, index, "recipient")
                          }
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: 0,
                          paddingBottom: 0,
                          width: "30%",
                        }}
                      >
                        <PaymentRequestInput
                          type="text"
                          placeholder="0.00"
                          value={row.amount}
                          onChange={(e) =>
                            handleServiceChange(e, index, "amount")
                          }
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: 0,
                          paddingBottom: 0,
                          width: "30%",
                        }}
                      >
                        <Select
                          // labelId={`dropdown-${index}-label`}
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
                                style={{ marginRight: "20px", width: "10px" }}
                              />
                            </InputAdornment>
                          )}
                          sx={{
                            minWidth: "100%",
                            height: "40px",
                            "&.MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "var(--clr-gray-200)",
                              },
                              "&:hover fieldset": {
                                borderColor: "var(--clr-gray-200)",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "var(--clr-gray-200)",
                              },
                            },
                            "& fieldset": { border: "1px solid red" },
                          }}
                        >
                          {assetsList?.map(
                            (item, i) =>
                              !item.hidden && (
                                <MenuItem
                                  key={i}
                                  value={item.tokenInfo.address}
                                  sx={{
                                    "&:hover": {
                                      backgroundColor: "var(--clr-gray-100)",
                                    },
                                    "&.Mui-selected": {
                                      backgroundColor: "var(--clr-gray-200)",
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
                              )
                          )}
                        </Select>
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingTop: 0,
                          paddingBottom: 0,
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
              <NoteInformation>
                <NoteHeader>
                  <h3>Note Information</h3>
                </NoteHeader>

                {/* <TableContainer> */}
                <Table sx={{ width: "100%" }} aria-label="simple table">
                  <TableBody>
                    <TableRow
                      sx={{
                        td: {
                          padding: 1,
                          paddingInline: "16px",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          height: 1,
                          width: 200,
                          // borderRight: "1px solid var(--border-table)",
                          fontSize: "16px",
                          fontWeight: "500",
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
                            onChange={handleCategoryChange}
                            size="small"
                            IconComponent={() => (
                              <InputAdornment position="start">
                                <img
                                  src={arrowBottom}
                                  alt="Custom Arrow Icon"
                                  style={{ marginRight: "20px" }}
                                />
                              </InputAdornment>
                            )}
                            // sx={{
                            //   minWidth: "100%",
                            //   "& fieldset": { border: "none" },
                            // }}
                            sx={{
                              minWidth: "100%",
                              height: "40px",
                              "& .MuiSelect-select": {
                                display: "block",
                              },
                              "&.MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "var(--clr-gray-200)",
                                },
                                "&:hover fieldset": {
                                  borderColor: "var(--clr-gray-200)",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "var(--clr-gray-200)",
                                },
                              },
                              // "& fieldset": { border: "none" },
                              "& .MuiInputLabel-root": { display: "none" },
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
                                    backgroundColor: "var(--clr-gray-100)",
                                  },
                                  "&.Mui-selected": {
                                    backgroundColor: "var(--clr-gray-200)",
                                  },
                                }}
                              >
                                {property.name}
                              </MenuItem>
                            ))}
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
                                // borderRight: "1px solid var(--border-table)",
                                fontSize: "16px",
                                fontWeight: "500",
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
                                fontSize: "16px",
                                fontWeight: "500",
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

                    {/* text */}
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
                                fontSize: "16px",
                                fontWeight: "500",
                              }}
                            >
                              <NoteInfo>
                                <Image src={optionsIcon} alt="" />{" "}
                                {property.name}
                              </NoteInfo>
                            </TableCell>
                            <TableCell>
                              {/* <TextField
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
                              /> */}
                              <PaymentRequestInput
                                placeholder="Enter content"
                                value={textPropertyValues[property.name] || ""}
                                onChange={(e) =>
                                  handlePropertyText(
                                    e,
                                    property.name,
                                    property.type
                                  )
                                }
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                    {/* date picker */}
                    {selectedCategory?.properties?.map((property) => (
                      <>
                        {property.type === "date-picker" && (
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
                                fontSize: "16px",
                                fontWeight: "500",
                              }}
                            >
                              <NoteInfo>
                                <Image src={multiSelect} alt="" />{" "}
                                {property.name}
                              </NoteInfo>
                            </TableCell>
                            <TableCell>
                              {/* <TextField
                                sx={{
                                  "& fieldset": { border: "none" },
                                }}
                                size="small"
                                fullWidth
                                value={datePicker[property.name] || ""}
                                placeholder="yyyy-mm-dd"
                                type="date"
                                onChange={(e) =>
                                  handleDatePickerProperty(e, property.name)
                                }
                                InputProps={{
                                  style: { padding: 0 },
                                }}
                              /> */}
                              <PaymentRequestInput
                                placeholder="yyyy-mm-dd"
                                type="date"
                                onChange={(e) =>
                                  handleDatePickerProperty(e, property.name)
                                }
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
