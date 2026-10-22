//=============================================================================
//===
//=== Copyright (C) 2026-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================

import {Component, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {Router} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";

import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {MatDialog} from "@angular/material/dialog";
import {RightTitlePanel} from "../../../../../../../component/panel/right-title/right-title.panel";
import {AbstractPanel} from "../../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../../service/label.service";
import {AppEvent} from "../../../../../../../model/event";
import {SelectRequired} from "../../../../../../../component/form/select-required/select-required";
import {InputNumber} from "../../../../../../../component/form/input-number/input-number";
import {PortfolioService} from "../../../../../../../service/portfolio.service";
import {BuilderConfig, PortfolioBuilder, PortfolioBuilderResponse} from "../../../../../../../model/builder";

//=============================================================================

@Component({
    selector: "portfolio-builder-edit",
    templateUrl: './builder.edit.html',
    styleUrls: [ './builder.edit.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDividerModule,  SelectRequired, InputNumber]
})

//=============================================================================

export class PortfolioBuilderEditPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  id  = 0
  pbr = new PortfolioBuilderResponse()

  builder = new PortfolioBuilder()

  @ViewChild("inCorrThresh") pCorrThreshCtrl? : InputNumber

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              public  dialog           : MatDialog,
              private portfolioService : PortfolioService) {

    super(eventBusService, labelService, router, "inventory.portfolio.builder");
    super.subscribeToApp(AppEvent.PORTBUILDER_EDIT_START, (e : AppEvent) => this.onStart(e));
  }

  //-------------------------------------------------------------------------

  private onStart(event : AppEvent) : void {
    console.log("PortfolioBuilderEditPanel: Starting...");

    this.id = Number(event.params);

    this.portfolioService.getPortfolioBuilder(this.id).subscribe(
      result => {
        this.pbr = result

        result.available.forEach((pb : PortfolioBuilder) => {
          pb.label = this.loc("types."+ pb.name);
        })

        if (result.current) {
          this.builder = result.current;
          let pb = this.getSelectedBuilder(this.builder.name)
          if (pb) {
            pb.config = Object.assign(new BuilderConfig(), this.builder.config);
          }
        }
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onBuilderChange(name : string) : void {
    let pb = this.getSelectedBuilder(name);
    if (pb) {
      if (this.builder) {
        this.builder.config = Object.assign(new BuilderConfig(), pb.config);
      }
    }
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    if (this.builder.name == "simple") {
      return this.pCorrThreshCtrl?.isValid()
    }

    //--- None builder
    return true
  }

  //-------------------------------------------------------------------------

  public onSave() : void {
    console.log("Builder is : \n"+ JSON.stringify(this.builder));

    this.portfolioService.setPortfolioBuilder(this.id, this.builder).subscribe( c => {
      this.onClose();
    })
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
    super.emitToApp(event);
  }

  //-------------------------------------------------------------------------
  //--- Param spec
  //-------------------------------------------------------------------------

  minP(name:string) : number {
    return this.builder.specs[name]?.minValue
  }

  //-------------------------------------------------------------------------

  maxP(name:string) : number {
    return this.builder.specs[name]?.maxValue
  }

  //-------------------------------------------------------------------------

  optP(name:string) : boolean {
    return !this.builder.specs[name]?.required
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private getSelectedBuilder(name : string) : PortfolioBuilder|undefined {
    let pb : PortfolioBuilder|undefined

    this.pbr.available.forEach(b => {
      if (b.name == name) {
        pb = b
      }
    })

    return pb
  }
}

//=============================================================================
