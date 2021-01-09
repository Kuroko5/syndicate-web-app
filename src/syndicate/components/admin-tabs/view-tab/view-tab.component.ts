import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { I18NextService } from 'angular-i18next';
import { ConfirmComponent } from 'src/syndicate/components/modals/confirm/confirm.component';
import { PositionComponent } from 'src/syndicate/components/modals/position/position.component';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { ViewsService } from 'src/syndicate/services/views.service';
import { SessionStorage } from '../../../enums/storage';

@Component({
  selector: 'syndicate-view-tab',
  templateUrl: './view-tab.component.html',
  styleUrls: ['./view-tab.component.scss']
})
export class ViewTabComponent implements OnInit {
  public views: any[] = [];
  public count: number = 0;
  public deletedViewIndex: number = null;

  constructor(
    private i18nextService: I18NextService,
    private dialog: MatDialog,
    private sessionStorage: SyndicateStorageService,
    private viewsService: ViewsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initViews();
  }

  /**
   * Initializes the views datatable
   * If a sort is saved in session then
   * its applied during data recovery otherwise
   * its the view sort that is applied
   *
   * @memberOf {ViewTabComponent}
   */
  initViews(): void {
    const sorting: any = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_VIEWS);
    if (sorting) {
      this.fetchViews(sorting.page, sorting.limit, sorting.column, sorting.sort);
    } else {
      this.fetchViews(1, 25, 'position', 1);
    }
  }

  /**
   * Get views with pagination and sorting
   * @param page - The desired page
   * @param limit - The number of the displayed data
   * @param column - The selected column to apply the sort
   * @param sort - The applied sort
   *
   * @memberOf {ViewTabComponent}
   */
  fetchViews(page: number, limit: number, column: string, sort: number): void {
    this.viewsService.getViews(page, limit, column, sort).subscribe(
      (views: any) => {
        this.views = views.data.result;
        this.count = views.data.count;
        this.sessionStorage.storeSorting(SessionStorage.SYNDICATE_SORTING_VIEWS, {
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
   * Refresh the views datatable with the desired sort and pagination
   * @param event - Contains the desired page, limit, column and sort and to apply on views
   *
   * @memberOf {ViewTabComponent}
   */
  onRefreshView(event: any): void {
    this.fetchViews(event.page, event.limit, event.column, event.sort);
  }

  /**
   * Open Modal to create new View
   * Set default data
   *
   * @memberOf {ViewTabComponent}
   */
  onCreateView(): void {
    this.router.navigate(['admin', 'view', 'create']);
  }

  /**
   * Redirect to the view form for modification
   *
   * @param event - The selected item to edit
   * @memberOf {ViewTabComponent}
   */
  onEditView(event: any): void {
    this.router.navigate(['admin', 'view', 'create', { view: JSON.stringify(event) }]);
  }

  /**
   * Open confirmation dialog to remove the selected view
   * @param event - The selected item to remove
   *
   * @memberOf {ViewTabComponent}
   */
  onRemoveView(event: any): void {
    this.dialog.open(ConfirmComponent, {
      data: {
        important: true,
        message: this.i18nextService.t('admin.delete.view')
      },
      width: '520px',
      height: 'auto',
      autoFocus: false
    })
    .afterClosed().subscribe((res: any) => {
      if (res) {
        this.deletedViewIndex = event.index;
        this.viewsService.deleteView(event.row._id).subscribe(
          (res: any) => {
            if (res) {
              this.deletedViewIndex = null;
              const sorting: any = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_VIEWS);
              this.fetchViews(sorting.page, sorting.limit, sorting.column, sorting.sort);
            }
          },
          (error: any) => {
            console.error(error);
            this.deletedViewIndex = null;
          },
        );
      }
    });
  }

  /**
   * Open popup to change position of the views
   *
   * @memberOf {ViewTabComponent}
   */
  changePosition(): void {
    this.dialog.open(PositionComponent, {
      data: {
        title: 'admin.view.arrange.title',
        description: 'admin.view.arrange.description',
        list: this.views
      },
      width: '500px',
      height: 'auto',
      autoFocus: false
    })
    .afterClosed().subscribe((views: any) => {
      // reorder and reload views
      if (views) {
        this.viewsService.updatePosition({ views }).subscribe(
          (res: any) => {
            if (res.code === 200) {
              this.fetchViews(1, 25, 'position', 1);
            }
          },
          (error: any) => {
            console.error(error);
          });
      }
    });
  }

}
