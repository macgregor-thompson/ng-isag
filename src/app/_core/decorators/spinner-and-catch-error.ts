import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ErrorService } from '../services/error.service';

export function SpinnerAndCatchError<P extends unknown[], T>(
  target: Object,
  _propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: P) => Observable<T>>
) {
  const wrappedFunction = descriptor.value;
  descriptor.value = function (...args: P) {
   this.spinnerService.start();
    const result: Observable<T> = wrappedFunction.apply(this, args);
    return result
      .pipe<T>(tap(() => this.spinnerService.stop()))
      .pipe<T>(
      catchError( e => {
        this.spinnerService.stop();
        return ErrorService.handle(e);
      }));
  };
}
