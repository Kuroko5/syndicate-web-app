import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/syndicate/services/auth.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';


@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  public user: string[] = [];

  constructor(
    public router: Router,
    private authService: AuthService,
    private storageService: SyndicateStorageService) {
  }

  ngOnInit() {
    this.getUser();
  }

  /**
   * Return concatenation of User initials
   * @param username The username
   */
  public getUser(): void {
    const decodedToken = this.authService.decodeToken();

    this.user = decodedToken.username.split('.');
  }

  /**
   * Redirect to the home page (Dashboard)
   */
  public onGoToHome(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Logout function
   * Navigate to Login page
   */
  public onLogout(): void {
    localStorage.removeItem('currentUserToken');
    this.storageService.clearSessionStorage();
    this.router.navigate(['/']);
  }

  /**
   * Redirect to administration page
   *
   * @memberOf {LayoutComponent}
   */
  public onAdmin(): void {
    this.router.navigate(['/admin']);
  }

  /**
   * Redirect to configuration page
   *
   * @memberOf {LayoutComponent}
   */
  public onConfig(): void {
    this.router.navigate(['/config']);
  }
}
