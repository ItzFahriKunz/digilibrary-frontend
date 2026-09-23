import { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

export default function ApexChart({
  options = {},
  series = [],
  type = "line",
  height = "auto",
  width = "100%",
  className = "",
}) {
  const chartElementRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const prevOptionsRef = useRef(null);
  const prevSeriesRef = useRef(null);

  useEffect(() => {
    if (!chartElementRef.current) return;

    // Gabungkan opsi chart dengan type, height, width dasar
    const mergedOptions = {
      ...options,
      chart: {
        ...(options.chart || {}),
        type,
        height,
        width,
        toolbar: {
          show: false,
          ...(options.chart?.toolbar || {}),
        },
      },
      series,
    };

    // Inisialisasi chart baru
    const chart = new ApexCharts(chartElementRef.current, mergedOptions);
    chart.render();
    chartInstanceRef.current = chart;
    prevOptionsRef.current = options;
    prevSeriesRef.current = series;

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update dinamis saat series atau options berubah
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    const seriesChanged = JSON.stringify(prevSeriesRef.current) !== JSON.stringify(series);
    const optionsChanged = JSON.stringify(prevOptionsRef.current) !== JSON.stringify(options);

    if (optionsChanged) {
      const mergedOptions = {
        ...options,
        chart: {
          ...(options.chart || {}),
          type,
          height,
          width,
          toolbar: {
            show: false,
            ...(options.chart?.toolbar || {}),
          },
        },
      };
      chartInstanceRef.current.updateOptions(mergedOptions, true, true);
      prevOptionsRef.current = options;
    }

    if (seriesChanged) {
      chartInstanceRef.current.updateSeries(series, true);
      prevSeriesRef.current = series;
    }
  }, [series, options, type, height, width]);

  return <div ref={chartElementRef} className={`w-full ${className}`} />;
}
