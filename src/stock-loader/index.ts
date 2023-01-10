import _ from "lodash";
import { DataLoad, StockData, toStockData } from "./types";
import { useEffect, useMemo, useState } from "react";
import { Moment } from "moment";

export const useDataLoaders = (
  tscodes: string[],
  step: number = 1,
  size: number = 50
) => {
  const loaders = tscodes.map((tscode) => useDataLoader(tscode));
  const startDates = useMemo(() => {
    return loaders.map((loader) => loader.data?.[0]?.trade_date);
  }, [loaders[0].data]);
  const [date, setDate] = useState<Moment>();
  const [slices, setSlices] = useState<StockData[][]>([]);
  const [weeks, setWeeks] = useState<string[]>([]);

  useEffect(() => {
    setDate(_.min(startDates)?.subtract(size, "weeks")?.clone());
  }, [startDates]);

  const next = () => {
    if (date === undefined) return;
    const start = date.clone().add(step, "weeks");
    const end = start.clone().add(size, "weeks");
    const slices = loaders.map((loader, idx) => {
      loader.next(start, end);
      return loader.slice;
    });
    setDate(start);
    setSlices(slices);
    const weeks = [];
    for (let date = start.clone(); date < end; date.add(1, "weeks")) {
      weeks.push(date.format("YYYY-MM-DD"));
    }
    setWeeks(weeks);
  };

  return { slices, next, weeks };
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
