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

import { EChartsOption, RadarSeriesOption } from 'echarts';
import { RadarSeriesDataItemOption } from 'echarts/types/src/chart/radar/RadarSeries';

import {
  CategoricalColorNamespace,
  ChartProps,
  DataRecord,
  getMetricLabel,
  getTimeFormatter,
} from '@superset-ui/core';
import { NumberFormatter, getNumberFormatter } from '@superset-ui/core';
import {
  DEFAULT_FORM_DATA as DEFAULT_RADAR_FORM_DATA,
  EchartsRadarFormData,
  EchartsRadarLabelType,
} from './types';
import { DEFAULT_LEGEND_FORM_DATA, EchartsProps } from '../types';
import { extractGroupbyLabel, getLegendProps, get_cr_currency } from '../utils/series';
import { defaultGrid, defaultTooltip } from '../defaults';
import { CallbackDataParams } from 'echarts/types/src/util/types';

export function formatLabel({
  params,
  labelType,
  numberFormatter,
}: {
  params: CallbackDataParams;
  labelType: EchartsRadarLabelType;
  numberFormatter: NumberFormatter;
}): string {
  const { name = '', value } = params;
  const formattedValue = numberFormatter(value as number);

  switch (labelType) {
    case EchartsRadarLabelType.Value:
      return formattedValue;
    case EchartsRadarLabelType.KeyValue:
      return `${name}: ${formattedValue}`;
    default:
      return name;
  }
}

get_cr_currency();

export default function transformProps(chartProps: ChartProps): EchartsProps {
  const { width, height, formData, queriesData } = chartProps;
  const data: DataRecord[] = queriesData[0].data || [];

  const {
    colorScheme,
    groupby,
    labelType,
    labelPosition,
    legendOrientation,
    legendType,
    metrics = [],
    numberFormat,
    dateFormat,
    showLabels,
    showLegend,
    isCircle,
    //@ts-ignore
    columnConfig,
    maxValues,
  }: EchartsRadarFormData = {
    ...DEFAULT_LEGEND_FORM_DATA,
    ...DEFAULT_RADAR_FORM_DATA,
    ...formData,
  };
  const metricLabels: string[] = metrics.map(metric => {
    return getMetricLabel(metric);
  });

  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);

  const numberFormatter = getNumberFormatter(numberFormat);
  const formatter = (params: CallbackDataParams) =>
    formatLabel({
      params,
      numberFormatter,
      labelType,
    });

  const max_values_input = maxValues.split(',').map(value => parseInt(value));

  const max_values = new Map();
  const columnLabels: string[] = [];
  const transformedData: RadarSeriesDataItemOption[] = [];
  data.forEach(datum => {
    const column_name = extractGroupbyLabel({
      datum,
      groupby,
      timeFormatter: getTimeFormatter(dateFormat),
    });
    columnLabels.push(column_name);

    transformedData.push({
      value: metricLabels.map(metric => {
        const tmp_value = datum[metric] || 0;

        if (!max_values.has(metric)) {
          max_values.set(metric, tmp_value);
        } else {
          max_values.set(
            metric,
            max_values.get(metric) > tmp_value ? max_values.get(metric) : tmp_value,
          );
        }
        return tmp_value;
      }),
      name: column_name,
      itemStyle: {
        color: colorFn(column_name),
      },
      label: {
        show: showLabels,
        position: labelPosition,
        formatter,
      },
    } as RadarSeriesDataItemOption);
  });

  const indicator = metricLabels.map(metric => ({
    name: metric,
    max: max_values.get(metric),
  }));

  max_values_input.forEach((value, index) => {
    if (!isNaN(value) && index < indicator.length) {
      indicator[index].max = value;
    }
  });

  const series: RadarSeriesOption[] = [
    {
      type: 'radar',
      animation: false,
      emphasis: {
        label: {
          show: true,
          fontWeight: 'bold',
          backgroundColor: 'white',
        },
      },
      data: transformedData,
    },
  ];

  const echartOptions: EChartsOption = {
    grid: {
      ...defaultGrid,
    },
    tooltip: {
      ...defaultTooltip,
      trigger: 'item',
    },
    legend: {
      ...getLegendProps(legendType, legendOrientation, showLegend),
      data: columnLabels,
    },
    radar: {
      shape: isCircle ? 'circle' : 'polygon',
      indicator,
    },
    series,
  };

  return {
    width,
    height,
    echartOptions,
  };
}
