import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { timer } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';
import {Message} from "./message";

// import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class ChatService {

  private roomsUrl = 'http://localhost:8080/api/rooms';  // URL to web api

  constructor(
    private http: HttpClient) { }

  /** GET Rooms from the server */
  getRooms (): Observable<any[]> {
    return this.http.get<any[]>(this.roomsUrl)
      .pipe(
        tap(_ => console.log('fetched rooms')),
        catchError(this.handleError('getRooms', []))
      );
  }

  /** GET room by id.*/

  getRoom(id: number): Observable<any> {
    const url = `${this.roomsUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      tap(_ => console.log(`fetched room id=${id}`)),
      catchError(this.handleError<any>(`getRoom id=${id}`))
    );
  }
  /** GET Messages for the given room.*/

  getMessages(id: number): Observable<any> {
    const url = `${this.roomsUrl}/${id}/messages`;
    return this.http.get<any>(url).pipe(
      tap(_ => console.log(`fetched messages for room id=${id}`)),
      catchError(this.handleError<any>(`getMessages for room id=${id}`))
    );
  }

/** POST: Send the message */
  sendMessages (id: number, message: Message): Observable<Message> {

  const url = `${this.roomsUrl}/${id}/messages`;
  return this.http.post<Message>(url, message).pipe(
      tap((message: Message) => console.log(`added message w/ id=${message.id}`)),
      catchError(this.handleError<Message>('sendMessages'))
    );
  }
/**Handle the error scenarios**/
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
