import _ from "lodash";
import moment, { Moment } from "moment";

export type StockData = {
  trade_date: Moment;
  date: string;
  close: number;
  open: number;
  high: number;
  low: number;
};

export function toStockData(header: string[], row: string[]): StockData {
  return {
    trade_date: moment(row[header.indexOf("trade_date")], "YYYY-MM-DD"),
    date: row[header.indexOf("trade_date")],
    close: parseFloat(row[header.indexOf("close")]),
    open: parseFloat(row[header.indexOf("open")]),
    high: parseFloat(row[header.indexOf("high")]),
    low: parseFloat(row[header.indexOf("low")]),
  };
}

export type DataLoad = {
  next: (start: Moment, end: Moment) => void;
  slice: StockData[];
  data: StockData[];
  start: boolean;
};
