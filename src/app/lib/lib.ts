//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {StringLib} from "./string-lib";
import {ChartLib}  from "./chart-lib";
import {QueryLib} from "./query-lib";
import {BrowserLib} from "./browser";

//=============================================================================

export class Lib {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	public static str      = new StringLib();
  public static chart    = new ChartLib();
  public static query    = new QueryLib();
  public static browser = new BrowserLib()
}

//=============================================================================
