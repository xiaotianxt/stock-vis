import { useEffect, useMemo } from "react";
import { ReactECharts } from "./ReactEcharts";
import { EChartsOption } from "echarts";
import { useDataLoader } from "./stock-loader";

export const Index = () => {
  // load data
  const { slice, next } = useDataLoader("000002.SZ", 2, 100);
  const option: EChartsOption = useMemo<EChartsOption>(() => {
    return {
      xAxis: {
        type: "category",
        data: slice.map((d) => d.trade_date.format("YYYY-MM-DD")),
        splitLine: { show: false },
      },
      yAxis: {
        type: "value",
        splitLine: { show: false },
      },
      series: [
        {
          type: "candlestick",
          data: slice.map((d) => [d.open, d.close, d.low, d.high]),
          smooth: true,
          showSymbol: false,
        },
      ],
      tooltip: {
        trigger: "axis",
      },
      backgroundColor: "transparent",
    };
  }, [slice]);

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 500);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <div className="w-full h-full flex justify-center items-center font-medium bg-slate-700 text-slate-100">
      <ReactECharts option={option} className="h-full w-full" />
    </div>
  );
};

export default Index;
