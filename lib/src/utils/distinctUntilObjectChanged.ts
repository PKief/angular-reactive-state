import { isEqual } from 'lodash';
import { distinctUntilChanged, Observable } from 'rxjs';

export const distinctUntilObjectChanged = () => {
  return <T>(source: Observable<T>): Observable<T> =>
    source.pipe(distinctUntilChanged((prev, cur) => isEqual(prev, cur)));
};
