import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { I18NextService } from 'angular-i18next';
import { ConfirmComponent } from 'src/syndicate/components/modals/confirm/confirm.component';
import { UserDescriptionComponent } from 'src/syndicate/components/modals/user-description/user-description.component';
import { ProfilesService } from 'src/syndicate/services/profiles.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { UsersService } from 'src/syndicate/services/users.service';
import { SessionStorage } from '../../../enums/storage';

@Component({
  selector: 'syndicate-user-tab',
  templateUrl: './user-tab.component.html',
  styleUrls: ['./user-tab.component.scss']
})
export class UserTabComponent implements OnInit {
  public users: any[] = [];
  public profiles: any[] = [];
  public count: number = 0;
  public deletedUserIndex: number = null;

  constructor(
    private i18nextService: I18NextService,
    private dialog: MatDialog,
    private sessionStorage: SyndicateStorageService,
    private usersService: UsersService,
    private profilesService: ProfilesService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initUsers();
    this.fetchProfiles();
  }

  /**
   * Initializes the users datatable
   * If a sort is saved in session then
   * its applied during data recovery otherwise
   * its the user sort that is applied
   *
   * @memberOf {UserTabComponent}
   */
  initUsers(): void {
    const sorting: any = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_USERS);
    if (sorting) {
      this.fetchUsers(sorting.page, sorting.limit, sorting.column, sorting.sort);
    } else {
      this.fetchUsers(1, 25, 'createdAt', -1);
    }
  }

  /**
   * Get users with pagination and sorting
   * @param page - The desired page
   * @param limit - The number of the displayed data
   * @param column - The selected column to apply the sort
   * @param sort - The applied sort
   *
   * @memberOf {UserTabComponent}
   */
  fetchUsers(page: number, limit: number, column: string, sort: number): void {
    this.usersService.getUsers(page, limit, column, sort).subscribe(
      (users: any) => {
        this.users = users.data.result;
        this.count = users.data.count;
        this.sessionStorage.storeSorting(SessionStorage.SYNDICATE_SORTING_USERS, {
          page,
          limit,
          column,
          sort,
        });
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Get all profiles
   *
   * @memberOf {UserTabComponent}
   */
  fetchProfiles(): void {
    this.profilesService.getAll().subscribe(
      (profiles: any) => {
        this.profiles = profiles.data.result;
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Refresh the users datatable with the desired sort and pagination
   * @param event - Contains the desired page, limit, column and sort and to apply on users
   *
   * @memberOf {UserTabComponent}
   */
  onRefreshUser(event: any): void {
    this.fetchUsers(event.page, event.limit, event.column, event.sort);
  }

  /**
   * Open Modal to create new User
   * Set default data
   *
   * @memberOf {UserTabComponent}
   */
  onCreateUser(): void {
    this.router.navigate(['admin', 'user', 'create']);
  }

  /**
   * Open Modal to edit the selected user
   * @param event - The selected item to edit
   *
   * @memberOf {UserTabComponent}
   */
  onEditUser(event: any): void {
    this.router.navigate(['admin', 'user', 'create', { user: JSON.stringify(event) }]);
  }

  /**
   * Display the detail of the selected user on a modal
   * @param event - The object relating to the selected user
   *
   * @memberOf {UserTabComponent}
   */
  onDisplayUserDetail(event: any): void {
    this.dialog.open(UserDescriptionComponent, {
      data: event,
      width: '600px',
      height: 'auto'
    });
  }

  /**
   * Open confirmation dialog to remove the selected user
   * @param event - The selected item to remove
   *
   * @memberOf {UserTabComponent}
   */
  onRemoveUser(event: any): void {
    this.dialog.open(ConfirmComponent, {
      data: {
        important: true,
        message: this.i18nextService.t('admin.delete.user')
      },
      width: '520px',
      height: 'auto',
      autoFocus: false
    })
    .afterClosed().subscribe((res: any) => {
      if (res) {
        this.deletedUserIndex = event.index;
        this.usersService.deleteUser(event.row._id).subscribe(
          (res: any) => {
            if (res) {
              this.deletedUserIndex = null;
              const sorting: any = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_USERS);
              this.fetchUsers(sorting.page, sorting.limit, sorting.column, sorting.sort);
            }
          },
          (error: any) => {
            console.error(error);
            this.deletedUserIndex = null;
          });
      }
    });
  }
}
