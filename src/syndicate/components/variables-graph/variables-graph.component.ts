import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { DataSourceClass } from 'src/models/classes/dataSource';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { SessionStorage } from '../../enums/storage';

@Component({
  selector: 'syndicate-variables-graph',
  templateUrl: './variables-graph.component.html',
  styleUrls: ['./variables-graph.component.scss'],
})
export class VariablesGraphComponent implements OnInit {

  public results: any[] = [];
  public allData = [];
  public dataVariables = [];
  public displayedColumns: string[] = ['visibility', 'color', 'name', 'category', 'ordinateScale', 'action'];
  public yScaleMin = 0;
  public yScaleMax = 0;
  public currentVariables = [];
  public currentSelectedVariable;
  public color: string;

  public scaleList = [];
  dataSource: DataSourceClass;
  dataSubject = new BehaviorSubject<any[]>([]);

  @Input() set data(datas) {
    if (datas) {
      // for each new variables, we must affect isVisible property.
      if (this.results.length > 0) {
        const newVariables: any[] = [];
        datas.forEach((element: any) => {
          const index: number = this.results.findIndex((res: any) => {
            return (res.name === element.name);
          });
          if (index < 0) {
            element['isVisible'] = true;
            newVariables.push(element);
          }
        });
        const oldVariables: any[] = [];

        for (let index: number = 0; index < this.results.length; index += 1) {
          const varIndex: number = datas.findIndex((elem: any) => (elem.name === this.results[index].name));

          if (varIndex >= 0) {
            if (this.results[index].isVisible) {
              this.results[index].series = datas[varIndex].series;
            } else {
              this.results[index].old = datas[varIndex].series;
            }
            oldVariables.push(this.results[index]);
          }
        }
        this.results = [...oldVariables, ...newVariables];
      } else {
        this.results = [...datas];
        // Affect property isVisible for all variables selected.
        for (let index: number = 0; index < this.results.length; index += 1) {
          this.results[index].isVisible = true;
        }
      }
    }
  }

  @Input() set variables(variables) {
    if (variables) {
      this.currentVariables = [...variables];
      this.initScales(variables);
    }
  }

  public colorScheme = {
    domain: [
      '#004289',
      '#087F5B',
      '#862E9C',
      '#A61E4D',
      '#D9480F',
      '#364FC7',
      '#3BCF33',
      '#5F3DC4',
      '#C41037',
      '#FF922B',
      '#22B8CF',
      '#94D82D',
      '#B533CF',
      '#FA5252',
      '#CFB133',
      '#4DABF7',
      '#63E6BE',
      '#CC5DE8',
      '#F06595',
      '#FFD43B',
      '#99E9F2',
      '#0B7285',
      '#845EF7',
      '#FFA8A8',
      '#FFC078'
    ]
  };

  @Output() checkVariablesList = new EventEmitter();

  constructor(private storageService: SyndicateStorageService) { }

  ngOnInit() {
    this.dataSource = new DataSourceClass(this.dataSubject);
  }

  /**
   *
   */
  initScales(variables) {
    this.currentSelectedVariable = this.storageService.fetchSorting(SessionStorage.SYNDICATE_GRAPH_SCALING_VARIABLE);

    this.scaleList = this.storageService.fetchSorting(SessionStorage.SYNDICATE_GRAPH_SCALING) || [];

    if (this.scaleList && this.scaleList.length > 0) {
      this.scaleList.forEach((scale) => {
        this.currentVariables.forEach((data) => {
          if (data.vId === scale.vId) {
            data.minScale = scale.minScale;
            data.maxScale = scale.maxScale;
          }
          if (data.vId === this.currentSelectedVariable) {
            this.yScaleMin = data.minScale;
            this.yScaleMax = data.maxScale;
          }
        });
      });
    }
    this.dataVariables = [...variables];
    this.dataSubject.next(variables);
  }

