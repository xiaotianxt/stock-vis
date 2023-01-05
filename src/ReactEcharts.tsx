import { useRef, useEffect, ComponentProps } from "react";
import { EChartsOption, SetOptionOpts, registerTheme } from "echarts";
import { CanvasRenderer } from "echarts/renderers";
import { init, getInstanceByDom, use, ECharts } from "echarts/core";
import { ScatterChart, LineChart, BarChart } from "echarts/charts";
import {
  LegendComponent,
  GridComponent,
  TooltipComponent,
  ToolboxComponent,
  TitleComponent,
  DataZoomComponent,
} from "echarts/components";

// Register the required components
use([
  LegendComponent,
  ScatterChart,
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  ToolboxComponent, // A group of utility tools, which includes export, data view, dynamic type switching, data area zooming, and reset.
  DataZoomComponent, // Used in Line Graph Charts
  CanvasRenderer, // If you only need to use the canvas rendering mode, the bundle will not include the SVGRenderer module, which is not needed.
]);

export interface ReactEChartsProps {
  option: EChartsOption;
  settings?: SetOptionOpts;
  loading?: boolean;
}

export function ReactECharts({
  option,
  settings,
  loading,
  ...rest
}: ReactEChartsProps & ComponentProps<"div">): JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    fetch("/essos.project.json")
      .then((res) => res.json())
      .then((json) => {
        if (chartRef.current !== null) {
          registerTheme("dark", json);
          chart = init(chartRef.current, "dark");
        }
      });

    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener("resize", resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, []);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      chart?.setOption(option, settings);
    }
  }, [option, settings]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      loading === true ? chart?.showLoading() : chart?.hideLoading();
    }
  }, [loading]);

  return <div ref={chartRef} {...rest} />;
}
