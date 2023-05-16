import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  primary = false;
  auxiliary = false;

  constructor() { }

  start(primary = true) {
    primary ? setTimeout(() => {
      if (!this.primary) this.primary = true;
    }) : this.startAuxiliary();
  }

  startAuxiliary() {
    if (!this.auxiliary) this.auxiliary = true;
  }

  stop() {
    setTimeout(() => {
      this.primary = false;
      this.auxiliary = false;
    });
  }

  stopAuxiliary() {
    this.auxiliary = false;
  }

  stopPrimary() {
    this.primary = false;
  }
}
