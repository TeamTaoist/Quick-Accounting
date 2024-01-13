interface FakeData {
  id: number;
  recipient: string;
  amount: number;
  category: string;
  status: string;
  date: string;
  currency: string;
  workspaceName: string;
  safe: string;
}

const data: FakeData[] = [
  {
    id: 1,
    recipient: "0x4d4bdsfsdf54322015",
    amount: 150,
    category: "Category name",
    status: "Rejected",
    date: "2022-01-05",
    currency: "USDT",
    workspaceName: "workspace name",
    safe: "0x4d4bdsfsdf54322015",
  },
  {
    id: 2,
    recipient: "0x4d4bdsfsdf54322015",
    amount: 75,
    category: "Category name",
    status: "pending",
    date: "2022-01-08",
    currency: "USDT",
    workspaceName: "workspace name",
    safe: "0x4d4bdsfsdf54322015",
  },
  {
    id: 3,
    recipient: "0x4d4bdsfsdf54322015",
    amount: 200,
    category: "Category name",
    status: "Rejected",
    date: "2022-01-10",
    currency: "USDT",
    workspaceName: "workspace name",
    safe: "0x4d4bdsfsdf54322015",
  },
  {
    id: 4,
    recipient: "0x4d4bdsfsdf54322015",
    amount: 120,
    category: "Category name",
    status: "Executed",
    date: "2022-01-15",
    currency: "USDT",
    workspaceName: "workspace name",
    safe: "0x4d4bdsfsdf54322015",
  },
];

export default data;
