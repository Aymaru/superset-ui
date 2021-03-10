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
  DEFAULT_LEGEND_FORM_DATA,
  EchartsLegendFormData,
  LegendOrientation,
  LegendType,
} from '../types';

export type EchartsBarFormData = EchartsLegendFormData & {
  colorScheme?: string;
  groupby: string[];
  innerRadius: number;
  labelLine: boolean;
  labelsOutside: boolean;
  metric?: string;
  outerRadius: number;
  showLabels: boolean;
  numberFormat: string;
  barOrientation: string;
  sortBy: string;
  sortOrder: boolean;
};

export const DEFAULT_FORM_DATA: EchartsBarFormData = {
  ...DEFAULT_LEGEND_FORM_DATA,
  groupby: [],
  innerRadius: 30,
  labelLine: false,
  legendOrientation: LegendOrientation.Top,
  legendType: LegendType.Scroll,
  numberFormat: 'SMART_NUMBER',
  outerRadius: 70,
  showLabels: true,
  labelsOutside: true,
  barOrientation: 'Horizontal',
  sortBy: 'none',
  sortOrder: false,
};

export const sortOptions = [{
    dimension: 'name',
    sorting: [{
      order: false,
      datasetIndex: 1
    }, {
      order: true,
      datasetIndex: 2
    }]
  },{
    dimension: 'value',
    sorting: [{
      order: false,
      datasetIndex: 3
    }, {
      order: true,
      datasetIndex: 4
    }]
  }
];
// option = {
//   xAxis: {
//       type: 'category',
//       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//   },
//   yAxis: {
//       type: 'value'
//   },
//   series: [{
//       data: [120, 200, 150, 80, 70, 110, 130],
//       type: 'bar'
//   }]
// };