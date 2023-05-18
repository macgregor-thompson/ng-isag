import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StateService } from '../../../_core/services/state.service';
import { YearService } from '../../../_core/services/year.service';

@Component({
  selector: 'isag-handicap-allowance',
  templateUrl: './handicap-allowance.component.html',
  styleUrls: ['./handicap-allowance.component.scss']
})
export class HandicapAllowanceComponent {
  @Input() disabled: boolean;
  @Output() allowanceUpdate = new EventEmitter<number>();

  constructor(public stateService: StateService, private yearService: YearService) {}

  updateHandicapAllowance(handicapAllowance = this.stateService.year.handicapAllowance): void {
    this.yearService.update(this.stateService.year._id, { handicapAllowance }).subscribe();
    this.allowanceUpdate.emit();
  }

  moreAboutHandicapAllowances(): void {
    window.open('https://www.usga.org/content/usga/home-page/handicapping/roh/Content/rules/Appendix%20C%20Handicap%20Allowances.htm', '_blank');
  }

}
