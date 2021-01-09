import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { I18NextService } from 'angular-i18next';
import { ConfirmComponent } from 'src/syndicate/components/modals/confirm/confirm.component';
import { ProfileDescriptionComponent } from 'src/syndicate/components/modals/profile-description/profile-description.component';
import { ProfilesService } from 'src/syndicate/services/profiles.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { ViewsService } from 'src/syndicate/services/views.service';
import { Profile } from '../../../../models/api/profile.model';
import { SessionStorage } from '../../../enums/storage';

@Component({
  selector: 'syndicate-profile-tab',
  templateUrl: './profile-tab.component.html',
  styleUrls: ['./profile-tab.component.scss']
})
export class ProfileTabComponent implements OnInit {
  public profiles: any[] = [];
  public views: any[] = [];
  public count: number = 0;
  public deletedProfileIndex: number = null;

  constructor(
    private i18nextService: I18NextService,
    private dialog: MatDialog,
    private sessionStorage: SyndicateStorageService,
    private profilesService: ProfilesService,
    private viewsService: ViewsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initProfiles();
    this.fetchViews();
  }

  /**
   * Initializes the profiles datatable
   * If a sort is saved in session then
   * its applied during data recovery otherwise
   * its the profile sort that is applied
   *
   * @memberOf {ProfileTabComponent}
   */
  initProfiles(): void {
    const sorting: any = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_PROFILES);
    if (sorting) {
      this.fetchProfiles(sorting.page, sorting.limit, sorting.column, sorting.sort);
    } else {
      this.fetchProfiles(1, 25, 'createdAt', -1);
    }
  }

  /**
   * Get profiles with pagination and sorting
   * @param page - The desired page
   * @param limit - The number of the displayed data
   * @param column - The selected column to apply the sort
   * @param sort - The applied sort
   *
   * @memberOf {ProfileTabComponent}
   */
  fetchProfiles(page: number, limit: number, column: string, sort: number): void {
    this.profilesService.getProfiles(page, limit, column, sort).subscribe(
      (profiles: any) => {
        this.profiles = profiles.data.result;
        this.count = profiles.data.count;
        this.sessionStorage.storeSorting(SessionStorage.SYNDICATE_SORTING_PROFILES, {
          page,
          limit,
          column,
          sort,
        });
      },
      (error: any) => {
        console.log(error);
      },
    );
  }

  /**
   * Get all views
   * @param page - The desired page
   * @param limit - The number of the displayed data
   * @param column - The selected column to apply the sort
   * @param sort - The applied sort
   *
   * @memberOf {ProfileTabComponent}
   */
  fetchViews(): void {
    this.viewsService.getAll().subscribe(
      (views: any) => {
        this.views = views.data.result;
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Refresh the profiles datatable with the desired sort and pagination
   * @param event - Contains the desired page, limit, column and sort and to apply on profiles
   *
   * @memberOf {ProfileTabComponent}
   */
  onRefreshProfile(event: any): void {
    this.fetchProfiles(event.page, event.limit, event.column, event.sort);
  }

  /**
   * Open Modal to create new Profile
   * Set default data
   *
   * @memberOf {ProfileTabComponent}
   */
  onCreateProfile(): void {
    this.router.navigate(['admin', 'profile', 'create']);
  }

  /**
   * Open Modal to edit the selected profile
   * @param event - The selected item to edit
   *
   * @memberOf {ProfileTabComponent}
   */
  onEditProfile(event: Profile): void {
    this.router.navigate(['admin', 'profile', 'create', { profile: JSON.stringify(event) }]);
  }

  /**
   * Display the detail of the selected profile on a modal
   * @param event - The object relating to the selected profile
   *
   * @memberOf {ProfileTabComponent}
   */
  onDisplayProfileDetail(event: any): void {
    this.dialog.open(ProfileDescriptionComponent, {
      data: event,
      width: '928px',
      height: 'auto'
    });
  }

  /**
   * Open confirmation dialog to remove the selected profile
   * @param event - The selected item to remove
   *
   * @memberOf {ProfileTabComponent}
   */
  onRemoveProfile(event: any): void {
    this.dialog.open(ConfirmComponent, {
      data: {
        important: true,
        message: this.i18nextService.t('admin.delete.profile')
      },
      width: '520px',
      height: 'auto',
      autoFocus: false
    })
    .afterClosed().subscribe(
      (res: any) => {
        if (res) {
          this.deletedProfileIndex = event.index;
          this.profilesService.delete(event.row._id).subscribe(
            (res: any) => {
              if (res) {
                this.deletedProfileIndex = null;
                const sorting: any = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_PROFILES);
                this.fetchProfiles(sorting.page, sorting.limit, sorting.column, sorting.sort);
              }
            },
            (error: any) => {
              console.error(error);
              this.deletedProfileIndex = null;
            },
          );
        }
      },
    );
  }

}
