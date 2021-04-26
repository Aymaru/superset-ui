/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// import * as echarts from 'echarts';

import { EChartsOption, BarSeriesOption } from 'echarts';

// import { BarSeriesOption } from 'echarts/charts';

// import { DatasetComponentOption } from 'echarts/components';

import {
  CategoricalColorNamespace,
  ChartProps,
  DataRecord,
  getMetricLabel,
  // getNumberFormatter,
  //NumberFormats,
  // NumberFormatter,
} from '@superset-ui/core';
import {
  getNumberFormatterRegistry,
  /* formatNumber,*/ NumberFormatter,
  getNumberFormatter,
  createD3NumberFormatter,
} from '@superset-ui/core';
import { DEFAULT_FORM_DATA as DEFAULT_BAR_FORM_DATA, EchartsBarFormData } from './types';
import { DEFAULT_LEGEND_FORM_DATA, EchartsProps, AxisValues } from '../types';
import {
  extractGroupbyLabel,
  extractBreakdownLabel,
  getChartPadding,
  getLegendProps,
} from '../utils/series';
import { defaultGrid, defaultTooltip } from '../defaults';

import {
  /*getXAxis, getYAxis,/getAxis, */ getEncode,
  getDatasetIndex,
  addTransformDataset,
} from './series';
import { DatasetOption } from 'echarts/types/src/component/dataset/install';
import { CallbackDataParams } from 'echarts/types/src/util/types';

//const percentFormatter = getNumberFormatter(NumberFormats.PERCENT_2_POINT);

export function formatBarLabel({
  params,
  numberFormatter,
}: {
  params: any;
  numberFormatter: NumberFormatter;
}): string {
  console.log('Parametros para formatter');
  console.log(params);
  const { value } = params;
  console.log(value);
  console.log(typeof value);
  const formattedValue = numberFormatter(value.value as number);
  //const formattedPercent = percentFormatter((percent as number) / 100);

  return formattedValue;
}

export function getLegendData(
  breakdowns: string[],
  metricLabel: string,
): {
  data: string[];
} {
  var legendData;
  if (breakdowns[0] === '') {
    legendData = [metricLabel];
  } else {
    legendData = [...breakdowns];
  }
  return {
    data: legendData,
  };
}

getNumberFormatterRegistry().registerValue(
  'CURRENCY_CR',

  createD3NumberFormatter({
    locale: {
      decimal: ',',
      thousands: '.',
      grouping: [3, 3, 3, 3, 3, 3, 2, 2, 2, 2],
      currency: ['₡', ''],
    },
    formatString: '$,.2f',
  }),
);

