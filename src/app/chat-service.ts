/*
Author: Madhuri Chadalapaka
Date: 01/06/2019
Project: Doordash Front End Project
* */

// Import the necessary components
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { timer } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';
import {Message} from "./message";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

// Declare that this service should be created by the root application injector.

@Injectable({ providedIn: 'root' })

// Contains list of service methods to retrieve and save/update chat room/user/message information.
export class ChatService {

  private roomsUrl = 'http://localhost:8080/api/rooms';  // URL to web api

  constructor(
    private http: HttpClient) { }

  /* Get the list of all availble chat rooms from the server
   * The server must be up and running on port 8080, else it must be started using 'npm run api-server'
   */

  getRooms (): Observable<any[]> {
    return this.http.get<any[]>(this.roomsUrl)
      .pipe(
        tap(_ => console.log('fetched rooms')),
        catchError(this.handleError('getRooms', []))
      );
  }

  /* Get the chat room by id
   * @param id - Chat room id
   */

  getRoom(id: number): Observable<any> {
    const url = `${this.roomsUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      tap(_ => console.log(`fetched room id=${id}`)),
      catchError(this.handleError<any>(`getRoom id=${id}`))
    );
  }

  /* GET Messages for the given room.
   * @param id - Chat room id
   */
  getMessages(id: number): Observable<any> {
    const url = `${this.roomsUrl}/${id}/messages`;
    return this.http.get<any>(url).pipe(
      tap(_ => console.log(`fetched messages for room id=${id}`)),
      catchError(this.handleError<any>(`getMessages for room id=${id}`))
    );
  }
    /* Send the message(s) to the chat room with all the information such as id, name, chat message and reaction if any
     * @param id - Chat room id
     * @param message: Message information : id, name, message and reaction
     */
/** POST: Send the message */
  sendMessages (id: number, message: Message): Observable<Message> {

  const url = `${this.roomsUrl}/${id}/messages`;
  return this.http.post<Message>(url, message).pipe(
      tap((message: Message) => console.log(`added message w/ id=${message.id}`)),
      catchError(this.handleError<Message>('sendMessages'))
    );
  }

  /* Handle the error scenarios */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
