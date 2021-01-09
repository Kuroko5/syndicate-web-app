import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardType } from '../../enums/card-type.enum';

@Component({
  selector: 'syndicate-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() title = '';
  @Input() color = '';
  @Input() type = '';
  @Input() category: string = '';
  @Input() count = 0;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  /**
   * Navigate to the right page
   * Select the right tab index when navigate to the alert page
   */
  onGoToPage(): void {

    if (this.type === CardType.CONDITION) {
      this.router.navigate(['conditions']);
      return;
    }

    if (this.type === CardType.MACHINE) {
      this.router.navigate(['variables']);
      return;
    }

    if (this.type === CardType.REPORT) {
      this.router.navigate(['reports']);
      return;
    }

    let tabIndex = 0;

    switch (this.type) {
      case CardType.DEFAULT:
        tabIndex = 0;
        break;
      case CardType.ALERT:
        tabIndex = 1;
        break;
      default:
        tabIndex = 0;
        break;
    }

    this.router.navigate(['alerts', { tabIndex }]);
  }
}
