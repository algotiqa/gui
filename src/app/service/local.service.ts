//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

//=============================================================================

import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {EventBusService} from "./eventbus.service";
import {AppEvent} from "../model/event";
import {parse} from "yaml";

//=============================================================================

@Injectable()
export class LocalService {

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public getItem = (key:string) : string|null => {
    return localStorage.getItem(key)
  }

  //-------------------------------------------------------------------------

  public getStringItem = (key:string, defValue:string) : string => {
    let value = localStorage.getItem(key)

    if (value == null) {
      return defValue
    }

    return value
  }

  //-------------------------------------------------------------------------

  public getNumericItem = (key:string, defValue:number) : number => {
    let value = localStorage.getItem(key)

    if (value == null) {
      return defValue
    }

    return Number(value)
  }

  //-------------------------------------------------------------------------

  public setStringItem = (key:string, value:string|null) => {
    if (value == null) {
      localStorage.removeItem(key)
    }
    else {
      localStorage.setItem(key, value)
    }
  }

  //-------------------------------------------------------------------------

  public setNumericItem = (key:string, value:number|null) => {
    if (value == null) {
      localStorage.removeItem(key)
    }
    else {
      localStorage.setItem(key, String(value))
    }
  }

  //-------------------------------------------------------------------------

  public removeItem = (key:string) => {
    localStorage.removeItem(key)
  }
}

//=============================================================================

