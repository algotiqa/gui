//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {EventEmitter, Injectable} from "@angular/core";

import {Subscription} from "rxjs";

import {AppEvent, ErrorEvent, ErrorHandler, EventHandler} from "../model/event";

//=============================================================================

@Injectable()
export class EventBusService {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	private eventEmitterMap : Map<string, EventEmitter<AppEvent>> = new Map();
	private errorEvents     : EventEmitter<ErrorEvent> = new EventEmitter();

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor() {
	}

	//-------------------------------------------------------------------------
	//---
	//--- API methods
	//---
	//-------------------------------------------------------------------------

	public subscribeToApp(eventCode : string, handler : EventHandler) : Subscription {

		let emitter : EventEmitter<AppEvent>|undefined = this.eventEmitterMap.get(eventCode);

		if (emitter == undefined) {
			emitter = new EventEmitter();
			this.eventEmitterMap.set(eventCode, emitter);
		}

		return emitter.subscribe(handler, null, null);
	}

	//-------------------------------------------------------------------------

	public emitToApp(event : AppEvent) : void {

		let emitter : EventEmitter<AppEvent>|undefined = this.eventEmitterMap.get(event.code);
    let emitted : boolean;

		if (emitter != undefined) {
			console.log("Emitting event: "+ JSON.stringify(event));
			emitter.emit(event);
      emitted = true;
		}
		else {
      emitted = false;
		}

		//--- Emitting to global handlers

		emitter = this.eventEmitterMap.get(AppEvent.ANY);

		if (emitter != undefined) {
			emitter.emit(event);
		}
    else if (!emitted) {
      console.log("WARNING: Trying to emit an event without any handler --> "+ JSON.stringify(event));
    }
	}

	//-------------------------------------------------------------------------

	public subscribeToError(handler : ErrorHandler) : Subscription {
		return this.errorEvents.subscribe(handler, null, null);
	}

	//-------------------------------------------------------------------------

	public emitToError(event : ErrorEvent) : void {
		console.log("Emitting error event: "+ JSON.stringify(event));
		this.errorEvents.emit(event);
	}
}

//=============================================================================
