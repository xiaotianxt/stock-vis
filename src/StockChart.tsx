import { useEffect, useMemo } from "react";
import { ReactECharts } from "./ReactEcharts";
import { EChartsOption } from "echarts";
import { useDataLoaders } from "./stock-loader";

export const Index = () => {
  const files = ["out000002.SZ", "outSSEC", "outSZREI"];
  const names = ["万达", "上证指数", "房地产指数"];
  // load data
  const { slices, next, weeks } = useDataLoaders(files, 1, 10);
  const option: EChartsOption = useMemo<EChartsOption>(() => {
    const series: EChartsOption["series"] = slices.map((slice, idx) => {
      const name = names[idx];
      return {
        name,
        type: "line",
        stack: "Total",
        smooth: true,
        data: [
          ...Array(weeks.length - slice.length).fill(undefined),
          ...slice.map((slice) => slice.close),
        ],
        yAxisIndex: idx === 0 ? 0 : 1,
      };
    });

    return {
      xAxis: {
        type: "category",
        splitLine: { show: false },
        data: weeks,
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
