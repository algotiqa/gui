//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';

const TRANSITION_DURATION = 300;

//=============================================================================

export const openCloseAnimation = trigger('openClose', [
  state('true', style({ height: AUTO_STYLE })),
  state('false', style({ height: 0 })),
  transition('false <=> true', animate(`${TRANSITION_DURATION}ms ease-in`)),
]);

//=============================================================================

export const rotateAnimation = trigger('rotate', [
  state('true', style({ transform: 'rotate(-90deg)' })),
  transition('false <=> true', animate(`${TRANSITION_DURATION}ms ease-out`)),
]);

//=============================================================================
