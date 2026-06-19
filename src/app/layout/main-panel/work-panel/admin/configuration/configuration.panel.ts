//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import { Component } from '@angular/core';

import {MatCardModule} from "@angular/material/card";
import {Configuration} from "../../../../../model/config";
import {LabelService}  from "../../../../../service/label.service";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {AbstractPanel} from "../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../service/eventbus.service";
import {MatButtonModule} from "@angular/material/button";
import {Router, RouterModule} from "@angular/router";
import {FlexTablePanel} from "../../../../../component/panel/flex-table/flex-table.panel";
import {ListButtons, ListContent, ListPanel} from "../../../../../component/panel/list-panel/list-panel";
import {SaveButton} from "../../../../../component/button/save/save.button";

//=============================================================================

@Component({
    selector: 'configuration-panel',
    templateUrl: './configuration.panel.html',
    styleUrls: ['./configuration.panel.scss'],
  imports: [MatCardModule, MatIconModule, MatDividerModule, MatButtonModule, RouterModule, FlexTablePanel, ListButtons, ListContent, ListPanel, SaveButton]
})

//=============================================================================

export class ConfigurationPanel extends AbstractPanel {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	public config : Configuration = {
		"language"     : "en",
		"debugEnabled" : true
	};

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(eventBusService : EventBusService,
	            labelService    : LabelService,
              router          : Router) {
		super(eventBusService, labelService, router, "admin.config");
		this.config.language = labelService.getLanguage();
	}

	//-------------------------------------------------------------------------
	//---
	//--- Template methods
	//---
	//-------------------------------------------------------------------------

	// get languages() : any {
	// 	return this.labelService.getMapping("languages");
	// }

	//-------------------------------------------------------------------------
	//---
	//--- Events
	//---
	//-------------------------------------------------------------------------

	onSaveClick() {
//
// 		console.log("Configuration : \n"+ JSON.stringify(this.config));
//
// 		//--- Examples of notifications that can occur during tool saving
//
// //		this.notificationService.showError  ("Form error",        "Missing mandatory tool");
// //		this.notificationService.showWarn   ("Operation warning", "Some operations where skipped");
// //		this.notificationService.showInfo   ("Info title",        "Entering out of scope area");
// 		this.notificationService.showSuccess("Success",           "The system settings have been updated");
//
// 		this.labelService.setLanguage(this.config.language);
	}
}

//=============================================================================
