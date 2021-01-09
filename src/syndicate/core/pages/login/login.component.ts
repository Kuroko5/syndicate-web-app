import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserCredentials } from 'src/models/interfaces/userCredentials';
import { AuthService } from 'src/syndicate/services/auth.service';
import { UsersService } from 'src/syndicate/services/users.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public loading = false;
  public wrongCredentials = false;
  public show: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UsersService
  ) {
    this.buildForms();
  }

  ngOnInit() {
  }

  /**
   * Build the login form
   */
  buildForms(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Show or hide password.
   */
  password() {
    this.show = !this.show;
  }

  /**
   * Check the login form then passing credentials to the api
   */
  login(): void {
    if (this.loginForm.valid) {
      this.wrongCredentials = false;
      this.loading = true;

      const credentials: UserCredentials = {
        username: this.loginForm.value.username.trim(),
        password: this.loginForm.value.password.trim()
      };

      this.authService.login(credentials).subscribe(
        (res: any): void => {
          if (res) {
            this.loading = false;
            localStorage.setItem('currentUserToken', res.token);
            this.userService.getUserRight().subscribe((res) => {
              if (res) {
                localStorage.setItem('user', JSON.stringify(res));
                if (res.permissions.includes('DASHBOARD')) {
                  this.router.navigateByUrl('/dashboard');
                } else {
                  this.router.navigateByUrl('/home');
                }
              }
            });
          }
        },
        (): void => {
          this.loading = false;
          this.wrongCredentials = true;
        },
      );
    }
  }
}
