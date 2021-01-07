/*
 *
 *  * City Web Map
 *  * http://www.3dcitydb.org/
 *  *
 *  * Copyright 2015 - 2021
 *  * Chair of Geoinformatics
 *  * Department of Aerospace and Geodesy
 *  * Technical University of Munich, Germany
 *  * https://www.gis.lrg.tum.de/
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

import {Modal} from "bootstrap";
import {UtilityDialogOption} from "./utility.dialog.option";

export class UtilityDialog {

  /**
   * Open a dialog pop-up (which is Bootstrap Modal).
   * Title, content and the button name(s) are required.
   */
  public static open(option: UtilityDialogOption): void {
    if (option.title != null && option.content != null && option.buttons != null) {
      let modal: any = document.getElementById("modalTemplate");
      if (modal == null) return;
      let modalBootstrap = new Modal(modal);
      modalBootstrap.show();

      let title = document.getElementById("modalTemplateTitle");
      if (title == null) return;
      title.textContent = option.title;

      let content = document.getElementById("modalTemplateContent");
      if (content == null) return;
      content.innerHTML = option.content;

      if (option.buttons === 1 || ((<any>option.buttons).primary != null) && ((<any>option.buttons).secondary == null) || (<any>option.buttons).secondary === "") {
        // Only one button
        let primaryButton = document.getElementById("modalTemplatePrimaryButton");
        if (primaryButton == null) return;
        if (option.buttons === 1) {
          primaryButton.textContent = "OK";
        } else {
          primaryButton.textContent = (<any>option.buttons).primary;
        }

        primaryButton.setAttribute("data-bs-dismiss", "modal");

        // Hide secondary button
        let secondaryButton = document.getElementById("modalTemplateSecondaryButton");
        if (secondaryButton == null) return;
        secondaryButton.classList.add("d-none");
      } else if (option.buttons === 2 || ((<any>option.buttons).primary != null) && (<any>option.buttons).secondary != null) {
        // Two buttons
        let primaryButton = document.getElementById("modalTemplatePrimaryButton");
        if (primaryButton == null) return;
        if (option.buttons === 2) {
          primaryButton.textContent = "Yes";
        } else {
          primaryButton.textContent = (<any>option.buttons).primary;
        }
        primaryButton.setAttribute("data-bs-dismiss", "modal");

        let secondaryButton = document.getElementById("modalTemplateSecondaryButton");
        if (secondaryButton == null) return;
        if (option.buttons === 2) {
          secondaryButton.textContent = "No";
        } else {
          secondaryButton.textContent = (<any>option.buttons).secondary;
        }

        secondaryButton.setAttribute("data-bs-dismiss", "modal");

        // Show secondary button
        secondaryButton.classList.remove("d-none");
      }
    }
  }

  /**
   * Open an info pop-up with given content.
   */
  public static info(content: string): void {
    let option: UtilityDialogOption = {
      title: "Information",
      content: content,
      buttons: {
        primary: "OK",
        secondary: ""
      }
    };
    UtilityDialog.open(option);
  }

  /**
   * Open an error pop-up with given content.
   */
  public static error(content: string): void {
    let option: UtilityDialogOption = {
      title: "Error",
      content: content,
      buttons: {
        primary: "OK",
        secondary: ""
      }
    };
    UtilityDialog.open(option);
  }

  /**
   * Open an warning pop-up with given content.
   */
  public static warn(content: string): void {
    let option: UtilityDialogOption = {
      title: "Warning",
      content: content,
      buttons: {
        primary: "OK",
        secondary: ""
      }
    };
    UtilityDialog.open(option);
  }

  /**
   * Open an dialog pop-up and ask for confirmation.
   */
  public static confirm(content: string): void {
    let option: UtilityDialogOption = {
      title: "Confirm",
      content: content,
      buttons: {
        primary: "Yes",
        secondary: "No"
      }
    };
    UtilityDialog.open(option);
  }
}
