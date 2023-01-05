import _ from "lodash";
import { StockData, toStockData } from "./types";
import { useEffect, useMemo, useState } from "react";

export const useDataLoader = (
  tscode: string,
  step: number = 1,
  size: number = 50
) => {
  const [data, setData] = useState<StockData[]>([]);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const url = "/data/" + tscode + ".csv";
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        setData(csvToObjectArray<StockData>(text));
      });
  }, []);

  const slice = useMemo<StockData[]>(
    () => data.slice(index, index + size),
    [data, index, size]
  );

  const next = () => {
    setIndex((old) => old + step);
  };

  return { next, slice, data };
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
