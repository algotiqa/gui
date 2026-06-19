//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {Component, OnInit} from '@angular/core';

import {MainPanel}      from "./main-panel/main.panel";
import {HeaderPanel}    from "./header-panel/header-panel";
import {SessionService} from "../service/session.service";
import {PortalModule} from "@angular/cdk/portal";
import {LabelService} from "../service/label.service";
import {MenuService} from "../service/menu.service";
import {RouterOutlet} from "@angular/router";

//=============================================================================

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
  imports: [HeaderPanel, MainPanel, PortalModule, RouterOutlet]
})

//=============================================================================

export class AppComponent implements OnInit {

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(public sessionService : SessionService,
              public labelService   : LabelService,
              public menuService    : MenuService) {}

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  ngOnInit() {
    this.sessionService.checkAuthentication();
  }

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  isModule() : boolean {
    return (window.location.href.indexOf("/module/") != -1);
  }
}

//=============================================================================
