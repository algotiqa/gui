//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {PeriodSelectorInfo} from "../component/form/period-selector/period-selector";

//=============================================================================

export class QuerySpec {
  daysBack?  : number;
  from?      : string;
  to?        : string;
  timeframe? : number;
  timezone?  : string;
  reduction? : string;
  limit?     : string;
}

//=============================================================================

export class QueryLib {

	//-------------------------------------------------------------------------
	//---
	//--- API methods
	//---
	//-------------------------------------------------------------------------

	public createSpec(psi : PeriodSelectorInfo, timeframe? : number, timezone? : string, reduction? : number, limit? : number) : QuerySpec {
    let spec = new QuerySpec()

    if (spec.timeframe) {
      spec.timeframe = timeframe
    }

    if (spec.timezone) {
      spec.timezone = timezone
    }

    if (reduction) {
      spec.reduction = String(reduction)
    }

    if (limit) {
      spec.limit = String(limit)
    }

    if (psi.custom) {
      spec.from = this.buildDate(psi.fromDate, false)
      spec.to   = this.buildDate(psi.toDate,    true)
    }
    else {
      spec.daysBack = psi.daysBack
    }

    return spec
	}

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private buildDate(value : number|undefined, isEnd : boolean) : string|undefined {
    if (value == undefined) {
      return undefined
    }

    let v=value.toString()

    let y= v.substring(0,4)
    let m= v.substring(4,6)
    let d= v.substring(6)

    let suffix = isEnd ? " 23:59:59" :" 00:00:00"

    return y +"-"+ m +"-"+ d +suffix
  }
}

//=============================================================================
