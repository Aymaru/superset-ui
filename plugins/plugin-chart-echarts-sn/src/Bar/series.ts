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

import { sortOptions } from './types';
import { AxisType } from '../types';

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

export function getEncode(
  bar_orientation: string,
  metric: string,
  seriesName?: string,
): {
  encode: {
    x: string;
    y: string;
    seriesName?: string;
    itemName?: string;
    value?: string;
  };
} {
  var xValue = 'name';
  var yValue = metric;

  if (bar_orientation === 'Horizontal') {
    xValue = metric;
    yValue = 'name';
  }

  return {
    encode: {
      x: xValue,
      y: yValue,
      seriesName: seriesName,
      itemName: 'name',
      value: yValue,
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

export function get_name_gap(
  max_label_value: number,
  max_label_category: number,
  isHorizontalBar: boolean,
  axis: 'value' | 'category',
) {
  var name_gap = 50;
  if (axis == 'value') {
    if (isHorizontalBar) {
      return name_gap;
    } else {
      if (max_label_value <= 6) return name_gap;
      if (max_label_value <= 11) return name_gap + 25;
    }
  } else {
    if (isHorizontalBar) {
      if (max_label_category <= 6) return name_gap + 20;
      if (max_label_category > 6 && max_label_category <= 15) return name_gap + 40;
      if (max_label_category > 15 && max_label_category <= 24) return name_gap + 65;
    } else {
      return name_gap + 20;
    }
  }
  return name_gap;
}
