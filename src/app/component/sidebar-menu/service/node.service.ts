//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { NodeComponent } from '../component/node/node.component';

//=============================================================================

@Injectable()
export class NodeService {
  public openedNode = new Subject<{ nodeComponent: NodeComponent; nodeLevel: number }>();
  public toggleIconClasses?: string;
}

//=============================================================================
