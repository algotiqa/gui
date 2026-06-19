//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {Component, ViewChild} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";

import {AppEvent}             from "../../model/event";
import {AbstractSubscriber}   from "../../service/abstract-subscriber";
import {EventBusService}      from "../../service/eventbus.service";
import {LeftPanel} from "./left-panel/left-panel";
import {WorkPanel} from "./work-panel/work.panel";
import {RightPanel} from "./right-panel/right-panel";

//=============================================================================

@Component({
    selector: 'main-panel',
    templateUrl: './main.panel.html',
    styleUrls: ['./main.panel.scss'],
    imports: [MatSidenavModule, RouterModule, LeftPanel, WorkPanel, RightPanel]
})

//=============================================================================

export class MainPanel extends AbstractSubscriber {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	@ViewChild('leftNavig')  private leftNavig !: MatSidenav;
	@ViewChild('rightNavig') private rightNavig!: MatSidenav;

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(eventBusService: EventBusService, private router : Router) {

		super(eventBusService);

		//--- Local Fat Arrow is mandatory in order to preserve 'this'

		super.subscribeToApp(AppEvent.ANY, e => this.onAnyEvent(e));
	}

	//-------------------------------------------------------------------------
	//---
	//--- Events
	//---
	//-------------------------------------------------------------------------

	private onAnyEvent(event : AppEvent) {

		if (event.code == AppEvent.MENU_BUTTON_CLICK) {

			//--- Prevent from opening the left-menu if the right-panel is open

			if ( ! this.rightNavig.opened) {
				this.leftNavig.opened = ! this.leftNavig.opened;
			}

			//--- Remove focus from the hamburger button so it doesn't stay "pressed"

			(document.activeElement as HTMLElement)?.blur();
		}
		else {
      if (event.code == AppEvent.RIGHT_PANEL_OPEN) {
        this.openRightNavig(event.propagateCode, event.params)
      }
      else if (event.code == AppEvent.RIGHT_PANEL_CLOSE) {
        this.rightNavig.opened = false;
      }
		}
	}

	//-------------------------------------------------------------------------
	//---
	//--- Private methods
	//---
	//-------------------------------------------------------------------------

	private openRightNavig(eventToPropagate:string|undefined, params:any) {
		this.rightNavig.open().then(() => {
			if (eventToPropagate) {
				super.emitToApp(new AppEvent(eventToPropagate, params));
			}

      //--- Remove focus on close button
      (document.activeElement as HTMLElement)?.blur();
		});
	}
}

//=============================================================================
