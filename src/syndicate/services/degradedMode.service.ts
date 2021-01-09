import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from './api.service';

@Injectable()
export class DegradedModeService {

  constructor(private apiService: APIService) {}

  /**
   * Get all available mode/skill list
   */
  getDegradedModes(): Observable<any> {
    return this.apiService.get(`skills`);
  }

  /**
   * Start a mode/skill
   * @param modeId The id of the selected mode to start
   */
  startDegradedMode(modeId): Observable<any> {
    return this.apiService.post(`skills/start`, {
      idSkill: modeId
    });
  }

  /**
   * Stop a mode/skill
   * @param modeId The id of the selected mode to start
   */
  stopDegradedMode(modeId): Observable<any> {
    return this.apiService.post(`skills/stop`, {
      idSkill: modeId
    });
  }
}
