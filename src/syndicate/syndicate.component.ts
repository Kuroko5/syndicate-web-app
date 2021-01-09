import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { LocalStorage } from './enums/storage';
import { ListsService } from './services/lists.service';
import { IconsService } from './services/loadIcons.service';
import { SyndicateStorageService } from './services/storage.service';

@Component({
  selector: 'syndicate-root',
  templateUrl: './syndicate.component.html',
  styleUrls: ['./syndicate.component.scss']
})
export class SyndicateComponent implements OnInit {

  constructor(
    private iconsService: IconsService,
    private listsService: ListsService,
    private storageService: SyndicateStorageService,
    private router: Router) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.url === '/') {
          localStorage.removeItem('currentUserToken');
        }
      }
    });
  }

  ngOnInit(): void {
    this.iconsService.loadIcons();
    this.getCategories();
  }

  /**
   * Get all categories when the app starting
   * Save the list of categories in the local storage
   */
  getCategories(): void {
    this.listsService.getAllCategories().subscribe(
      (categories) => {
        this.storageService.storeInLocal(LocalStorage.SYNDICATE_CATEGORIES, categories.data);
      },
      (error) => {
        console.log(error);
      },
    );
  }
}
