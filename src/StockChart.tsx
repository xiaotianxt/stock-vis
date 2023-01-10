import { useEffect, useMemo } from "react";
import { ReactECharts } from "./ReactEcharts";
import { EChartsOption } from "echarts";
import { useDataLoaders } from "./stock-loader";
import { useEventLoader } from "./event-loader";

export const Index = () => {
  const files = ["out000002.SZ", "outSSEC", "outSZREI"];
  const names = ["万达", "上证指数", "房地产指数"];
  // load data
  const { slices, next, months, end } = useDataLoaders(files, 1, 10);
  const option: EChartsOption = useMemo<EChartsOption>(() => {
    const series: EChartsOption["series"] = slices.map((slice, idx) => {
      const name = names[idx];
      return {
        name,
        type: "line",
        stack: "Total",
        smooth: true,
        data: [
          ...Array(months.length - slice.length).fill(undefined),
          ...slice.map((slice) => slice.close),
        ],
        yAxisIndex: idx === 0 ? 0 : 1,
      };
    });

    return {
      xAxis: {
        type: "category",
        splitLine: { show: false },
        data: months,
      },
      yAxis: [
        {
          splitLine: { show: false },
        },
        {
          splitLine: { show: false },
        },
      ],
      series,
      tooltip: {
        trigger: "axis",
      },
      backgroundColor: "transparent",
      animationEasing: "bounceInOut",
    };
  }, [slices]);

  useEffect(() => {
    if (end) return;
    const interval = setInterval(() => {
      next();
    }, 500);
    return () => clearInterval(interval);
  }, [next, end]);

  return (
    <div className="py-[5em] w-full h-full flex justify-center items-center font-medium bg-slate-700 text-slate-100">
      <ReactECharts option={option} className="h-full w-full" />
    </div>
  );
};

export default Index;
