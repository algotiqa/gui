//=============================================================================
//===
//=== Copyright (C) 2022-present Andrea Carboni
//===
//=== This source code is licensed under the Elastic License 2.0 (ELv2) available at:
//=== https://github.com/algotiqa/gui/blob/main/LICENSE.md
//=== By using this file, you agree to the terms and conditions of that license.
//=============================================================================


import {Injectable} from '@angular/core';
// import {MessageService} from "primeng/api";

//=============================================================================

@Injectable()
export class NotificationService {

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	// constructor(private messageService:MessageService) {
	// }

	//-------------------------------------------------------------------------
	//---
	//--- API methods
	//---
	//-------------------------------------------------------------------------

	public showSuccess(title : string, message : string) : void {
		this.show('success', title, message);
	}

	//-------------------------------------------------------------------------

	public showInfo(title : string, message : string) : void {
		this.show('info', title, message);
	}

	//-------------------------------------------------------------------------

	public showWarn(title : string, message : string) : void {
		this.show('warn', title, message);
	}

	//-------------------------------------------------------------------------

	public showError(title : string, message : string) : void {
		this.show('error', title, message);
	}

	//-------------------------------------------------------------------------

	public show(severity : string, title : string, message : string) : void {

		// this.messageService.add( {
		// 	severity: severity,
		// 	summary : title,
		// 	detail  : message
		// });
	}
}

//=============================================================================