  /**
   * Format the date to display its on the graph
   * @param value The value to transform
   */
  xFormatting(value): string {
    const date = moment.utc(value).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date).toDate();
    const local = moment(stillUtc).local().format('HH:mm:ss');

    return local;
  }

  /**
   * Check the variable and apply the scale on the graph
   * @param variable The selected variable
   */
  onChecked(variable) {
    this.currentSelectedVariable = variable.vId;

    this.storageService.storeSorting(SessionStorage.SYNDICATE_GRAPH_SCALING_VARIABLE, this.currentSelectedVariable);

    this.yScaleMin = variable.minScale;
    this.yScaleMax = variable.maxScale;
  }

  /**
   * @param event Event of the output
   * @param index index of variable to set color
   */
  onSelected(event: string, index: string | number): void {
    this.colorScheme.domain[index] = event;
    this.results = [...this.results];
  }

  /**
   * Change detection when the user click on the radio button
   * Apply the scale defined by the user in min and max input
   * @param variable The selected variable
   */
  onChange(variable: any): void {

    const scales = {
      vId: variable.vId,
      minScale: variable.minScale,
      maxScale: variable.maxScale
    };

    if (this.currentSelectedVariable === variable.vId) {
      this.yScaleMin = variable.minScale;
      this.yScaleMax = variable.maxScale;
    }

    if (this.scaleList && this.scaleList.length > 0) {
      if (this.containsObject(variable, this.scaleList)) {
        this.scaleList.forEach((scale) => {
          if (scale.vId === variable.vId) {
            scale.minScale = variable.minScale;
            scale.maxScale = variable.maxScale;
          }
        });
      } else {
        this.scaleList.push(scales);
      }
    } else {
      this.scaleList.push(scales);
    }
    this.storageService.storeSorting(SessionStorage.SYNDICATE_GRAPH_SCALING, this.scaleList);
  }

  /**
   * Check if the object passed in param is in the list passed in param too
   * @param obj The object
   * @param list The array
   * @returns a boolean
   */
  containsObject(obj, list): boolean {
    return list.some(elem => elem.vId === obj.vId);
  }

  /**
   * Hide the selected variable in the graph
   * @param variableIndex The index of the variable in the datatable
   */
  onHide(variableIndex: number) {
    const graphData = [...this.results];
    // Save the data in a new property (old).
    graphData[variableIndex].old = graphData[variableIndex].series;
    graphData[variableIndex].series = [];
    graphData[variableIndex].isVisible = false;
    this.results = [...graphData];
  }

  /**
   * Show the selected variable in the graph
   * @param variableIndex The index of the variable in the datatable
   */
  onShow(variableIndex: number) {
    const graphData = [...this.results];
     // Restore data in order to show the curve.
    graphData[variableIndex].series = graphData[variableIndex].old;
    graphData[variableIndex].old = [];
    graphData[variableIndex].isVisible = true;
    this.results = [...graphData];
  }

  /**
   * Remove the selected variable in the array and update the graph
   * Store the new list of variables in session
   * @param element The selected variable
   */
  onRemove(variable) {
    const graphData = [...this.results];
    const data = [...this.dataVariables];

    this.results = graphData.filter(data => data.name !== variable.vId);
    this.dataVariables = data.filter((data) => {
      return data.vId !== variable.vId;
    });

    this.dataSubject.next(this.dataVariables);

    this.currentSelectedVariable = this.currentSelectedVariable === variable.vId ? '' : this.currentSelectedVariable;

    this.scaleList = this.scaleList.filter((scale) => {
      return scale.vId !== variable.vId;
    });

    this.storageService.storeSorting(SessionStorage.SYNDICATE_GRAPH_SCALING, this.scaleList);
    this.storageService.storeSorting(SessionStorage.SYNDICATE_GRAPH_SCALING_VARIABLE, this.currentSelectedVariable);

    this.storageService.storeSorting(SessionStorage.SYNDICATE_VARIABLES, this.dataVariables);
    this.checkVariablesList.emit(this.dataVariables);
  }
}
