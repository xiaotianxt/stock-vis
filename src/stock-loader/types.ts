import _ from "lodash";
import moment, { Moment } from "moment";

export type StockData = {
  trade_date: Moment;
  close: number;
  open: number;
  high: number;
  low: number;
  vol: number;
  pct_chg: number;
};

export function toStockData(header: string[], row: string[]): StockData {
  return {
    trade_date: moment(row[header.indexOf("trade_date")], "YYYYMMDD"),
    close: parseFloat(row[header.indexOf("close")]),
    open: parseFloat(row[header.indexOf("open")]),
    high: parseFloat(row[header.indexOf("high")]),
    low: parseFloat(row[header.indexOf("low")]),
    vol: parseFloat(row[header.indexOf("vol")]),
    pct_chg: parseFloat(row[header.indexOf("pct_chg")]),
  };
}
