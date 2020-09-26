import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../_core/services/spinner.service';

@Component({
  selector: 'isag-calcutta',
  templateUrl: './calcutta.component.html',
  styleUrls: ['./calcutta.component.scss']
})
export class CalcuttaComponent implements OnInit {

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.stop();
  }

}
