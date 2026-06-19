//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {
	Component,
	Input,
	Output,
	EventEmitter,
	ChangeDetectionStrategy,
	HostBinding,
	ViewChild
} from '@angular/core';
import {RouterLinkActive} from '@angular/router';

import {MenuItem }       from '../../model';
import {AnchorService}   from '../../service/anchor.service';
import {EventBusService} from "../../../../service/eventbus.service";
import {AppEvent}        from "../../../../model/event";

//=============================================================================

@Component({
    selector: 'asm-menu-anchor',
    templateUrl: './anchor.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

//=============================================================================

export class AnchorComponent {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() menuItem!: MenuItem;
  @Input() isActive?: boolean;
  @Input() disable = false;

  @Output() clickAnchor = new EventEmitter<void>();

  @HostBinding('class.asm-menu-anchor--active') get active(): boolean {
    return this.isActive || (!!this.routerLinActive?.isActive && !this.disable);
  }

  @ViewChild('rla') private routerLinActive?: RouterLinkActive;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(public  anchorService  : AnchorService,
              private eventBusService: EventBusService) {}

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  menuItemClass(item:MenuItem) : string|undefined {
    if (item.iconClasses) {
      return item.iconClasses;
    }

    return this.anchorService.iconClasses;
  }

  //-------------------------------------------------------------------------

  onClick() : void {
      let event = new AppEvent<any>('menu.button.click');
      this.eventBusService.emitToApp(event);
  }
}

//=============================================================================
