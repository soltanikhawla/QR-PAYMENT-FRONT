import { Component } from '@angular/core';
import { User } from 'src/app/_Model/User';
import { UserService } from 'src/app/_Services/user.service';

@Component({
  selector: 'app-list-of-users',
  templateUrl: './list-of-users.component.html',
  styleUrls: ['./list-of-users.component.scss']
})
export class ListOfUsersComponent {
  user: User[] = [];
constructor(private userService:UserService){}
 ngOnInit():void{
  this.getAllUsers()
 }
getAllUsers(){
  this.userService.getAllUsers().subscribe(data=>{
    this.user=data;
  })
}
}
