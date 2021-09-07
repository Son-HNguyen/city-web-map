import {Component} from '@angular/core';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.css'] // TODO Add banner / background images for each view
})
export class ViewListComponent {

  // TODO Add a button to take screenshot of the current camera
  // TODO Add a button to add the current camera view into the viewpoint list
  // TODO See class Viewpoint for the list of attributes contained in each viewpoint
  // TODO Display each viewpoint as a banner with title/description and buttons "Go", "Edit", "Delete" and "Move up/down"
  // TODO Enable moving viewpoints within the list
  // TODO Allow activating/deactivating 3D layers for each individual viewpoint
  // TODO Allow additionally a different list of 3D layers for each individual viewpoint -> store in a project?

  // TODO Structure/Model:
  /*
  Workspace: Settings, Layouts, etc. and Projects
  Project: A project contains a list of 3D, imagery and terrain layers, etc. and Viewpoints
  Viewpoint: A viewpoint contains a list of activated/deactivated layers given in the project and a camera location
  Each of these can have a description.

  Workspace
      |------- Project 1
                  |------- Viewpoint 1
                  |------- Viewpoint 2
      |------- Project 2
                  |------- Viewpoint 1
                  |------- Viewpoint 2
   */
  // TODO Display this tree structure in the GUI (like the project/file view in an IDE)
  // TODO Save/Load these into/from the workspace

  constructor() {
  }

}
