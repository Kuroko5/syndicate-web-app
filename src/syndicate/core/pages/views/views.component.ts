import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { I18NextService } from 'angular-i18next';
import { Observable, Subscription } from 'rxjs';
import { PositionComponent } from 'src/syndicate/components/modals/position/position.component';
import { UsersService } from 'src/syndicate/services/users.service';

@Component({
  selector: 'syndicate-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss']
})
export class ViewsComponent implements OnInit, AfterViewInit {

  private viewsSub: Subscription;

  @Input() pageName: string = '';
  public views: any[] = [];
  public selectedIndex: number = 0;
  public id: string = '';
  public views$: Observable<any>;

  constructor(
    private i18nextService: I18NextService,
    private usersService: UsersService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) { }

  /**
   * Compare the position fields to order an array of objects
   *
   * @param a - object to compare
   * @param b - object to compare
   */
  private compare(a: { position: number; }, b: { position: number; }): number {
    return a.position - b.position;
  }

  ngOnInit() {
    this.views$ = this.usersService.getViews();
    this.pageName = this.i18nextService.t('global.pages.name.views');
    // If a param is given, set the index
    this.route.params.subscribe((params: any) => {
      if (params) {
        this.id = params.id;
      }
    });

  }
  ngAfterViewInit() {
    this.initTabs();
  }

  /**
   * Init the views tabs sort by position
   *
   * @memberOf {ViewsComponent}
   */
  initTabs(): void {
    this.viewsSub = this.views$.subscribe(
      (res: any) => {
        if (res && res.views && res.views.length) {
          this.views = res.views.sort(this.compare);
        }
      },
      (error: any) => {
        console.error(error);
      },
      () => {
        this.selectedIndex = this.views.map((element: any) => { return element._id; }).indexOf(this.id);
      }
    );
  }

  /**
   * Open popup to change position of the views
   *
   * @memberOf {ViewsComponent}
   */
  changePosition(): void {
    const list: any[] = this.views.slice(0);
    this.dialog.open(PositionComponent, {
      data: {
        list,
        title: 'views.arrange.title',
        description: 'views.arrange.description'
      },
      width: '500px',
      height: 'auto',
      autoFocus: false
    })
    .afterClosed().subscribe((views: any) => {
      // reorder and reload views
      if (views) {
        this.usersService.updatePosition({ views }).subscribe(
          (res: any) => {
            if (res.code === 200) {
              this.initTabs();
            }
          },
          (error: any) => {
            console.error(error);
          });
      }
    });
  }

  /**
   * On tab change, set selectedIndex value
   *
   * @memberOf {ViewsComponent}
   */
  onTabChanged(event: number): void {
    this.selectedIndex = event;
  }
}
