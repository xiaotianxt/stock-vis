import moment from "moment";
import { Moment } from "moment";
import create from "zustand";

export type StoreData = {
  date: Moment;
  setDate: (date: Moment) => void;
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
  };
});
