import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorService } from '../services/error.service';

export function CatchError<P extends unknown[], T>(
  target: Object,
  _propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: P) => Observable<T>>
) {
  const wrappedFunction = descriptor.value;
  descriptor.value = function (...args: P) {
    const result: Observable<T> = wrappedFunction.apply(this, args);
    return result.pipe<T>(catchError(ErrorService.handle));
  };
}
