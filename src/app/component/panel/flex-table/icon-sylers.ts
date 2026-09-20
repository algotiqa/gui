//=============================================================================
//===
//=== Copyright (C) 2023-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {CellStyler, IconStyle, IconStyler} from "../../../model/flex-table";
import {DataInstrumentExt, DIRStatus, TsStatus} from "../../../model/model";
import {CheckButtonConfig} from "../../form/check-button/check-button-config";

//=============================================================================
//===
//=== Icon stylers
//===
//=============================================================================

export class SuggestedActionStyler implements IconStyler {

  getStyle(value : number, row? : any) : IconStyle {
    if (value == 1) return SA_ACTIVATE;
    if (value == 2) return SA_DEACTIVATE;

    return SA_NONE;
  }
}

var SA_NONE       = new IconStyle("trending_flat", "#A0A0A0");
var SA_ACTIVATE   = new IconStyle("trending_up",   "#00A000");
var SA_DEACTIVATE = new IconStyle("trending_down", "#A00000");

//=============================================================================

export class FlagStyler implements IconStyler {

  getStyle(value : boolean, row? : any) : IconStyle {
    if (value) return FLAG_TRUE_GREEN;

    return FLAG_FALSE;
  }
}

var FLAG_FALSE      = new IconStyle("radio_button_unchecked", "#A0A0A0");
var FLAG_TRUE_GREEN = new IconStyle("radio_button_checked",   "#00A000");
var FLAG_TRUE_RED   = new IconStyle("radio_button_checked",   "#A00000");

//=============================================================================

export class TradingSystemRunningStyler implements IconStyler {

  getStyle(value : boolean, row? : any) : IconStyle {
    return value ? TS_RUNNING_ON : TS_RUNNING_OFF;
  }
}

var TS_RUNNING_OFF  = new IconStyle("mode_off_on", "#A0A0A0", "Stopped");
var TS_RUNNING_ON   = new IconStyle("mode_off_on", "#00A000", "Running");

//=============================================================================

export class TradingSystemStatusStyler implements IconStyler {

  getStyle(value : number, row? : any) : IconStyle {
    switch (value) {
      case TsStatus.Off    : return TS_STATUS_OFF
      case TsStatus.Waiting: return TS_STATUS_WAITING
      case TsStatus.Running: return TS_STATUS_RUNNING
      case TsStatus.Idle   : return TS_STATUS_IDLE

      default: return TS_STATUS_BROKEN
    }
  }
}

var TS_STATUS_OFF    = new IconStyle("radio_button_unchecked", "#A0A0A0", "Off");
var TS_STATUS_WAITING= new IconStyle("snooze",                 "#0080C0", "Waiting");
var TS_STATUS_RUNNING= new IconStyle("run_circle",             "#00A000", "Running");
var TS_STATUS_IDLE   = new IconStyle("schedule",               "#C0C000", "Idle");
var TS_STATUS_BROKEN = new IconStyle("heart_broken",           "#E03000", "Broken");

//=============================================================================

export class InstrumentStatusStyler implements IconStyler {
  getStyle(value : number, row? : any) : IconStyle {
    if (row) {
      let vi = <DataInstrumentExt> row
      if (vi.virtualInstrument) {
        let status = vi.rolloverStatus

        if (status==DIRStatus.Waiting) return STATUS_WAITING
        if (status==DIRStatus.Ready)   return STATUS_READY

        return STATUS_READY_BUT
      }
    }

    if (value == undefined) return STATUS_NOTSTORED

    if (value == 0) return STATUS_READY;
    if (value == 1) return STATUS_WAITING;
    if (value == 2) return STATUS_LOADING;
    if (value == 3) return STATUS_PROCESSING;
    if (value == 4) return STATUS_SLEEPING;
    if (value == 5) return STATUS_EMPTY;

    return STATUS_ERROR;
  }
}

