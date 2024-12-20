import { Component } from '@angular/core';
import { UserService } from 'src/app/_Services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(private userService: UserService) {}
  
  ngOnInit(): void {}
}
