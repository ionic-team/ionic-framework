import { Injectable } from '@angular/core';

/**
 * Read by the guard on the wrapped route and the resolver on the resolved route.
 */
@Injectable({ providedIn: 'root' })
export class BackHistoryBlockService {
  block = false;
}
