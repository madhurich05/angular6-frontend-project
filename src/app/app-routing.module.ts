/*
Author: Madhuri Chadalapaka
Date: 01/06/2019
Project: Doordash Front End Project
* */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from "./app.component";
import {ChatUserComponent} from "./chat-user/chat-user.component";

const routes: Routes = [
  { path: '', redirectTo: '/rooms', pathMatch: 'full' },
  { path: 'rooms', component: ChatUserComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
