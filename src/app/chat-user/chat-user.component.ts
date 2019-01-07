import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from "../chat-service";
import { ActivatedRoute } from '@angular/router';
import {Room} from "../room";
import { timer } from 'rxjs';
import {Message} from "../message";

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss']
})
export class ChatUserComponent implements OnInit ,OnDestroy{
  userName: string;
  chatMessage: String;
  time;

  chats: any[] = [];
  rooms: any[] = [];
  currentRoom: Room;
  users: any[];
  roomName: String;
  messages: Message[];

  source = timer(0,60000);
//output: 0
   subscribe;


  constructor(    private route: ActivatedRoute,
                  private chatService: ChatService) { }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }

  getRooms(): void {
    this.chatService.getRooms()
      .subscribe(rooms => this.rooms = rooms);
  }

  saveChatUser(userName) {
    this.userName = userName;

    this.getRooms();
    this.getCurrentRoom(this.currentRoom);
    // Adds the timer to count the number of minutes the user is logged in for.
    this.subscribe = this.source.subscribe(val => this.time = val);
  }

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

  // getMessages(room) {
  //   console.log('get message for room ', room);
  //   let id = room ? room.id : 0;
  //   this.chatService.getMessages(id)
  //     .subscribe(messages => {
  //       this.messages = messages;
  //     });
  // }
  sendMessage(message): void {
    message = message.trim();
    if (!message) { return; }
    this.chatService.sendMessages(this.currentRoom.id,{ 'name': this.userName, 'message': message , 'reaction':'happy'})
      .subscribe(message => {
        this.messages.push(message);
      });
  }
  getClassForMessage(displayLeft){
    if (displayLeft) {
      return "message-text";
    } else {
      return "message-text text-right";
    }

  }
}
