import { Component, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Project } from 'src/app/_Model/Project';
import { User } from 'src/app/_Model/User';
import { MappingService } from 'src/app/_Services/mapping.service';
import { ProjectService } from 'src/app/_Services/project.service';
import { UserService } from 'src/app/_Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  project !: Project;
  listP : any;
  selectedProject:any;
  csvRecords: any[] = [];
  fileT: any;
  targetFileName:string="";
  profileForm: FormGroup;
  accountForm: FormGroup;
  addressForm: FormGroup;
  activeTab: string = 'about';
  pictureUrl: string = 'assets/img/avatars/1.jpg';
constructor(private userService: UserService, projectService:ProjectService,private fb: FormBuilder, private router: Router,){
  this.profileForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  this.accountForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validator: this.passwordMatchValidator });

  this.addressForm = this.fb.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: ['', Validators.required]
  });
}
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');

  }

ngOnInit(){

}

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  nextTab() {
    if (this.activeTab === 'about') {
      this.selectTab('account');
    } else if (this.activeTab === 'account') {
      this.selectTab('address');
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pictureUrl = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  passwordMatchValidator(form: FormGroup) {
    return form.controls['password'].value === form.controls['confirmPassword'].value
      ? null : { 'mismatch': true };
  }
  register() {
    if (this.profileForm.valid) {
      const registerData: User = {
        ...this.profileForm.value,
        username: this.profileForm.value.username,
        email: this.profileForm.value.email,
        password: this.profileForm.value.password,
        // username: this.accountForm.value.username,
        // password: this.accountForm.value.password
      };

this.userService.Register(registerData)
        .subscribe(response => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'User registered successfully',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/projects/list-of-users'])
        }, error => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Registration failed',
            showConfirmButton: false,
            timer: 1500
          });
        });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please fill all the required fields',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
}