export default function transformProps(chartProps: ChartProps): EchartsProps {
  const { width, height, formData, queriesData } = chartProps;
  console.log(chartProps);
  const data: DataRecord[] = queriesData[0].data || [];

  const {
    colorScheme,
    groupby,
    columns,
    legendMargin,
    legendOrientation,
    metric = '',
    yAxisFormat,
    showLabels,
    showLegend,
    barOrientation,
    barStacked,
    sortBy,
    sortOrder,
    legendType,
    showBarValue,
  }: EchartsBarFormData = { ...DEFAULT_LEGEND_FORM_DATA, ...DEFAULT_BAR_FORM_DATA, ...formData };
  const metricLabel = getMetricLabel(metric);

  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  console.log('numberFormat');
  console.log(yAxisFormat);
  const numberFormatter = getNumberFormatter(yAxisFormat);

  const formatter = (params: CallbackDataParams) => formatBarLabel({ params, numberFormatter });

  const defaultLabel = {
    formatter,
    show: showLabels,
    color: '#000000',
  };

  console.log(columns);
  console.log(data);
  const transformedData = data.map(datum => {
    const name = extractGroupbyLabel({ datum, groupby });
    const breakdown = extractBreakdownLabel({ datum, columns });
    return {
      name,
      breakdown,
      value: datum[metricLabel],
    };
  });

  const breakdowns: string[] = [];
  const map = new Map();
  for (const item of transformedData) {
    // @ts-ignore
    const temp_breakdown = item.breakdown;

    if (!map.has(temp_breakdown)) {
      map.set(temp_breakdown, true);
      breakdowns.push(temp_breakdown);
    }
  }

  breakdowns.sort();
  if (sortBy === 'breakdown') {
    if (!sortOrder) {
      breakdowns.reverse();
    }
  }

  var dataset_index: number = 6;
  var no_breakdowns: boolean = false;
  const series: BarSeriesOption[] = breakdowns.map(name => {
    no_breakdowns = false;
    if (name === '') {
      name = metricLabel;
      no_breakdowns = true;
    }
    dataset_index++;
    return {
      type: 'bar',
      ...getChartPadding(showLegend, legendOrientation, legendMargin),
      ...getEncode(barOrientation, no_breakdowns ? name : undefined),
      stack: barStacked ? 'total' : undefined,
      itemStyle: {
        color: colorFn(name),
      },
      label: {
        ...defaultLabel,
        show: showBarValue,
        position: 'top',
      },
      emphasis: {
        label: {
          show: true,
          fontWeight: 'bold',
          backgroundColor: 'white',
        },
      },
      datasetIndex: dataset_index,
      name: name,
    };
  });
  // @ts-ignore
  const datasets = breakdowns.map(br => {
    return {
      ...getDatasetIndex(sortBy, sortOrder),
      transform: {
        type: 'filter',
        config: { dimension: 'breakdown', value: br },
      },
    };
  });
  // @ts-ignore
  const dataset: DatasetOption = [
    { source: transformedData },
    { ...addTransformDataset('sort', 'name', 'desc') },
    { ...addTransformDataset('sort', 'name', 'asc') },
    { ...addTransformDataset('sort', 'value', 'desc') },
    { ...addTransformDataset('sort', 'value', 'asc') },
    { ...addTransformDataset('sort', 'breakdown', 'desc') },
    { ...addTransformDataset('sort', 'breakdown', 'asc') },
    ...datasets,
  ];

  console.log('series');
  console.log(series);
  console.log('breakdows');
  console.log(breakdowns);
  console.log('data');
  console.log(data);
  console.log('form data');
  console.log(formData);
  console.log('transformed data');
  console.log(transformedData);
  console.log(dataset);
  console.log('testing');
  console.log('Datasets-transforms');
  console.log(datasets);

  const isHorizontalBar = barOrientation === 'Horizontal';

  const categoryAxis_values: AxisValues = {
    type: isHorizontalBar ? 'value' : 'category',
    axisLabel: {
      show: true,
      formatter: isHorizontalBar ? numberFormatter : undefined,
    },
  };

  const valueAxis_values: AxisValues = {
    type: isHorizontalBar ? 'category' : 'value',
    axisLabel: {
      show: true,
      formatter: isHorizontalBar ? undefined : numberFormatter,
    },
  };
  /*
    if (isXAxis) {
      if (bar_orientation === 'Horizontal') {
        return {
          type: 'value',
          axisLabel: {
            show: true,
            formatter: `{value} colones`
          }
        };
      }
      return {
        type: 'category',
        axisLabel: {
          show: true,
          formatter: `{value} colones`
        }
      };
    }
    if (bar_orientation === 'Horizontal') {
      return {
        type: 'category',
        axisLabel: {
          show: true,
          formatter: `{value} colones`
        }
      };
    }
    return {
      type: 'value',
      axisLabel: {
        show: true,
        formatter: `{value} colones`
      }
    };
  }*/
  // const formatter = getNumberFormatter('₡,.2f');
  // console.log(formatter(1000));

  // console.log(formatNumber('₡.2f', 1000.444444));

  // console.log(formatNumber('my_format', 1000));

  // const formatter2 = getNumberFormatter('CURRENCY_CR');
  // console.log(formatter2(1848.0546));
  // const formatter = (params: { name: string; value: number; percent: number }) =>
  //   formatPieLabel({ params, numberFormatter, labelType });

  // const defaultLabel = {
  //   formatter,
  //   show: showLabels,
  //   color: '#000000',
  // };

  // const echartOptions: echarts.EChartOption<echarts.EChartOption.SeriesPie> = {
  //   grid: {
  //     ...defaultGrid,
  //   },
  //   tooltip: {
  //     ...defaultTooltip,
  //     trigger: 'item',
  //     formatter: params =>
  //       formatPieLabel({
  //         params: params as echarts.EChartOption.Tooltip.Format,
  //         numberFormatter,
  //         labelType: EchartsPieLabelType.KeyValuePercent,
  //       }),
  //   },
  //   legend: {
  //     ...getLegendProps(legendType, legendOrientation, showLegend),
  //     data: keys,
  //   },
  //   series: [
  //     {
  //       type: 'bar',
  //       ...getChartPadding(showLegend, legendOrientation, legendMargin),

  //       // @ts-ignore
  //       data: transformedData,
  //     },
  //   ],

  const echartOptions: EChartsOption = {
    dataset: dataset,
    grid: {
      ...defaultGrid,
    },
    legend: {
      ...getLegendProps(legendType, legendOrientation, showLegend),
      ...getLegendData(breakdowns, metricLabel),
      // data: breakdowns
    },
    tooltip: {
      ...defaultTooltip,
      trigger: 'item',
    },
    xAxis: {
      ...categoryAxis_values,
      // ...getAxis(barOrientation),
      // axisLabel: {
      //   show: true,
      //   formatter: `{value} colones`
      // },
    },
    yAxis: {
      ...valueAxis_values,
      // ...getAxis(barOrientation,false),
      // axisLabel: {
      //   show: true,
      //   formatter: numberFormatter
      // },
    },
    // ...getAxis(barOrientation),
    // ...getXAxis(barOrientation),
    // ...getYAxis(barOrientation),
    series: [...series],
  };

  return {
    width,
    height,
    echartOptions,
  };
}
