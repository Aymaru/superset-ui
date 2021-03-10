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
import {
  ChartProps,
  DataRecord,
  getMetricLabel,
  getNumberFormatter,
  NumberFormats,
  NumberFormatter,
} from '@superset-ui/core';
import {
  DEFAULT_FORM_DATA as DEFAULT_BAR_FORM_DATA,
  EchartsBarFormData,
} from './types';
import { DEFAULT_LEGEND_FORM_DATA, EchartsProps } from '../types';
import { extractGroupbyLabel, getChartPadding, getLegendProps } from '../utils/series';
import { defaultGrid, defaultTooltip } from '../defaults';
import value from '*.png';

import { getAxis, getEncode, getDatasetIndex, addTransformDataset} from './series'

const percentFormatter = getNumberFormatter(NumberFormats.PERCENT_2_POINT);

// export function formatPieLabel({
//   params,
//   numberFormatter,
// }: {
//   params: echarts.EChartOption.Tooltip.Format;
//   numberFormatter: NumberFormatter;
// }): string {
//   const { name = '', value, percent } = params;
//   const formattedValue = numberFormatter(value as number);
//   const formattedPercent = percentFormatter((percent as number) / 100);
//   switch (labelType) {
//     case EchartsBarLabelType.Key:
//       return name;
//     case EchartsBarLabelType.Value:
//       return formattedValue;
//     case EchartsBarLabelType.Percent:
//       return formattedPercent;
//     case EchartsBarLabelType.KeyValue:
//       return `${name}: ${formattedValue}`;
//     case EchartsBarLabelType.KeyValuePercent:
//       return `${name}: ${formattedValue} (${formattedPercent})`;
//     case EchartsBarLabelType.KeyPercent:
//       return `${name}: ${formattedPercent}`;
//     default:
//       return name;
//   }
// }

export default function transformProps(chartProps: ChartProps): EchartsProps {
  const { width, height, formData, queriesData } = chartProps;
  const data: DataRecord[] = queriesData[0].data || [];

  const {
    // colorScheme,
    groupby,
    legendMargin,
    legendOrientation,
    metric = '',
    numberFormat,
    showLabels,
    showLegend,
    barOrientation,
    sortBy,
    sortOrder
  }: EchartsBarFormData = { ...DEFAULT_LEGEND_FORM_DATA, ...DEFAULT_BAR_FORM_DATA, ...formData };
  const metricLabel = getMetricLabel(metric);

  // const keys = data.map(datum => extractGroupbyLabel({ datum, groupby }));
  // const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  const numberFormatter = getNumberFormatter(numberFormat);

  // const transformedData = data.map(datum => {
  //   const name = extractGroupbyLabel({ datum, groupby });
  //   return {
  //     value: datum[metricLabel],
  //     name,
  //     itemStyle: {
  //       color: colorFn(name),
  //     },
  //   };
  // });
  
  const trasnformedData = data.map(datum => {
    const name = extractGroupbyLabel({datum, groupby});
    return {
      value: datum[metricLabel],
      name,
    };
  });
  
  console.log('data')
  console.log(data)
  console.log(formData)
  console.log(trasnformedData)

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
  // };

  const echartOptions: echarts.EChartOption<echarts.EChartOption.SeriesBar> = {
    dataset: [{
        // Provide data.
        source: trasnformedData
    }, { ...addTransformDataset('sort','name','desc') },
    { ...addTransformDataset('sort','name','asc') },
    { ...addTransformDataset('sort','value','desc') },
    { ...addTransformDataset('sort','value','asc') },
  ], 
  grid: {
    ...defaultGrid
  },
  legend: {},
  tooltip: {
    ...defaultTooltip
  },
    ...getAxis(barOrientation),    
    series: [
      {
        type: 'bar',
        ...getChartPadding(showLegend, legendOrientation, legendMargin),
        ...getEncode(barOrientation),
        ...getDatasetIndex(sortBy, sortOrder)
      },
    ],
  };

  return {
    width,
    height,
    echartOptions,
  };
}
