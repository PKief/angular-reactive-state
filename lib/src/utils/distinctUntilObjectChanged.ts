import { isEqual } from 'lodash-es';
import { distinctUntilChanged, Observable } from 'rxjs';

export const distinctUntilObjectChanged = () => {
  return <T>(source: Observable<T>): Observable<T> =>
    source.pipe(distinctUntilChanged(isEqual));
};
