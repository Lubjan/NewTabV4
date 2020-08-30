import { async, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
    })
    .compileComponents();
  }));
});
