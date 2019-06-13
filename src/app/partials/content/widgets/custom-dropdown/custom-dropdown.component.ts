import { Component, OnInit, Input } from '@angular/core';
import {
  CustomDropdownConfig,
  CustomDropdownItem
} from './dropdown-config.model';

@Component({
  selector: 'kt-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss']
})
export class CustomDropdownComponent implements OnInit {
  selectedValue: CustomDropdownItem;
  @Input() config: CustomDropdownConfig;

  constructor() {}

  ngOnInit() {
    if (this.config.items) {
      this.selectedValue = this.config.items[0];
    }
  }

  setSelectedValue(item: CustomDropdownItem) {
    this.selectedValue = item;
  }
}
