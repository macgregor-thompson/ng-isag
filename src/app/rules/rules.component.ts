import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../_core/services/spinner.service';

@Component({
  selector: 'isag-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.stop();
  }

}
