import {AuthLayoutComponent} from './layout/auth-layout/auth-layout.component';
import {AppLayoutComponent} from './layout/app-layout/app-layout.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SpinnerInterceptor} from './interceptors/spinner.interceptor';

@NgModule({
  declarations: [AppLayoutComponent, AuthLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  exports: [AppLayoutComponent, AuthLayoutComponent],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true}]
})
export class CoreModule {
}
