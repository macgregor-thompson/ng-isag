import { Component, Output, EventEmitter } from '@angular/core';

import { StateService } from '../../../_core/services/state.service';
import { YearService } from '../../../_core/services/year.service';

@Component({
  selector: 'isag-year-select',
  templateUrl: './year-select.component.html',
  styleUrls: ['./year-select.component.scss']
})
export class YearSelectComponent {

  @Output() yearChange = new EventEmitter();

  constructor(public stateService: StateService,
              public yearService: YearService) { }

}
