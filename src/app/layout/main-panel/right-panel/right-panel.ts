//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import { Component, ChangeDetectionStrategy } from '@angular/core';
import {RouterModule} from "@angular/router";

//=============================================================================

@Component({
    selector: 'right-panel',
    templateUrl: './right-panel.html',
    styleUrls: ['./right-panel.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterModule]
})

//=============================================================================

export class RightPanel {
}

//=============================================================================
