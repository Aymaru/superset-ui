import { t } from '@superset-ui/core';
import { DEFAULT_LEGEND_FORM_DATA } from './types';

import { formatSelectOptions } from '@superset-ui/chart-controls';

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
const { legendMargin, legendOrientation, legendType, showLegend } = DEFAULT_LEGEND_FORM_DATA;

export const noopControl = { name: 'noop', config: { type: '', renderTrigger: true } };

export const showLegendControl = {
  name: 'show_legend',
  config: {
    type: 'CheckboxControl',
    label: t('Legend'),
    renderTrigger: true,
    default: showLegend,
    description: t('Whether to display a legend for the chart'),
  },
};

export const legendMarginControl = {
  name: 'legendMargin',
  config: {
    type: 'TextControl',
    label: t('Margin'),
    renderTrigger: true,
    isInt: true,
    default: legendMargin,
    description: t('Additional padding for legend.'),
  },
};

export const legendTypeControl = {
  name: 'legendType',
  config: {
    type: 'SelectControl',
    freeForm: false,
    label: 'Type',
    choices: [
      ['scroll', 'Scroll'],
      ['plain', 'Plain'],
    ],
    default: legendType,
    renderTrigger: true,
    description: t('Legend type'),
  },
};

export const legendOrientationControl = {
  name: 'legendOrientation',
  config: {
    type: 'SelectControl',
    freeForm: false,
    label: 'Orientation',
    choices: [
      ['top', 'Top'],
      ['bottom', 'Bottom'],
      ['left', 'Left'],
      ['right', 'Right'],
    ],
    default: legendOrientation,
    renderTrigger: true,
    description: t('Legend type'),
  },
};

export const barOrientation = {
  name: 'barOrientation',
  config: {
    type: 'SelectControl',
    clearable: false,
    freeForm: true,
    label: t('Orientation'),
    choices: formatSelectOptions([t('Horizontal'), t('Vertical')]),
    default: t('Vertical'),
    renderTrigger: true,
    description: t('Change the bar chart orientation'),
  },
};

export const sortBy = {
  name: 'sortBy',
  config: {
    type: 'SelectControl',
    clearable: false,
    freeForm: true,
    label: t('Sort by'),
    choices: formatSelectOptions(['none', 'serie', 'value', 'breakdown']),
    default: 'none',
    renderTrigger: true,
    description: t('Sort data by name or by value'),
  },
};

export const sortOrder = {
  name: 'sortOrder',
  config: {
    type: 'CheckboxControl',
    label: t('Sort Order'),
    default: false,
    renderTrigger: true,
    description: t('Check to sort asc, else sort desc'),
  },
};

// export const bottomMargin = {
//   name: 'bottom_margin',
//   config: {
//     type: 'SelectControl',
//     clearable: false,
//     freeForm: true,
//     label: t('Bottom Margin'),
//     choices: formatSelectOptions(['auto', 50, 75, 100, 125, 150, 200]),
//     default: 'auto',
//     renderTrigger: true,
//     description: t('Bottom margin, in pixels, allowing for more room for axis labels'),
//   },
// };

export const yAxisShowMinmax = {
  name: 'y_axis_showminmax',
  config: {
    type: 'CheckboxControl',
    label: t('Y bounds'),
    renderTrigger: true,
    default: false,
    description: t('Whether to display the min and max values of the Y-axis'),
  },
};

export const showControls = {
  name: 'show_controls',
  config: {
    type: 'CheckboxControl',
    label: t('Extra Controls'),
    renderTrigger: true,
    default: false,
    description: t(
      'Whether to show extra controls or not. Extra controls ' +
        'include things like making mulitBar charts stacked ' +
        'or side by side.',
    ),
  },
};

export const xAxisLabel = {
  name: 'x_axis_label',
  config: {
    type: 'TextControl',
    label: t('X Axis Label'),
    renderTrigger: true,
    default: '',
  },
};

export const bottomMargin = {
  name: 'bottom_margin',
  config: {
    type: 'SelectControl',
    clearable: false,
    freeForm: true,
    label: t('Bottom Margin'),
    choices: formatSelectOptions(['auto', 50, 75, 100, 125, 150, 200]),
    default: 'auto',
    renderTrigger: true,
    description: t('Bottom margin, in pixels, allowing for more room for axis labels'),
  },
};

export const xTicksLayout = {
  name: 'x_ticks_layout',
  config: {
    type: 'SelectControl',
    label: t('X Tick Layout'),
    choices: formatSelectOptions(['auto', 'flat', '45°', 'staggered']),
    default: 'auto',
    clearable: false,
    renderTrigger: true,
    description: t('The way the ticks are laid out on the X-axis'),
  },
};

export const yAxisBounds = {
  name: 'y_axis_bounds',
  config: {
    type: 'BoundsControl',
    label: t('Y Axis Bounds'),
    renderTrigger: true,
    default: [null, null],
    description: t(
      'Bounds for the Y-axis. When left empty, the bounds are ' +
        'dynamically defined based on the min/max of the data. Note that ' +
        "this feature will only expand the axis range. It won't " +
        "narrow the data's extent.",
    ),
  },
};

export const showBarValue = {
  name: 'show_bar_value',
  config: {
    type: 'CheckboxControl',
    label: t('Bar Values'),
    default: false,
    renderTrigger: true,
    description: t('Show the value on top of the bar'),
  },
};

export const barStacked = {
  name: 'bar_stacked',
  config: {
    type: 'CheckboxControl',
    label: t('Stacked Bars'),
    renderTrigger: true,
    default: false,
    description: null,
  },
};

export const reduceXTicks = {
  name: 'reduce_x_ticks',
  config: {
    type: 'CheckboxControl',
    label: t('Reduce X ticks'),
    renderTrigger: true,
    default: false,
    description: t(
      'Reduces the number of X-axis ticks to be rendered. ' +
        'If true, the x-axis will not overflow and labels may be ' +
        'missing. If false, a minimum width will be applied ' +
        'to columns and the width may overflow into an ' +
        'horizontal scroll.',
    ),
  },
};

export const yAxisLabel = {
  name: 'y_axis_label',
  config: {
    type: 'TextControl',
    label: t('Y Axis Label'),
    renderTrigger: true,
    default: '',
  },
};

export const CategoryAxisLabel = {
  name: 'category_axis_label',
  config: {
    type: 'TextControl',
    label: t('Category Axis Label'),
    renderTrigger: true,
    default: '',
  },
};

export const ValueAxisLabel = {
  name: 'value_axis_label',
  config: {
    type: 'TextControl',
    label: t('Category Axis Label'),
    renderTrigger: true,
    default: '',
  },
};
