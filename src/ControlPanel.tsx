import moment from "moment";
import { StockData } from "./stock-loader/types";
import { useStockStore } from "./store";

export const Index = () => {
  const { setKind, stop, kind, setStop, setDate } = useStockStore();
  return (
    <div className="fixed right-0 bottom-0 m-4 p-2 rounded flex items-center gap-2">
      <div className="flex justify-center items-center">
        <select
          id="countries"
          className="block p-2.5 h-full bg-slate-200 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(v) => {
            setKind(v.target.value as keyof StockData);
          }}
        >
          <option value="open" selected={kind == "open"}>
            开盘
          </option>
          <option value="close" selected={kind == "close"}>
            收盘
          </option>
          <option value="high" selected={kind == "high"}>
            最高
          </option>
          <option value="low" selected={kind == "low"}>
            最低
          </option>
        </select>
      </div>
      <button
        type="button"
        className="block p-2.5 h-full bg-slate-200 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onClick={() => setStop()}
      >
        {stop ? "Start" : "Stop"}
      </button>
      <button
        type="button"
        className="block p-2.5 h-full bg-slate-200 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onClick={() => setDate(moment("2000-01-01", "YYYY-MM-DD"))}
      >
        Restart
      </button>
    </div>
  );
};

export default Index;
