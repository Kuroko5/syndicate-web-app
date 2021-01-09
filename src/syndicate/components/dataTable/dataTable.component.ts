import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { tap } from 'rxjs/operators';
import { DataSourceClass } from 'src/models/classes/dataSource';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { CounterType } from '../../enums/counter-type.enum';
import { SessionStorage } from '../../enums/storage';

@Component({
  selector: 'syndicate-datatable',
  templateUrl: './dataTable.component.html',
  styleUrls: ['./dataTable.component.scss']
})
export class DataTableComponent implements OnInit, AfterViewInit {


  public count = 0;
  public deletedIndex = null;
  public defaultselect = 'all';
  public defaultVarSelect: string = '';
  public currentSelect = 'all';
  public currentVarSelect: string = '';
  public currentSearch = '';
  public currentDates = {
    min: '',
    max: ''
  };
  public listOfCol = [
    'type',
    'result',
    'condition',
    'updatedAt',
    'createdAt',
    'd',
    'operator',
    't',
    'startDate',
    'endDate',
    'documentCategory',
    'documentType',
    'reportType',
    'enable',
    'device',
    'date',
    'variable'
  ];
  public counterType: typeof CounterType = CounterType;
  @Input() options = [];
  @Input() variablesOptions: any[] = [];
  @Input() selectLabel = '';
  @Input() selectVariable: string = '';
  @Input() type = '';
  @Input() selectType = '';
  @Input() addLabel: string = '';
  @Input() addPermission: string = '';
  @Input() editPermission: string = '';
  @Input() deletePermission: string = '';
  @Input() import: boolean = false;
  @Input() export: boolean = false;
  @Input() importPermission: string = '';
  @Input() exportPermission: string = '';
  @Input() inputSearch;
  @Input() inputSelect;
  @Input() set data(data) {
    if (data) {
      this.dataSubject.next(data);
    }
  }

  @Input() set dataCount(count) {
    if (count) {
      this.count = count;
    }
  }

  @Input() set deletedItemIndex(index) {
    index ? this.deletedIndex = index : this.deletedIndex = null;
  }

  @Input() select = false;
  @Input() footer = false;
  @Input() searchbar = false;
  @Input() datepicker = false;
  @Input() add: boolean = false;
  @Input() displayedColumns: any[] = [];
  @Input() pageSizeOptions: any[] = [];

  @Output() removeEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() editEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() refreshDataEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() displayDetailEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() resetEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() addEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() importEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() exportEmitter: EventEmitter<any> = new EventEmitter<any>();

