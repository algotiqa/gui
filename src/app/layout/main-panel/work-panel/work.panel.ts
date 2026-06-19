//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {Component}    from '@angular/core';
import {RouterModule} from "@angular/router";

import {LabelService} from "../../../service/label.service";

//=============================================================================

@Component({
    selector: 'work-panel',
    templateUrl: './work.panel.html',
    styleUrls: ['./work.panel.scss'],
    imports: [RouterModule]
})

//=============================================================================

export class WorkPanel {

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(protected labelService:LabelService) {
  }
}

//=============================================================================