var STATUS_NOTSTORED  = new IconStyle("database_off",     "#605030", "Not stored");
var STATUS_WAITING    = new IconStyle("hourglass",        "#A0A0A0", "Waiting");
var STATUS_LOADING    = new IconStyle("database_upload",  "#0080FF", "Loading");
var STATUS_PROCESSING = new IconStyle("build",            "#A040A0", "Processing");
var STATUS_READY      = new IconStyle("done",             "#00A000", "Ready");
var STATUS_ERROR      = new IconStyle("error",            "#A00000", "Error");
var STATUS_SLEEPING   = new IconStyle("snooze",           "#A0A000", "Sleeping");
var STATUS_EMPTY      = new IconStyle("unknown_document", "#C04010", "Empty");
var STATUS_READY_BUT  = new IconStyle("done",             "#C04010", "Ready but not fully available");

//=============================================================================

export class RolloverStatusStyler implements IconStyler {

  getStyle(value : number, row? : any) : IconStyle {
    if (value ==  0) return ROLLOVER_WAITING;
    if (value ==  1) return ROLLOVER_READY;
    if (value == -1) return ROLLOVER_NOMATCH;
    if (value == -2) return ROLLOVER_NODATA;

    return STATUS_ERROR;
  }
}

var ROLLOVER_WAITING  = new IconStyle("hourglass",        "#A0A0A0", "Waiting");
var ROLLOVER_READY    = new IconStyle("done",             "#00A000", "Ready");
var ROLLOVER_NOMATCH  = new IconStyle("data_alert",       "#A00000", "No match");
var ROLLOVER_NODATA   = new IconStyle("unknown_document", "#C04010", "No data");

//=============================================================================

export class NumericClassStyler implements CellStyler {

  getCellStyle(value : number, row? : any) : string {
    let style = "text-align: right;";
    if (value > 0) return style+"color: #00A000;";
    if (value < 0) return style+"color: #A00000;";

    return "";
  }
}

//=============================================================================

export class AccountStatusStyler implements IconStyler {

  getStyle(value : string, row? : any) : IconStyle {
    if (value ==  "") return ACCOUNT_STATUS_OK;

    return new IconStyle("error", "#A00000", value);
  }
}

var ACCOUNT_STATUS_OK = new IconStyle("done", "#00A000", "No issues");

//=============================================================================

export class GrayBooleanStyler implements IconStyler {

  getStyle(value : boolean, row? : any) : IconStyle {
    if (value) return BOOL_TRUE;

    return BOOL_FALSE;
  }
}

var BOOL_TRUE  = new IconStyle("done",  "#00A000", "Yes");
var BOOL_FALSE = new IconStyle("close", "#606060", "No");

//=============================================================================

export class RedBooleanStyler implements IconStyler {

  getStyle(value : boolean, row? : any) : IconStyle {
    if (value) return BOOL_TRUE;

    return RED_BOOL_FALSE;
  }
}

var RED_BOOL_FALSE = new IconStyle("close", "#C00000", "No");

//=============================================================================

export class AllocationRunTypeStyler implements IconStyler {
  getStyle(value : string, row? : any) : IconStyle {
    if (value == "M") return RUNTYPE_MANUAL;

    return RUNTYPE_AUTO;
  }
}

var RUNTYPE_MANUAL  = new IconStyle("airline_seat_recline_normal",  "#A00080", "Manual");
var RUNTYPE_AUTO    = new IconStyle("time_auto",                    "#0080C0", "Automatic");

//=============================================================================

export class AllocationStatusStyler implements IconStyler {
  getStyle(value : string, row? : any) : IconStyle {
    if (value == "W") return ALLOC_STATUS_WAITING;
    if (value == "R") return ALLOC_STATUS_RUNNING;
    if (value == "D") return ALLOC_STATUS_DONE;
    if (value == "A") return ALLOC_STATUS_WARNINGS;

    return ALLOC_STATUS_ERRORS;
  }
}

var ALLOC_STATUS_WAITING  = new IconStyle("snooze",        "#606060", "Waiting");
var ALLOC_STATUS_RUNNING  = new IconStyle("build_circle",  "#0080C0", "Running");
var ALLOC_STATUS_DONE     = new IconStyle("done",          "#00A000", "Done");
var ALLOC_STATUS_WARNINGS = new IconStyle("warning",       "#A0A000", "Warnings");
var ALLOC_STATUS_ERRORS   = new IconStyle("error",         "#A00000", "Errors");

//=============================================================================
