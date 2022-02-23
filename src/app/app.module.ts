import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgPipesModule } from 'ngx-pipes';

import { AppComponent } from './app.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { SizePipe } from './pipes/size.pipe';
import { StreamComponent } from './stream/stream.component';
import { ToDatePipe } from './to-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SizePipe,
    BookmarkComponent,
    StreamComponent,
    ToDatePipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgPipesModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
