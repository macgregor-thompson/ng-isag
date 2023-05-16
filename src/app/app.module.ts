import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './_shared/shared.module';
import { CoreModule } from './_core/core.module';
import { AppInitializerService } from './app-initializer.service';
import { JwtInterceptor } from './_core/interceptor/jwt.interceptor';
import { ErrorInterceptor } from './_core/interceptor/error.interceptor';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

export function initialize(appInitializerService: AppInitializerService) {
  return () => appInitializerService.initialize();
}

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule,
    SharedModule,

    SocketIoModule.forRoot(config),

    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AppInitializerService,
    {
      provide: APP_INITIALIZER,
      useFactory: initialize,
      deps: [AppInitializerService],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
