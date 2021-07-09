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
import React from 'react';
import { t, validateNonEmpty } from '@superset-ui/core';
import { ControlPanelConfig, sections } from '@superset-ui/chart-controls';
import { D3_FORMAT_OPTIONS_N } from '../constants';

import {
  showLegendControl,
  legendTypeControl,
  legendOrientationControl,
  legendMarginControl,
  showControls,
  bottomMargin,
  xTicksLayout,
  showBarValue,
  barStacked,
  reduceXTicks,
  yAxisShowMinmax,
  yAxisBounds,
  barOrientation,
  sortBy,
  sortOrder,
  ValueAxisLabel,
  CategoryAxisLabel,
  tooltipDisplay,
} from '../controls';

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['metrics'],
        ['adhoc_filters'],
        ['groupby'],
        ['columns'],
        ['row_limit'],
        [sortBy],
        [sortOrder],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        [barOrientation],
        ['color_scheme'],
        ['label_colors'],
        [<h1 className="section-header">{t('Legend')}</h1>],
        [showLegendControl],
        [legendTypeControl],
        [legendOrientationControl],
        [legendMarginControl],
        [tooltipDisplay],
        [showBarValue],
        [barStacked],
        [showControls, null],
      ],
    },
    {
      label: t('Value Axis'),
      expanded: true,
      controlSetRows: [['y_axis_format'], [ValueAxisLabel], [yAxisShowMinmax], [yAxisBounds]],
    },
    {
      label: t('Category Axis'),
      expanded: true,
      controlSetRows: [[CategoryAxisLabel], [bottomMargin], [xTicksLayout], [reduceXTicks]],
    },
  ],
  controlOverrides: {
    groupby: {
      label: t('Series'),
      validators: [validateNonEmpty],
    },
    columns: {
      label: t('Breakdowns'),
      description: t('Defines how each series is broken down'),
    },
    row_limit: {
      default: 100,
    },
    y_axis_format: {
      label: t('Value Axis Format'),
      choices: D3_FORMAT_OPTIONS_N,
      default: '',
    },
    time_range: {
      default: 'No filter',
    },
  },
};

export default config;
