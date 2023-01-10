import _ from "lodash";
import { DataLoad, StockData, toStockData } from "./types";
import { useEffect, useMemo, useState } from "react";
import moment, { Moment } from "moment";
import { useStore } from "zustand";
import { useStockStore } from "../store";

export const useDataLoaders = (
  tscodes: string[],
  step: number = 1,
  size: number = 50
) => {
  const loaders = tscodes.map((tscode) => useDataLoader(tscode));
  const { date, setDate } = useStockStore();
  const [slices, setSlices] = useState<StockData[][]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [end, setEnd] = useState(false);

  const next = () => {
    if (date === undefined) return;
    const start = date.clone().add(step, "months");
    const end = start.clone().add(size, "months");
    const slices = loaders.map((loader, idx) => {
      loader.next(start, end);
      return loader.slice;
    });
    setDate(start);
    setSlices(slices);
    const months = [];
    for (let date = start.clone(); date < end; date.add(1, "months")) {
      months.push(date.format("YYYY-MM-DD"));
    }
    setMonths(months);
    if (start > moment("20220631", "YYYYMMDD")) {
      setEnd(true);
    }
  };

  return { slices, next, months, end };
};

export const useDataLoader = (tscode: string) => {
  const [data, setData] = useState<StockData[]>([]);
  const [slice, setSlice] = useState<StockData[]>([]);

  useEffect(() => {
    const url = "/data/" + tscode + ".csv";
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        setData(csvToObjectArray<StockData>(text));
      });
  }, []);

  const next = (start: Moment, end: Moment) => {
    const first = data?.[0]?.trade_date;
    if (first === undefined) return;
    const from = _.sortedIndexBy(
      data,
      { trade_date: start } as StockData,
      (item) => item.trade_date
    );
    const to = _.sortedIndexBy(
      data,
      { trade_date: end } as StockData,
      (item) => item.trade_date
    );
    setSlice(from == to ? [] : data.slice(from, to));
  };

  return {
    next,
    slice,
    data,
  } as DataLoad;
};

function csvToObjectArray<ObjectType extends object>(
  csvString: string
): ObjectType[] {
  const csvRowArray = csvString.split(/\n/);
  const headerCellArray = trimQuotes(csvRowArray.shift()?.split(","));
  const objectArray = csvRowArray.map((row) => {
    return toStockData(headerCellArray, trimQuotes(row.split(",")));
  });

  return objectArray as ObjectType[];
}

function trimQuotes(stringArray: string[] | undefined) {
  if (!stringArray) return [];
  return stringArray.map((x) => _.trim(x, '"'));
}
