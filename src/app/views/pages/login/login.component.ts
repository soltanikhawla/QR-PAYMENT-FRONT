import { UserService } from './../../../_Services/user.service';
import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/_Services/user-auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor( private userService : UserService, 
    private userauthservice : UserAuthService,
    private router : Router) { }

    public showPassword: boolean = false;
    gotoInsc(){

      this.router.navigate(["/Register"])

    }

  ngOnInit(): void {
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  

  login(loginForm: NgForm){
    this.userService.Login(loginForm.value)
      .subscribe(
        (response : any) => {
          console.log("response: " + JSON.stringify(response));
          const roleName = response.user.roles[0].name;
          console.log(roleName)
          this.userauthservice.setRoles(roleName);
          //console.log(response.user.roles[0].name)
          this.userauthservice.setToken(response.jwt);
          console.log(response.user.username)
          localStorage.setItem("user_id", response.user.id);
          localStorage.setItem("user_name", response.user.username);
          //console.log(localStorage.getItem("user_id"));
          //console.log('roleName: ' +roleName)
         
          if(roleName ==='ROLE_ADMIN'){
            this.router.navigate(['/Admin']);
          }else if (roleName ==='ROLE_USER') {
            this.router.navigate(['/dashboard']);
          }else this.router.navigate(['/Login']);
        },
        (error) => {
          console.log(error);
         Swal.fire({ icon: 'error', title: 'Error...', text: 'Please fill the form!'})
        }
      );
  }
  onLoginSuccess(token: string): void {
    // Sauvegarde du token dans le localStorage
    this.userauthservice.saveToken(token);

    // Autres actions après la connexion...
  }


}