//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {PeriodSelectorInfo} from "../../../../../../../component/form/period-selector/period-selector";
import {ParamSpec} from "../../../../../../../model/model";
import {PositionParameters} from "../../../../../../../model/position-sizing";

//=============================================================================

export interface DialogData {
  tsId      : number
  tsName    : string
  period    : PeriodSelectorInfo
  params    : PositionParameters
  paramSpecs: {[name:string]:ParamSpec}
  modelSpecs: {[name:string]:ParamSpec}
}

//=============================================================================
