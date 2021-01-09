import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { I18NextService } from 'angular-i18next';
import { Observable } from 'rxjs';
import { Profile } from '../../../../../models/api/profile.model';
import { ConfirmComponent } from '../../../../components/modals/confirm/confirm.component';
import { ProfilesService } from '../../../../services/profiles.service';
import { UsersService } from '../../../../services/users.service';

interface ICheckedProfile extends Profile {
  checked?: boolean;
}

@Component({
  selector: 'syndicate-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, AfterViewInit {

  private identifier: string;
  private id: string;
  private selectedProfiles: ICheckedProfile[];

  public pageName: string;
  public update: boolean = false;
  public userForm: FormGroup;
  public profileList: ICheckedProfile[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private i18nextService: I18NextService,
    private profilesService: ProfilesService,
    private dialog: MatDialog,
    private usersService: UsersService,
  ) { }

  /**
   * Utility method to build the form group used in the fist step
   *
   * @memberOf {ProfileFormComponent}
   */
  private buildForm(): void {
    this.userForm = this.formBuilder.group({
      identifier: [this.identifier, Validators.required],
      password: [],
    });
  }

  ngOnInit() {
    this.pageName = this.i18nextService.t('global.pages.name.user');

    this.route.params.subscribe((params: Params): void => {
      if (params.hasOwnProperty('user')) {
        this.update = true;
        const currentUser: any = JSON.parse(params.user);
        this.identifier = currentUser.username;
        this.id = currentUser._id;
        this.selectedProfiles = currentUser.profiles;
      }
    });

    this.buildForm();
  }

  ngAfterViewInit() {
    this.profilesService.getAll().subscribe(
      (res: any) => {
        if (res && res.data && res.data.result) {
          this.profileList = [];
          for (const profile of res.data.result) {
            const obj: ICheckedProfile = new Profile().deserialize(profile);
            if (this.selectedProfiles) {
              obj.checked = this.selectedProfiles.some((profile: ICheckedProfile): boolean => profile._id === obj._id);
            } else {
              obj.checked = false;
            }
            this.profileList.push(obj);
          }
        }
      },
    );
  }

  /**
   * Handler for checkbox change event
   *
   * @param event - event triggered
   * @param index - index of checkbox changed
   * @memberOf {UserFormComponent}
   */
  onProfileCheck(event: MatCheckboxChange, index: number): void {
    this.profileList[index].checked = event.checked;
  }

  /**
   * Utility method to know if at least one profile is checked for the user
   *
   * @memberOf {UserFormComponent}
   */
  profileChecked(): boolean {
    return this.update || this.profileList.some((p: ICheckedProfile): boolean => p.checked);
  }

  /**
   * Handler for cancel button
   * Opens ConfirmComponent in modal and navigate back to the administration's user tab upon user's validation
   *
   * @memberOf {UserFormComponent}
   */
  onCancel(): void {
    this.dialog.open(ConfirmComponent, {
      data: {
        important: true,
        message: this.i18nextService.t('global.action.cancel')
      },
      width: '520px',
      height: 'auto',
      autoFocus: false
    }).afterClosed().subscribe((res: boolean): void => {
      if (res) {
        // redirect to admin page on profile tab (tab index 1)
        this.router.navigate(['/admin']);
      }
    });
  }

  /**
   * click on submit button
   * POST new user or PUT current user depending on update flag
   *
   * @memberOf {UserFormComponent}
   */
  onSubmit(): void {
    if (this.userForm.valid) {
      const body: any = {
        username: this.userForm.controls.identifier.value,
        password: this.userForm.controls.password.value,
        profiles: this.profileList.filter((p: ICheckedProfile) => p.checked),
      };
      let apiCall: Observable<any>;
      if (this.update) {
        apiCall = this.usersService.editUser(this.id, body);
      } else {
        apiCall = this.usersService.create(body);
      }
      apiCall.subscribe(
        (res: any) => {
          if (res && res.code === 200) {
            this.router.navigate(['admin']);
          } else {
            console.error(res.message);
          }
        }
      );
    }
  }

}
