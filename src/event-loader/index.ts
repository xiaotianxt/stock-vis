import { useEffect, useState } from "react";
import { StockEvent } from "./types";
import _ from "lodash";
import { useStockStore } from "../store";

const FILENAME = "/data/events.json";
export const useEventLoader = () => {
  const [event, setEvent] = useState<StockEvent>();
  const [events, setEvents] = useState<StockEvent[]>();
  const { date } = useStockStore();

  useEffect(() => {
    fetch(FILENAME)
      .then((res) => res.json())
      .then((json) => {
        const events = json as StockEvent[];
        setEvents(events.filter((event) => event.title));
      });
  });

  useEffect(() => {
    const index = _.sortedIndexBy(
      events,
      { date: date?.format("YYYY-MM") } as StockEvent,
      (event) => event.date
    );
    setEvent(events?.[index]);
  }, [date, events]);

  return { event };
};
