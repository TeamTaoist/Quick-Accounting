interface FakeData {
  id: number;
  recipient: string;
  amount: number;
  category: string;
  status: string;
  date: string;
  currency: string;
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
  },
  {
    id: 2,
    recipient: "0x4d4bdsfsdf54322015",
    amount: 75,
    category: "Category name",
    status: "Rejected",
    date: "2022-01-08",
    currency: "USDT",
  },
  {
    id: 3,
    recipient: "0x4d4bdsfsdf54322015",
    amount: 200,
    category: "Category name",
    status: "Rejected",
    date: "2022-01-10",
    currency: "USDT",
  },
  {
    id: 4,
    recipient: "0x4d4bdsfsdf54322015",
    amount: 120,
    category: "Category name",
    status: "Rejected",
    date: "2022-01-15",
    currency: "USDT",
  },
];

export default data;
