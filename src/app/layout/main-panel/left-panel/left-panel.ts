//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {Component} from '@angular/core';
import {MenuService} from "../../../service/menu.service";
import {Roles} from "../../../model/user/roles";
import { SidebarModes, UnAuthorizedVisibility } from '../../../component/sidebar-menu/model';
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {SidebarMenuModule} from "../../../component/sidebar-menu/sidebar.module";
import {MatInputModule} from "@angular/material/input";

//=============================================================================

@Component({
    selector: 'left-panel',
    templateUrl: './left-panel.html',
    styleUrls: ['./left-panel.scss'],
    imports: [CommonModule, MatInputModule, MatIconModule, MatToolbarModule, SidebarMenuModule]
})

//=============================================================================

export class LeftPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  title              = 'angular-sidebar-menu';
  currentRole        = Roles.EDITOR;
  currentSidebarMode = SidebarModes.EXPANDED;
  currentSearch     ?: string;
  inputSearchFocus     = false;
  visibility : UnAuthorizedVisibility = "hidden";

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

  constructor(public menuService : MenuService) {
	}

	//-------------------------------------------------------------------------
	//---
	//--- API method
	//---
	//-------------------------------------------------------------------------

}

//=============================================================================
