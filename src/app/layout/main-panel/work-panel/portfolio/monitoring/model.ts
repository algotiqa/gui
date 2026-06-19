//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


export class ChartOptions {
  showTotals       : boolean = true;
  showGrossProfit  : boolean = true;
  showNetProfit    : boolean = true;
  showGrossDrawdown: boolean = true;
  showNetDrawdown  : boolean = true;

  labelTotGrossProfit   : string = "";
  labelTotNetProfit     : string = "";
  labelTotGrossDrawdown : string = "";
  labelTotNetDrawdown   : string = "";
}

//=============================================================================
