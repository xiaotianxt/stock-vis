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
  }, []);

  useEffect(() => {
    const realDate = date?.clone()?.add(10, "months")?.format("YYYY-MM");
    const index = _.sortedIndexBy(
      events,
      { date: realDate } as StockEvent,
      (event) => event.date
    );
    const event = events?.[index - 1];
    setEvent(event);
  }, [date]);

  return { event };
};
