import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { I18NextService } from 'angular-i18next';
import { Observable } from 'rxjs';
import { Parameter } from '../../../../../models/api/parameter.model';
import { Profile } from '../../../../../models/api/profile.model';
import { View } from '../../../../../models/api/view.model';
import { ConfirmComponent } from '../../../../components/modals/confirm/confirm.component';
import { PermissionsService } from '../../../../services/permissions.service';
import { ProfilesService } from '../../../../services/profiles.service';
import { ViewsService } from '../../../../services/views.service';

@Component({
  selector: 'syndicate-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit, AfterViewInit {

  private _id: string;
  private name: string = '';
  private description: string = '';
  private selectedPermissions: Parameter[] = [];
  private selectedViews: View[] = [];
  private stepperLength: number = 0;

  @ViewChild('stepper', { static: false }) matStepper: MatHorizontalStepper;

  public pageName: string;

  public profileForm: FormGroup;
  public currentStepIndex: number = 0;
  // flag to know if the component is in update mode or not
  public update: boolean = false;
  public allPermissions: any[];
  public allViews: any[];

  constructor(
    private permissionsService: PermissionsService,
    private viewsService: ViewsService,
    private profilesService: ProfilesService,
    private i18nextService: I18NextService,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) { }

  /**
   * Utility method to build the form group used in the fist step
   *
   * @memberOf {ProfileFormComponent}
   */
  private buildForm(): void {
    this.profileForm = this.formBuilder.group({
      name: [this.name, Validators.required],
      description: [this.description, Validators.required],
    });
  }

  /**
   * Filter the list of permissions to group by category
   *
   * @param permissions - list of all possible permissions
   * @memberOf {ProfileFormComponent}
   */
  private filterPermissions(permissions: any[]): void {
    const filteredPermissions: any = {};
    for (const permission of permissions) {
      if (!filteredPermissions[permission.category]) {
        filteredPermissions[permission.category] = [];
      }
      filteredPermissions[permission.category].push(permission);
    }
    this.allPermissions = [];
    for (const category in filteredPermissions) {
      if (filteredPermissions.hasOwnProperty(category)) {
        this.allPermissions.push(filteredPermissions[category]);
      }
    }
  }

  /**
   * Profile creation and POST to api
   *
   * @memberOf {ProfileFormComponent}
   */
  private createProfile(): void {
    const profile: Profile = new Profile();
    profile.label = this.profileForm.controls.name.value;
    profile.description = this.profileForm.controls.description.value;
    profile.permissions = [];
    const flattenedPermissions: any[] = this.allPermissions.reduce((acc: any, val: any): any[] => acc.concat(val), []);
    for (const permission of flattenedPermissions) {
      if (permission.checked) {
        profile.permissions.push(permission);
      }
    }
    profile.views = [];
    for (const view of this.allViews) {
      if (view.checked) {
        profile.views.push(view);
      }
    }
    let apiCall: Observable<any>;
    if (this.update) {
      apiCall = this.profilesService.editProfile(this._id, profile);
    } else {
      apiCall = this.profilesService.createProfile(profile);
    }
    apiCall.subscribe(
      (res: any) => {
        if (res && res.code && res.code === 200) {
          this.router.navigate(['/admin', { index: 1 }]);
        } else {
          console.error(res.message);
        }
      }
    );
  }

  /**
   * Handler for cancel button
   * Opens ConfirmComponent in modal and navigate back to the administration's profile tab upon user's validation
   *
   * @memberOf {ProfileFormComponent}
   */
  private cancelForm(): void {
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
        this.router.navigate(['/admin', { index: 1 }]);
      }
    });
  }

  ngOnInit() {
    this.pageName = this.i18nextService.t('admin.profile.title.create');

    this.route.params.subscribe((params: Params): void => {
      if (params.hasOwnProperty('profile')) {
        this.update = true;
        this.pageName = this.i18nextService.t('admin.profile.title.update');
        const currentProfile: Profile = new Profile().deserialize(JSON.parse(params.profile));
        this._id = currentProfile._id;
        this.name = currentProfile.label;
        this.description = currentProfile.description;
        for (const permission of currentProfile.permissions) {
          if (permission.hasOwnProperty('permissions')) {
            this.selectedPermissions.push(permission['permissions']);
          }
        }
        // flatten the permissions
        this.selectedPermissions = this.selectedPermissions.reduce((acc: any[], val: Parameter): any[] => acc.concat(val), []);
        this.selectedViews = currentProfile.views;
      }
    });

    this.buildForm();
  }

  ngAfterViewInit(): void {
    this.stepperLength = this.matStepper.steps.length;
    this.permissionsService.getPermissions().subscribe(
      (result: any): void => {
        if (result.data) {
          const permissions: any[] = [];
          for (const value of result.data) {
            const obj: any = new Parameter().deserialize(value);
            obj.checked = this.selectedPermissions.some((permission: Parameter): boolean => permission.code === obj.code);
            permissions.push(obj);
          }
          this.filterPermissions(permissions);
        }
        return null;
      },
    );

    this.viewsService.getAll().subscribe(
      (result: any): void => {
        if (result.data && result.data.result) {
          this.allViews = [];
          for (const view of result.data.result) {
            const obj: any = new View().deserialize(view);
            obj.checked = this.selectedViews.some((view: View): boolean => view._id === obj._id);
            this.allViews.push(obj);
          }
        }
      }
    );
  }

  /**
   * Update current step with new value on each step change
   *
   * @param event - event emitted when step is changed
   * @memberOf {ProfileFormComponent}
   */
  onStepChange(event: StepperSelectionEvent): void {
    this.currentStepIndex = event.selectedIndex;
  }

  /**
   * Handler for previous step button
   *
   * @memberOf {ProfileFormComponent}
   */
  previousStepClick(): void {
    if (this.currentStepIndex > 0) {
      this.matStepper.previous();
    } else {
      this.cancelForm();
    }
  }

  /**
   * Handler for next step button
   * If step is last then create or update the station
   *
   * @memberOf {ProfileFormComponent}
   */
  nextStepClick(): void {
    if (this.currentStepIndex < (this.stepperLength - 1)) {
      this.matStepper.next();
    } else if (this.currentStepIndex === (this.stepperLength - 1)) {
      this.createProfile();
    }
  }

  /**
   * Handler for permission's checkbox change output
   *
   * @param event - event emitted
   * @param i - index of permission's category to (un)check
   * @param j - index of permission to (un)check
   * @memberOf {ProfileFormComponent}
   */
  onPermissionChecked(event: MatCheckboxChange, i: number, j: number): void {
    this.allPermissions[i][j].checked = event.checked;
  }

  /**
   * Handler for view's checkbox change output
   *
   * @param event - event emitted
   * @param index - index of view to (un)check
   * @memberOf {ProfileFormComponent}
   */
  onViewChecked(event: MatCheckboxChange, index: number): void {
    this.allViews[index].checked = event.checked;
  }

  /**
   * Handler for permission's category's checkbox change output
   *
   * @param event - event emitted
   * @param index - index of permission's category to (un)check all permissions
   * @memberOf {ProfileFormComponent}
   */
  onCheckedAll(event: MatCheckboxChange, index: number): void {
    const category: any = this.allPermissions[index];
    for (const permission of category) {
      permission.checked = event.checked;
    }
  }

  /**
   * Utility method to know if all the permission in one category are checked or not
   *
   * @param index - index of the permission's category to verify
   * @return true if all checkboxes are checked, false otherwise
   * @memberOf {ProfileFormComponent}
   */
  allChecked(index: number): boolean {
    return this.allPermissions[index] && this.allPermissions[index].every((p: any) => p.checked);
  }

  /**
   * Utility method to determine if the checkbox should be in indeterminate mode or not
   *
   * @param index - index of the permission's category to verify
   * @return true if at least one category is checked, false otherwise
   * @memberOf {ProfileFormComponent}
   */
  someChecked(index: number): boolean {
    if (!this.allPermissions[index]) {
      return false;
    }
    const checked: number = this.allPermissions[index].filter((p: any) => p.checked).length;
    return checked > 0 && checked < this.allPermissions[index].length;
  }

  /**
   * Utility method to determine if at least one permission is checked
   *
   * @return true if one permission is checked, false otherwise
   * @memberOf {ProfileFormComponent}
   */
  permissionsChecked(): boolean {
    if (this.allPermissions) {
      const flattenedPermissions: any[] = this.allPermissions.reduce((acc: any, val: any): any[] => acc.concat(val), []);
      for (const permission of flattenedPermissions) {
        if (permission.checked) {
          return true;
        }
      }
    }
    return false;
  }
}
