import { TestBed } from '@angular/core/testing';

import { ApiClientesService } from './api-clientes.service';

describe('ApiClientesService', () => {
  let service: ApiClientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiClientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
