/* eslint-disable no-underscore-dangle */
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
// import { Axis } from 'echarts'

import { sortOptions } from './types';
import { AxisType } from '../types';

// export function getAxis(
//   bar_orientation: string,
// ): {
//   xAxis: Axis;
//   yAxis: Axis;
// } {
//   var xAxisType: "value" | "category" | "time" | "log" = 'category';
//   var yAxisType: "value" | "category" | "time" | "log" = 'value';

//   if (bar_orientation === 'Horizontal') {
//     xAxisType = 'value';
//     yAxisType = 'category';
//   }
//   return {
//     xAxis: { type: xAxisType },
//     yAxis: { type: yAxisType },
//   };
// }

export function getAxis(
  bar_orientation: string,
  isXAxis: boolean = true,
): {
  type: AxisType;
  axisLabel: {
    show: boolean;
    formatter: string;
  };
} {
  if (isXAxis) {
    if (bar_orientation === 'Horizontal') {
      return {
        type: 'value',
        axisLabel: {
          show: true,
          formatter: `{value} colones`,
        },
      };
    }
    return {
      type: 'category',
      axisLabel: {
        show: true,
        formatter: `{value} colones`,
      },
    };
  }
  if (bar_orientation === 'Horizontal') {
    return {
      type: 'category',
      axisLabel: {
        show: true,
        formatter: `{value} colones`,
      },
    };
  }
  return {
    type: 'value',
    axisLabel: {
      show: true,
      formatter: `{value} colones`,
    },
  };
}

// export function getYAxis(bar_orientation: string): {
//   type: AxisType
// } {
//   if (bar_orientation === 'Horizontal') {
//     return {
//       type: 'category',
//     };
//   }
//   return {
//     type: 'value',
//   };
// }

export function getEncode(
  bar_orientation: string,
  seriesName?: string,
): {
  encode: {
    x: string;
    y: string;
    seriesName?: string;
  };
} {
  var xValue = 'name';
  var yValue = 'value';

  if (bar_orientation === 'Horizontal') {
    xValue = 'value';
    yValue = 'name';
  }

  return {
    encode: {
      x: xValue,
      y: yValue,
      seriesName: seriesName ? seriesName : 'breakdown',
    },
  };
}

export function getDatasetIndex(
  sortBy: string,
  sortOrder: boolean,
): {
  fromDatasetIndex: number;
} {
  var datasetIndexValue = 0;
  sortOptions.forEach(option => {
    if (option['dimension'] === sortBy) {
      option['sorting'].forEach(order => {
        if (order['order'] === sortOrder) {
          datasetIndexValue = order['datasetIndex'];
        }
      });
    }
  });

  return {
    fromDatasetIndex: datasetIndexValue,
  };
}

export function addTransformDataset(
  type: string,
  dimension: string,
  order: string,
): {
  transform: [
    {
      type: string;
      config: {
        dimension: string;
        order: string;
      };
    },
  ];
} {
  return {
    transform: [
      {
        type: type,
        config: {
          dimension: dimension,
          order: order,
        },
      },
    ],
  };
}
