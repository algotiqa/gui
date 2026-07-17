//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {Component}         from "@angular/core";
import {MatIconModule}     from "@angular/material/icon";
import {MatToolbarModule}  from "@angular/material/toolbar";
import {MatButtonModule}   from "@angular/material/button";
import {MatMenuModule}     from "@angular/material/menu";
import {MatDividerModule}  from "@angular/material/divider";
import {AppEvent, ErrorEvent} from "../../model/event";
import {EventBusService}   from "../../service/eventbus.service";
import {LabelService}      from "../../service/label.service";
import {SessionService}    from "../../service/session.service";
import {InventoryService}  from "../../service/inventory.service";
import {AbstractPanel} from "../../component/abstract.panel";
import {Router, RouterModule} from "@angular/router";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Subscription} from "rxjs";

//=============================================================================

@Component({
    selector: 'header-panel',
    templateUrl: './header-panel.html',
    styleUrls: ['./header-panel.scss'],
    imports: [MatButtonModule, MatIconModule, MatToolbarModule, MatMenuModule, MatDividerModule, RouterModule, MatSnackBarModule, MatProgressSpinnerModule],
    providers: []
})

//=============================================================================

export class HeaderPanel extends AbstractPanel {

  spinnerHidden   = true
  platformVersion = '???';

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(eventBusService  : EventBusService,
	            labelService     : LabelService,
              router           : Router,
              private _snackBar: MatSnackBar,
              public  sessionService   : SessionService,
              private inventoryService : InventoryService) {
		super(eventBusService, labelService, router, "header");

    eventBusService.subscribeToError(this.onError)
    eventBusService.subscribeToApp(AppEvent.SUBMIT_START, this.onSubmitStart)
    eventBusService.subscribeToApp(AppEvent.SUBMIT_END,   this.onSubmitEnd)

    this.loadPlatformVersion()
	}

	//-------------------------------------------------------------------------
	//---
	//--- Events
	//---
	//-------------------------------------------------------------------------

  onLogout = (): void => {
    this.sessionService.logout();
  };

  //-------------------------------------------------------------------------

	onMenuClick() {
		let event : AppEvent = new AppEvent(AppEvent.MENU_BUTTON_CLICK);
		this.eventBusService.emitToApp(event);
	}

  //-------------------------------------------------------------------------

  private onError = (event : ErrorEvent) => {
    this._snackBar.open(""+ event.error, "Ok")
  }

  //-------------------------------------------------------------------------

  private onSubmitStart = (event : AppEvent) => {
    this.spinnerHidden = false
  }

  //-------------------------------------------------------------------------

  private onSubmitEnd = (event : AppEvent) => {
    this.spinnerHidden = true
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private loadPlatformVersion() {
    this.inventoryService.getPlatformInfo().subscribe({
      next: (info) => {
        this.platformVersion = info?.version ? info.version : '-';
      },
      error: (err) => {
        console.log('Cannot load platform version: ' + JSON.stringify(err));
        this.platformVersion = 'error';
      }
    });
  };
}

//=============================================================================
