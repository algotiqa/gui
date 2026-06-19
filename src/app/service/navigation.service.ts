//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

//=============================================================================

import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

//=============================================================================

@Injectable()
export class NavigationService {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  callStack : string[] = [];

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(private router : Router) {}

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public set() {
    this.callStack = []
    this.push()
  }

  //-------------------------------------------------------------------------

  public push() {
    let currAddress = this.router.url
    let idx = currAddress.indexOf("(")

    if (idx > -1) {
      currAddress = currAddress.substring(0, idx)
    }

    this.callStack.push(currAddress);
    console.log("Pushed: "+ currAddress)
  }

  //-------------------------------------------------------------------------

  public pop() {
    let currAddress = this.callStack.pop()
    let backAddress = this.callStack.pop()

    if (backAddress) {
      this.router.navigate([ backAddress ])
    }
  }
}

//=============================================================================

