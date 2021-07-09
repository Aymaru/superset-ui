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

import { EChartsOption, BarSeriesOption } from 'echarts';

import {
  CategoricalColorNamespace,
  ChartProps,
  DataRecord,
  getMetricLabel,
} from '@superset-ui/core';
import { NumberFormatter, getNumberFormatter } from '@superset-ui/core';
import { DEFAULT_FORM_DATA as DEFAULT_BAR_FORM_DATA, EchartsBarFormData } from './types';
import { DEFAULT_LEGEND_FORM_DATA, EchartsProps, AxisValues } from '../types';
import {
  extractGroupbyLabel,
  extractBreakdownLabel,
  getChartPadding,
  getLegendProps,
  get_cr_currency,
  getLabelRotation,
} from '../utils/series';
import { defaultGrid, defaultTooltip, defaultAxisLine, defaultAxis } from '../defaults';

import { getEncode, getDatasetIndex, addTransformDataset, get_name_gap } from './series';

import { CallbackDataParams } from 'echarts/types/src/util/types';

export function formatBarLabel({
  params,
  numberFormatter,
}: {
  params: any;
  numberFormatter: NumberFormatter;
}): string {
  const { value } = params;
  const formattedValue = numberFormatter(value.value as number);

  return formattedValue;
}

get_cr_currency();

