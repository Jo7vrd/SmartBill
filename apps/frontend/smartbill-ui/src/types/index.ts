// src/types/index.ts
export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  assignees: string[]; 
}

export interface ReceiptData {
  merchantName: string;
  date: string;
  items: ReceiptItem[];
  subTotal: number;
  tax: number;
  total: number;
}