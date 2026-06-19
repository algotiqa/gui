//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import { Menu, SidebarModes, Role, UnAuthorizedVisibility } from './model';

import { AnchorService } from './service/anchor.service';
import { NodeService }   from './service/node.service';
import { RoleService }   from './service/role.service';
import { SearchService } from './service/search.service';
import { trackByItem }   from './internal/utils';

//=============================================================================

@Component({
    selector: 'asm-angular-sidebar-menu',
    templateUrl: './sidebar-menu.component.html',
    styleUrls: ['sidebar-menu.component.scss'],
    providers: [NodeService, AnchorService, RoleService, SearchService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

//=============================================================================

export class SidebarMenuComponent {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() mode = SidebarModes.EXPANDED;

  menu?: Menu;
  modes             = SidebarModes;
  disableAnimations = true;
  trackByItem       = trackByItem;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(
    private anchorService: AnchorService,
    private nodeService  : NodeService,
    private searchService: SearchService,
    public  roleService  : RoleService
  ) {}

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  @Input('menu') set _menu(menu: Menu) {
    this.disableAnimations = true;
    this.menu = menu;

    setTimeout(() => {
      this.disableAnimations = false;
    });
  }

  //-------------------------------------------------------------------------

  @Input() set iconClasses(cssClasses: string) {
    this.anchorService.iconClasses = cssClasses;
  }

  //-------------------------------------------------------------------------

  @Input() set toggleIconClasses(cssClasses: string) {
    this.nodeService.toggleIconClasses = cssClasses;
  }

  //-------------------------------------------------------------------------

  @Input() set role(role: Role | undefined) {
    this.roleService.role = role;
  }

  //-------------------------------------------------------------------------

  @Input() set unAuthorizedVisibility(visibility: UnAuthorizedVisibility) {
    this.roleService.unAuthorizedVisibility = visibility;
  }

  //-------------------------------------------------------------------------

  @Input() set search(value: string | undefined) {
    this.searchService.search = value;
  }
}

//=============================================================================