  dataSource: DataSourceClass;
  dataSubject = new BehaviorSubject<any[]>([]);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private storageService: SyndicateStorageService
  ) { }

  ngOnInit() {
    this.dataSource = new DataSourceClass(this.dataSubject);

    let sort: any;

    switch (this.type) {
      case 'defaults':
        sort = this.fetchSorting(SessionStorage.SYNDICATE_SORTING_DEFAULTS, 'd', 'desc');
        if (sort) {
          this.defaultselect = sort.defaultselect;
        }
        break;
      case 'alarms':
        sort = this.fetchSorting(SessionStorage.SYNDICATE_SORTING_ALARMS, 'd', 'desc');
        if (sort) {
          this.defaultselect = sort.defaultselect;
        }
        break;
      case 'historical':
        sort = this.fetchSorting(SessionStorage.SYNDICATE_SORTING_HISTORICAL, 'startDate', 'desc');
        if (sort) {
          this.defaultselect = sort.defaultselect;
          this.currentSearch = sort.defaultSearch;
          this.currentSelect = sort.defaultselect;
          this.currentDates = sort.defaultDates;
        }
        break;
      case 'report':
        sort = this.fetchSorting(SessionStorage.SYNDICATE_SORTING_REPORTS, 'name', 'desc');
        if (sort) {
          this.defaultselect = sort.defaultselect;
          this.currentSelect = sort.defaultselect;
        }
        if (this.inputSearch) {
          this.currentSearch = this.inputSearch;
        }
        break;
      case 'variables':
        sort = this.fetchSorting(SessionStorage.SYNDICATE_SORTING_VARIABLES, 'vId', 'asc');
        if (sort) {
          this.defaultselect = sort.defaultselect;
          this.currentSearch = sort.defaultSearch;
          this.currentSelect = sort.defaultselect;
        }
        break;
      case 'config_variables':
        sort = this.fetchSorting(SessionStorage.SYNDICATE_SORTING_VARIABLES_CONFIG, 'vId', 'asc');
        if (sort) {
          this.defaultselect = sort.defaultselect;
          this.currentSearch = sort.defaultSearch;
          this.currentSelect = sort.defaultselect;
          this.defaultVarSelect = sort.varSelect;
          this.currentVarSelect = sort.varSelect;
        }
        break;
      case 'condition':
        sort = this.fetchSorting(SessionStorage.SYNDICATE_SORTING_CONDITIONS, 'descr', 'asc');
        break;
      case 'document':
        sort = this.fetchSorting(SessionStorage.SYNDICATE_SORTING_DOCUMENTS, 'title', 'asc');
        if (sort) {
          this.defaultselect = sort.defaultselect;
          this.currentSearch = sort.defaultSearch;
          this.currentSelect = sort.defaultselect;
        }
        if (this.inputSearch) {
          this.currentSearch = this.inputSearch;
        }
        if (this.inputSelect) {
          this.defaultselect = this.inputSelect;
          this.currentSelect = this.inputSelect;
        }
        break;
      case 'users':
        sort = this.fetchSorting(SessionStorage.SYNDICATE_SORTING_USERS, 'createdAt', 'desc');
        if (sort) {
          this.defaultselect = sort.defaultselect;
          this.currentSelect = sort.defaultselect;
        }
        break;
      case 'profiles':
        sort = this.fetchSorting(SessionStorage.SYNDICATE_SORTING_PROFILES, 'createdAt', 'desc');
        if (sort) {
          this.defaultselect = sort.defaultselect;
          this.currentSelect = sort.defaultselect;
        }
        break;
      case 'views':
        sort = this.fetchSorting(SessionStorage.SYNDICATE_SORTING_VIEWS, 'position', 'asc');
        if (sort) {
          this.defaultselect = sort.defaultselect;
          this.currentSelect = sort.defaultselect;
        }
        break;
      case 'devices':
        sort = this.fetchSorting(SessionStorage.SYNDICATE_SORTING_DEVICES, 'createdAt', 'desc');
        if (sort) {
          this.defaultselect = sort.defaultselect;
          this.currentSelect = sort.defaultselect;
        }
        break;
      case 'counter':
        sort = this.fetchSorting(SessionStorage.SYNDICATE_SORTING_COUNTERS, 'label', 'asc');
        if (sort) {
          this.defaultselect = sort.defaultselect;
          this.currentSelect = sort.defaultselect;
          this.currentSearch = sort.defaultSearch;
        }
        break;
      case 'config_counter':
        sort = this.fetchSorting(SessionStorage.SYNDICATE_SORTING_COUNTERS_CONFIG, 'label', 'asc');
        if (sort) {
          this.defaultselect = sort.defaultselect;
          this.currentSelect = sort.defaultselect;
        }
        break;
      default:
        break;
    }
    this.initSort(sort.column, sort.direction);
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      /**
       * Merge the sort observable with the page observable
       * Now a new page load will be triggered in two cases:
       * when a pagination event occurs
       * when a sort event occurs
       */
      merge(this.sort.sortChange, this.paginator.page).pipe(
        tap(() => this.refreshDataEmitter.emit({
          page: this.paginator.pageIndex + 1,
          limit: this.paginator.pageSize,
          sort: this.sort.direction === 'asc' ? 1 : -1,
          column: this.sort.active,
          select: this.currentSelect,
          search: this.currentSearch,
          dates : this.currentDates,
          varSelect: this.currentVarSelect
        }))
      ).subscribe();
    } else {
      merge(this.sort.sortChange).pipe(
        tap(() => this.refreshDataEmitter.emit({
          sort: this.sort.direction === 'asc' ? 1 : -1,
          column: this.sort.active,
          select: this.currentSelect,
          search: this.currentSearch,
          varSelect: this.currentVarSelect
        }))
      ).subscribe();
    }
  }

  /**
   * Fetch and return the saved sorting if exist.
   * If not, applying the default sorting
   * @param storageKey The storage key
   * @param column The column to applying the sorting
   * @param sort The sort direction
   * @returns Return a object with the column and the sorting direction to applying on the datatable
   */
  fetchSorting(storageKey: string, column: string, sort: string): any {
    const sorting = this.storageService.fetchSorting(storageKey);
    if (sorting) {
      return {
        column: sorting.column,
        direction: sorting.sort === 1 ? 'asc' : 'desc',
        defaultselect: sorting.select,
        defaultSearch: sorting.search,
        defaultDates: sorting.dates,
        varSelect: sorting.varSelect
      };
    }
    if (this.type === 'config_variables') {
      return { column, direction: sort, defaultselect: '', defaultSearch: '', varSelect: '' };
    }
    return { column, direction: sort, defaultselect: 'all', defaultSearch: '', varSelect: '' };
  }

  /**
   * Initialize the sort on the datatable
   * @param columnId The column to applying the sorting
   * @param start The direction of the sorting
   */
  initSort(columnId: string, direction: 'desc' | 'asc'): void {
    this.sort.sort({ id: columnId, start: direction, disableClear: true });
  }

  /**
   * Value from the SearchBar
   * @param value Value of the searchBar
   */
  onSend(value): void {
    this.currentSearch = value.trim();
    this.refreshData();
  }

  /**
   * Emitted event to display the detail of the selected item
   * @param row The selected item
   */
  onDisplayDetail(row: any): void {
    this.displayDetailEmitter.emit(row);
  }

  /**
   * Emitted event to reset the value of the selected item
   * @param row The selected item
   */
  onReset(row: any): void {
    this.resetEmitter.emit(row);
  }

  /**
   *
   * @param event Event of the output
   */
  onSelected(event): void {
    this.currentSelect = event;
    this.refreshData();
  }

  /**
   *
   * @param event Event of the output
   */
  onSelectedVariables(event: any): void {
    this.currentVarSelect = event;
    this.refreshData();
  }

  /**
   * Emitted event to add a document
   */
  onAdd() {
    this.addEmitter.emit();
  }

  /**
   * Emitted event to import a document
   */
  onImport() {
    this.importEmitter.emit();
  }
  /**
   * Refresher of data to display
   */
  public refreshData(): void {
    this.refreshDataEmitter.emit({
      page: this.paginator.pageIndex + 1,
      limit: this.paginator.pageSize,
      sort: this.sort.direction === 'asc' ? 1 : -1,
      column: this.sort.active,
      select: this.currentSelect,
      search: this.currentSearch,
      dates: this.currentDates,
      varSelect: this.currentVarSelect
    });
  }

  /**
   *
   */
  onSelectDate(event): void {
    this.currentDates = event;
    this.refreshData();
  }

  /**
   * Emitted event to edit the selected item from the datatable
   * @param row The selected Row
   */
  onEdit(row): void {
    this.editEmitter.emit(row);
  }

  /**
   * Emitted event to remove the selected item from the datatable
   * @param row The selected Row
   */
  onRemove(row, index): void {
    this.removeEmitter.emit({ row, index });
  }

  /**
   * Emitted event to export variables
   */
  onExport(): void {
    this.exportEmitter.emit();
  }
}
