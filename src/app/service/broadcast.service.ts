//=============================================================================
//===
//=== Copyright (C) 2025-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Injectable} from "@angular/core";

//=============================================================================

@Injectable()
export class BroadcastService {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  private bc = new BroadcastChannel("algotiqa")

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public sendTradingSystemDeleted(id : number|undefined) {
    if (id != undefined) {
      this.bc.postMessage(new BroadcastEvent(EventType.TradingsSystem_Deleted, id))
      console.log("BroadcastService.sendTradingSystemDeleted: Sending delete event for TS with id="+id)
    }
  }

  //-------------------------------------------------------------------------

  public onEvent(f : BroadcastHandler) {
    this.bc.addEventListener("message", (e : MessageEvent) => {
      let be : BroadcastEvent = e.data
      f(be);
    })
  }
}

//=============================================================================

export enum EventType {
  TradingsSystem_Deleted = "TradingSystem_Deleted"
}

//-----------------------------------------------------------------------------

export class BroadcastEvent {
    type : EventType
    id   : any

    constructor(type:EventType, id:any) {
      this.type = type
      this.id   = id
    }
}

//=============================================================================

export type BroadcastHandler = (be : BroadcastEvent) => void;

//=============================================================================
