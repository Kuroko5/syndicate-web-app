import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[syndicatePermissions]'
})
export class PermissionsDirective {

  private perm: any;
  private user: any;
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {

    this.user = JSON.parse(localStorage.getItem('user'));
    this.perm = this.user.permissions;
  }

  @Input() set syndicatePermissions(permissions: string[]) {
    let unAuthorized: boolean = false;
    for (const permission of permissions) {
      if (this.perm.indexOf(permission) === -1) {
        unAuthorized = true;
        break;
      }
    }
    unAuthorized ? this.viewContainer.clear() : this.viewContainer.createEmbeddedView(this.templateRef);
  }
}