export default function transformProps(chartProps: ChartProps): EchartsProps {
  const { width, height, formData, queriesData } = chartProps;
  const data: DataRecord[] = queriesData[0].data || [];

  const {
    colorScheme,
    groupby,
    columns,
    legendMargin,
    legendOrientation,
    metrics,
    yAxisFormat,
    showLabels,
    showLegend,
    barOrientation,
    barStacked,
    sortBy,
    sortOrder,
    legendType,
    showBarValue,
    tooltipDisplay,
    categoryAxisLabel,
    valueAxisLabel,
    yAxisShowminmax,
    yAxisBounds,
    xTicksLayout,
  }: EchartsBarFormData = { ...DEFAULT_LEGEND_FORM_DATA, ...DEFAULT_BAR_FORM_DATA, ...formData };

  const metricLabels = metrics.map(metric => {
    return getMetricLabel(metric);
  });

  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);

  const numberFormatter = getNumberFormatter(yAxisFormat);

  const formatter = (params: CallbackDataParams) => formatBarLabel({ params, numberFormatter });

  const defaultLabel = {
    formatter,
    show: showLabels,
    color: '#000000',
  };

  var total_value_for_serie: any = [];

  const transformedData = data
    .map(datum => {
      const name = extractGroupbyLabel({ datum, groupby });
      const breakdown = extractBreakdownLabel({ datum, columns });

      if (!(name in total_value_for_serie)) {
        total_value_for_serie[name] = 0;
      }
      metricLabels.forEach(metric => {
        total_value_for_serie[name] += datum[metric];
      });

      return {
        ...datum,
        name,
        breakdown,
      };
    })
    .map(datum => {
      const total = total_value_for_serie[datum['name']];
      return {
        ...datum,
        total,
      };
    });

  //@ts-ignore
  const dimension_names = Object.keys(transformedData[0]);

  const breakdowns: string[] = [];
  const names: string[] = [];
  const map = new Map();
  const map_name = new Map();
  for (const item of transformedData) {
    // @ts-ignore
    const temp_breakdown = item.breakdown ? item.breakdown : '';
    const tmp_name = item.name ? item.name : '';

    if (!map.has(temp_breakdown)) {
      map.set(temp_breakdown, true);
      breakdowns.push(temp_breakdown);
    }

    if (!map_name.has(tmp_name)) {
      map_name.set(tmp_name, true);
      names.push(tmp_name);
    }
  }

  breakdowns.sort();
  if (sortBy === 'breakdown') {
    if (!sortOrder) {
      breakdowns.reverse();
    }
  }

  if (transformedData.length !== names.length * breakdowns.length) {
    var validate_data: string[][] = [];
    names.forEach(() => {
      validate_data.push([]);
    });

    transformedData.forEach(datum => {
      const index = names.indexOf(datum.name);
      validate_data[index].push(datum.breakdown);
    });

    validate_data.forEach((values, index) => {
      if (values.length !== breakdowns.length) {
        breakdowns.forEach(br => {
          if (!values.includes(br)) {
            const name = names[index];
            var tmp_data = { name: name, breakdown: br, total: total_value_for_serie[name] };

            metricLabels.forEach(metric => {
              tmp_data = { ...tmp_data, [metric]: 0 };
            });
            transformedData.push(tmp_data);
          }
        });
      }
    });
  }

  function gen_serie(
    name: string,
    metric: string,
    dataset_index: number,
    last_serie: boolean,
  ): BarSeriesOption {
    return {
      type: 'bar',
      dimensions: [...dimension_names],
      ...getChartPadding(showLegend, legendOrientation, legendMargin),
      ...getEncode(barOrientation, metric, name),
      stack: barStacked ? 'total' : undefined,
      itemStyle: {
        color: colorFn(name),
      },
      label: {
        ...defaultLabel,
        show: barStacked ? last_serie && showBarValue : showBarValue,
        position: barOrientation === 'Horizontal' ? 'right' : 'top',
        formatter: (params: any) => {
          if (last_serie && barStacked) {
            return numberFormatter.format(total_value_for_serie[params.name]);
          }
          return numberFormatter.format(params.data[metric]);
        },
      },
      labelLayout: {
        moveOverlap: 'shiftY',
      },
      tooltip: {
        formatter: function (params: any) {
          const formatted_value = numberFormatter.format(params.data[metric]);
          return `${params.name}<br />
                  ${params.marker} ${params.seriesName}: ${formatted_value}`;
        },
      },
      datasetIndex: dataset_index,
      name: name,
    };
  }

  const series_names: string[] = [];
  var breakdown_count = -1;
  var metric_index = 0;
  const dataset_index: number = 5;

  metricLabels.forEach(metric => {
    const tmp_series_name: string[] = [];
    breakdowns.forEach(breakdown => {
      tmp_series_name.push(`${metric}${breakdown != '' ? ', ' + breakdown : ''}`);
    });
    series_names.push(...tmp_series_name);
  });

  var series: BarSeriesOption[] = [];
  var last_serie: boolean = false;

  series_names.forEach((serie_name, index) => {
    if (breakdown_count == breakdowns.length - 1) {
      breakdown_count = 0;
      metric_index++;
    } else {
      breakdown_count++;
    }
    if (index + 1 == series_names.length) {
      last_serie = true;
    }
    series.push(
      gen_serie(
        serie_name,
        metricLabels[metric_index],
        dataset_index + breakdown_count,
        last_serie,
      ),
    );
  });

  // @ts-ignore
  const datasets = breakdowns.map(breakdown => {
    return {
      ...getDatasetIndex(sortBy, sortOrder),
      transform: {
        type: 'filter',
        config: { dimension: 'breakdown', value: breakdown },
      },
    };
  });

  const dataset: EChartsOption['dataset'] = [
    { source: transformedData, dimensions: dimension_names },
    { ...addTransformDataset('sort', 'name', 'desc') },
    { ...addTransformDataset('sort', 'name', 'asc') },
    { ...addTransformDataset('sort', 'total', 'desc') },
    { ...addTransformDataset('sort', 'total', 'asc') },
    ...datasets,
  ];

  var metric_values_len = 0;
  var total_values_len = 0;
  transformedData.forEach((datum: any, idx) => {
    metricLabels.forEach((metric: string) => {
      if (metric in datum) {
        const tmp_len = numberFormatter.format(datum[metric]).length;
        if (tmp_len > metric_values_len) {
          metric_values_len = tmp_len;
        }
      }
    });

    if ('total' in datum) {
      const tmp_len = numberFormatter.format(datum['total']).length;
      if (tmp_len > total_values_len) {
        total_values_len = tmp_len;
      }
    }
  });

  var max_label_category = 0;
  names.forEach(name => {
    const tmp_len = name.length;
    if (tmp_len > max_label_category) {
      max_label_category = tmp_len;
    }
  });

  const max_label_value = barStacked ? total_values_len : metric_values_len;
  const isHorizontalBar = barOrientation === 'Horizontal';

  const rotateCategoryLabel = getLabelRotation(xTicksLayout);

  const categoryAxis_values: AxisValues = {
    ...defaultAxis,
    type: 'category',
    name: categoryAxisLabel,
    nameGap: get_name_gap(max_label_value, max_label_category, isHorizontalBar, 'category'), //isHorizontalBar ? 105 : 50,
    axisLabel: {
      show: true,
      formatter: undefined,
      rotate: isHorizontalBar ? 0 : rotateCategoryLabel,
    },
    axisLine: {
      ...defaultAxisLine,
      show: false,
    },
    splitLine: {
      show: true,
    },
    axisTick: {
      show: false,
    },
  };

  const valueAxis_values: AxisValues = {
    ...defaultAxis,
    type: 'value',
    name: valueAxisLabel,
    nameGap: get_name_gap(max_label_value, max_label_category, isHorizontalBar, 'value'), //isHorizontalBar ? 50 : 75,
    min: yAxisBounds[0] ? yAxisBounds[0] : undefined,
    max: yAxisBounds[1] ? yAxisBounds[1] : undefined,
    axisLabel: {
      show: true,
      formatter: numberFormatter,
      rotate: isHorizontalBar ? 0 : 0,
      showMinLabel: yAxisShowminmax,
      showMaxLabel: yAxisShowminmax,
    },
    axisLine: {
      ...defaultAxisLine,
      show: true,
    },
    splitLine: {
      show: true,
    },
    axisTick: {
      show: true,
    },
  };

  const echartOptions: EChartsOption = {
    dataset: dataset,
    grid: {
      ...defaultGrid,
      width: 'auto',
      height: 'auto',
      // left: '4%',
      // right: '4%',
      // bottom: isHorizontalBar ? '8%' : '4%',
    },
    legend: {
      ...getLegendProps(legendType, legendOrientation, showLegend),
      data: series_names,
    },
    tooltip: {
      ...defaultTooltip,
      trigger: tooltipDisplay,

      formatter: (params: any) => {
        var formatted_string = ``;
        var first = true;
        params.forEach((element: any, index: number) => {
          if (first) {
            formatted_string += `${element.name}`;
            first = false;
          }
          const metric = (element.seriesName as string).split(',')[0];
          const formatted_value = numberFormatter.format(element.data[metric]);
          formatted_string += `<br />${element.marker} ${element.seriesName}: ${formatted_value}`;
        });
        return formatted_string;
      },
    } as EChartsOption['tooltip'],

    yAxis: isHorizontalBar
      ? {
          ...categoryAxis_values,
        }
      : {
          ...valueAxis_values,
        },
    xAxis: isHorizontalBar
      ? {
          ...valueAxis_values,
        }
      : {
          ...categoryAxis_values,
        },
    series: [...series],
  };

  return {
    width,
    height,
    echartOptions,
  };
}
