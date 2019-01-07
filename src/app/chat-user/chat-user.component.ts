/*
Author: Madhuri Chadalapaka
Date: 01/06/2019
Project: Doordash Front End Project
* */
// Import the necessary components
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from "../chat-service";
import { ActivatedRoute } from '@angular/router';
import {Room} from "../room";
import { timer } from 'rxjs';
import {Message} from "../message";

// Component for door dash chat application, loads the login screen and upon login it displayed the list of chat rooms available,
// displays users for the selected chat room and the chat communication.

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss']
})
export class ChatUserComponent implements OnInit ,OnDestroy{
  // List of properties used for data binding and displaying the necessary information
  userName: string;
  time;
  chats: any[] = [];
  rooms: any[] = [];
  currentRoom: Room;
  users: any[];
  roomName: String;
  messages: Message[];

  // timer(initialDelay: number | Date, period: number, scheduler: Scheduler): Observable
  // Timer increments every 60000ms , ie., every minute
  source = timer(0,60000);
//output: 0
   subscribe;


  constructor(    private route: ActivatedRoute,
                  private chatService: ChatService) { }

  ngOnInit() {

  }

  /* A lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * Used for cleanup that needs to occur when the instance is destroyed.
   */
  ngOnDestroy(): void {
    // Unsubscribe the source to dispose the resource held by the subscription.
    this.subscribe.unsubscribe();
  }

  // Get the list of all the chat rooms available
  getRooms(): void {
    this.chatService.getRooms()
      .subscribe(rooms => this.rooms = rooms);
  }

  /* Save the user name once the user joins the doordash chat: When the user joins, the list of all chat rooms,
   * the users from the default chat room and the chat messages for that room must be populated.
   * @param userName - User Name of the user who joined the chat
   * */

  saveChatUser(userName) {
    this.userName = userName;

    // Get all the chat rooms
    this.getRooms();
    // Get the default room which is the first room by default (Tea Chats)
    this.getCurrentRoom(this.currentRoom);
    // Adds the timer to count the number of minutes the user is logged in for.
    this.subscribe = this.source.subscribe(val => this.time = val);
  }

  /* Get the selected chat room, initial load populates the default chat room and the users and messages for that room
   * @param room - Chat room information
   */
  getCurrentRoom(room) {
    let id = room ? room.id : 0;
    this.chatService.getRoom(id)
      .subscribe(currentRoom => {
        this.currentRoom = currentRoom;
        this.roomName = currentRoom.name;
        this.users = (this.currentRoom) ? this.currentRoom.users : [];
      });
    this.chatService.getMessages(id)
      .subscribe(messages => {
        this.messages = messages;
      });
  }
    /* Send the message to the chat room with all the information such as id, name, chat message and reaction if any
     * @param message - Message information
     */
  sendMessage(message): void {
    message = message.trim();
    if (!message) { return; }
    this.chatService.sendMessages(this.currentRoom.id,{ 'name': this.userName, 'id':-1, 'message': message , 'reaction':'happy'})
      .subscribe(message => {
        this.messages.push(message);
      });
      // @ts-ignore
    document.getElementById("chatMessage").value = ""; // Clear the contents of the chat message input to allow for a fresh new message
  }

  // Dynamically generate the styling class for the message displayed
  // 1. Left aligned for the messages in general
  // 2. For the current logged in user, the message are right aligned and displayed in red.

  getClassForMessage(displayLeft){
    if (displayLeft) {
      return "message-text";
    } else {
      return "message-text text-right";
    }
  }
  // Dynamically generate the styling class for the user name displayed :
  // For the logged in user, the user name is displayed in red


  getClassForUserName(currentUser){
    if(currentUser) {
      return "user-name-formatted";
    } else {
      return "";
    }
  }
}
