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

import { t, smartDateFormatter, NumberFormats } from '@superset-ui/core';
import { D3_FORMAT_OPTIONS } from '@superset-ui/chart-controls';
import { LabelPositionEnum } from './types';

// eslint-disable-next-line import/prefer-default-export
export const NULL_STRING = '<NULL>';

export const TIMESERIES_CONSTANTS = {
  gridOffsetRight: 40,
  gridOffsetLeft: 20,
  gridOffsetTop: 20,
  gridOffsetBottom: 20,
  gridOffsetBottomZoomable: 80,
  legendRightTopOffset: 30,
  legendTopRightOffset: 55,
  zoomBottom: 30,
  toolboxTop: 0,
  toolboxRight: 5,
  dataZoomStart: 0,
  dataZoomEnd: 100,
};

export const LABEL_POSITION: [LabelPositionEnum, string][] = [
  [LabelPositionEnum.Top, 'Top'],
  [LabelPositionEnum.Left, 'Left'],
  [LabelPositionEnum.Right, 'Right'],
  [LabelPositionEnum.Bottom, 'Bottom'],
  [LabelPositionEnum.Inside, 'Inside'],
  [LabelPositionEnum.InsideBottomLeft, 'Inside left'],
  [LabelPositionEnum.InsideBottomRight, 'Inside right'],
  [LabelPositionEnum.InsideTop, 'Inside top'],
  [LabelPositionEnum.InsideBottom, 'Inside bottom'],
  [LabelPositionEnum.InsideTopLeft, 'Inside top left'],
  [LabelPositionEnum.InsideBottomLeft, 'Inside bottom left'],
  [LabelPositionEnum.InsideTopRight, 'Inside top right'],
  [LabelPositionEnum.InsideBottomRight, 'Inside bottom right'],
];

export const D3_VALUE_FORMAT_OPTIONS = [
  ['CURRENCY_CR', '₡.,2f (12345.432 => $12,345.43)'],
  ...D3_FORMAT_OPTIONS,
];

export const DTTM_ALIAS = '__timestamp';

export const COLUMN_NAME_ALIASES: Record<string, string> = {
  [DTTM_ALIAS]: t('Time'),
};

export const D3_FORMAT_DOCS = 'D3 format syntax: https://github.com/d3/d3-format';

// input choices & options
export const D3_FORMAT_OPTIONS_N: [string, string][] = [
  [NumberFormats.SMART_NUMBER, t('Adaptative formating')],
  ['~g', t('Original value')],
  [',d', ',d (12345.432 => 12,345)'],
  ['.1s', '.1s (12345.432 => 10k)'],
  ['.3s', '.3s (12345.432 => 12.3k)'],
  [',.1%', ',.1% (12345.432 => 1,234,543.2%)'],
  ['.3%', '.3% (12345.432 => 1234543.200%)'],
  ['.4r', '.4r (12345.432 => 12350)'],
  [',.3f', ',.3f (12345.432 => 12,345.432)'],
  ['+,', '+, (12345.432 => +12,345.432)'],
  ['$,.2f', '$,.2f (12345.432 => $12,345.43)'],
  ['CURRENCY_CR', '₡.,2f (12345.432 => ₡12,345.43)'],
  ['DURATION', t('Duration in ms (66000 => 1m 6s)')],
  ['DURATION_SUB', t('Duration in ms (1.40008 => 1ms 400µs 80ns)')],
];

export const D3_TIME_FORMAT_DOCS = t('D3 time format syntax: https://github.com/d3/d3-time-format');

export const D3_TIME_FORMAT_OPTIONS: [string, string][] = [
  [smartDateFormatter.id, t('Adaptative formating')],
  ['%d/%m/%Y', '%d/%m/%Y | 14/01/2019'],
  ['%m/%d/%Y', '%m/%d/%Y | 01/14/2019'],
  ['%Y-%m-%d', '%Y-%m-%d | 2019-01-14'],
  ['%Y-%m-%d %H:%M:%S', '%Y-%m-%d %H:%M:%S | 2019-01-14 01:32:10'],
  ['%d-%m-%Y %H:%M:%S', '%d-%m-%Y %H:%M:%S | 14-01-2019 01:32:10'],
  ['%H:%M:%S', '%H:%M:%S | 01:32:10'],
];
