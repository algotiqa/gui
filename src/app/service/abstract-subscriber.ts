//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {Injectable} from "@angular/core";
import {Subscription} from "rxjs";

import {EventHandler, ErrorHandler, AppEvent, ErrorEvent} from "../model/event";

import {EventBusService} from "./eventbus.service";

//=============================================================================

@Injectable()
export abstract class AbstractSubscriber {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	private subscriptions: Subscription[] = [];

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(protected eventBusService : EventBusService) {}

	//-------------------------------------------------------------------------
	//---
	//--- API methods
	//---
	//-------------------------------------------------------------------------

	protected subscribeToApp(eventCode : string, handler : EventHandler) : Subscription {

		let s : Subscription = this.eventBusService.subscribeToApp(eventCode, handler);
		this.subscriptions.push(s);

		return s;
	}

	//-------------------------------------------------------------------------

	protected emitToApp(event : AppEvent) : void {
		this.eventBusService.emitToApp(event);
	}

	//-------------------------------------------------------------------------

	protected subscribeToError(handler : ErrorHandler) : Subscription {

		let s : Subscription = this.eventBusService.subscribeToError(handler);
		this.subscriptions.push(s);

		return s;
	}

	//-------------------------------------------------------------------------

	protected emitToError(event : ErrorEvent) : void {
		this.eventBusService.emitToError(event);
	}

	//-------------------------------------------------------------------------

	protected removeAllSubscriptions() {
		this.subscriptions.forEach( (s : Subscription) => s.unsubscribe());
	}
}

//=============================================================================
