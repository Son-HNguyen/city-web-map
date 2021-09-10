import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../services/global.service";

@Component({
  selector: 'app-switch-theme',
  templateUrl: './switch-theme.component.html',
  styleUrls: ['./switch-theme.component.css']
})
export class SwitchThemeComponent implements OnInit {
  useDarkTheme: boolean;
  color = 'primary';
  currentTheme: string;
  static readonly CLASS_LIGHT_THEME = 'custom-light-theme';
  static readonly CLASS_DARK_THEME = 'custom-dark-theme';

  constructor(private GLOBALS?: GlobalService) {
    this.useDarkTheme = false;
    this.currentTheme = SwitchThemeComponent.CLASS_LIGHT_THEME;
  }

  ngOnInit(): void {
    this.useDarkTheme = this.GLOBALS!.WORKSPACE.darkTheme;
    this.doSwitchTheme();
  }

  handleSwitchTheme(useDarkTheme: boolean) {
    this.useDarkTheme = useDarkTheme;
    this.GLOBALS!.WORKSPACE.darkTheme = useDarkTheme;
    this.doSwitchTheme();
  }

  private doSwitchTheme() {
    const newTheme = this.useDarkTheme ? SwitchThemeComponent.CLASS_DARK_THEME : SwitchThemeComponent.CLASS_LIGHT_THEME;
    document.body.classList.remove(this.currentTheme);
    document.body.classList.add(newTheme);
    this.currentTheme = newTheme;
  }
}
