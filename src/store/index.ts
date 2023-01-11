import moment from "moment";
import { Moment } from "moment";
import create from "zustand";
import { StockData } from "../stock-loader/types";

export type StoreData = {
  date: Moment;
  setDate: (date: Moment) => void;
  kind: keyof StockData;
  setKind: (key: keyof StockData) => void;
  stop: boolean;
  setStop: (stop?: boolean) => void;
};

export const useStockStore = create<StoreData>((set) => {
  return {
    date: moment("2000-01-01", "YYYY-MM-DD"),
    setDate: (date: Moment) => {
      set((old) => ({
        ...old,
        date,
      }));
    },
    kind: "close",
    setKind: (kind: keyof StockData) => {
      set((old) => ({
        ...old,
        kind,
      }));
    },
    stop: false,
    setStop: (stop?: boolean) => {
      set((old) => ({
        ...old,
        stop: stop === undefined ? !old.stop : stop,
      }));
    },
  };
});
