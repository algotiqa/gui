//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {Component}    from '@angular/core';
import {LabelService} from "../../../../service/label.service";
import {MatIconModule} from "@angular/material/icon";

//=============================================================================

@Component({
    selector: 'unknown',
    templateUrl: './unknown.panel.html',
    styleUrls: ['./unknown.panel.scss'],
    imports: [MatIconModule]
})

//=============================================================================

export class UnknownPanel {

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(private labelService : LabelService) {
	}

	//-------------------------------------------------------------------------
	//---
	//--- API method
	//---
	//-------------------------------------------------------------------------

	get message() : string {
		return this.labelService.getLabelString("page.unknown.message");
	}
}

//=============================================================================
