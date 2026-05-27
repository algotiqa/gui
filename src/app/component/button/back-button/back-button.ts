//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, HostBinding, Input} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {AbstractPanel} from "../../abstract.panel";
import {FlatButton} from "../../form/flat-button/flat-button";
import {Url} from "../../../model/urls";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {Router} from "@angular/router";

//=============================================================================

@Component({
  selector: 'back-button',
  templateUrl: './back-button.html',
  styleUrls  :['./back-button.scss'],
  imports: [FlatButton]
})

//=============================================================================

export class BackButton extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() page     : string  = ""
  @Input() disabled : boolean = false

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(protected override eventBusService : EventBusService,
              protected override labelService : LabelService,
              protected override router       : Router) {
    super(eventBusService, labelService, router, "")
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onBackClick() {
    this.navigateTo([ this.page ])
  }

  //-------------------------------------------------------------------------
  //--- Disabled click prevention
  //--- This adds 'pointer-events: none' to the <flat-button> tag when disabled is true

  @HostBinding('style.pointer-events')
  get pointerEvents() {
    return this.disabled ? 'none' : 'auto';
  }
}

//=============================================================================
