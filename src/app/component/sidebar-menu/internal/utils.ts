//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import { TrackByFunction } from '@angular/core';

import { MenuItem } from '../model';

//=============================================================================

export const trackByItem: TrackByFunction<MenuItem> = (index, item) => {
  return item.id || index;
};

//=============================================================================
