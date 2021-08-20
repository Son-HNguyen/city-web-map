import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent {
  timeActivated: boolean;
  buttonPlayIcon: ButtonPlayIcons;
  buttonPlayTooltip: ButtonPlayTooltips;
  buttonPlayColor: ButtonPlayColors;
  speedMultiplier: SpeedMultipliers;
  speedMultiplierTooltip: SpeedMultiplierTooltips;
  speedMultiplierIndex: number;
  speedMultiplierHidden: boolean;
  readonly speedMultipliers: Array<SpeedMultipliers> = [
    SpeedMultipliers.NORMAL,
    SpeedMultipliers.FAST,
    SpeedMultipliers.FASTER,
    SpeedMultipliers.FASTERER,
    SpeedMultipliers.FASTEST
  ];
  readonly speedMultiplierTooltips: Array<SpeedMultiplierTooltips> = [
    SpeedMultiplierTooltips.NORMAL,
    SpeedMultiplierTooltips.FAST,
    SpeedMultiplierTooltips.FASTER,
    SpeedMultiplierTooltips.FASTERER,
    SpeedMultiplierTooltips.FASTEST
  ];
  timeRange: FormGroup;

  constructor() {
    this.timeActivated = false;
    this.buttonPlayIcon = ButtonPlayIcons.PLAY;
    this.buttonPlayTooltip = ButtonPlayTooltips.PLAY;
    this.buttonPlayColor = ButtonPlayColors.PLAY;
    this.speedMultiplier = SpeedMultipliers.NORMAL;
    this.speedMultiplierTooltip = SpeedMultiplierTooltips.NORMAL;
    this.speedMultiplierHidden = true;
    this.speedMultiplierIndex = 0;
    this.timeRange = new FormGroup({
      start: new FormControl(),
      end: new FormControl()
    })
  }

  handlePlay() {
    this.timeActivated = !this.timeActivated;
    if (this.timeActivated) {
      this.buttonPlayIcon = ButtonPlayIcons.PAUSE;
      this.buttonPlayTooltip = ButtonPlayTooltips.PAUSE;
      this.buttonPlayColor = ButtonPlayColors.PAUSE;
    } else {
      this.buttonPlayIcon = ButtonPlayIcons.PLAY;
      this.buttonPlayTooltip = ButtonPlayTooltips.PLAY;
      this.buttonPlayColor = ButtonPlayColors.PLAY;
    }

    // TODO Call Cesium clock
    // TODO Make use of timeRange.start and timeRange.end
  }

  handleToPresent() {
    // TODO Call Cesium clock
    // TODO If timeRange exists, then jump to the start of this range instead
  }

  handleSpeed() {
    const currentIndex = (++this.speedMultiplierIndex) % this.speedMultipliers.length;
    this.speedMultiplier = this.speedMultipliers[currentIndex];
    this.speedMultiplierTooltip = this.speedMultiplierTooltips[currentIndex];
    if (this.speedMultiplier === SpeedMultipliers.NORMAL) {
      this.speedMultiplierHidden = true;
    } else {
      this.speedMultiplierHidden = false;
    }

    // TODO Call Cesium clock
    // TODO Make use of timeRange.start and timeRange.end
  }
}

enum ButtonPlayIcons {
  PLAY = 'play_arrow',
  PAUSE = 'pause'
}

enum ButtonPlayTooltips {
  PLAY = 'Simulate time',
  PAUSE = 'Pause time'
}

enum ButtonPlayColors {
  PLAY = 'accent',
  PAUSE = 'primary'
}

enum SpeedMultipliers {
  NORMAL = '',
  FAST = 's',
  FASTER = 'm',
  FASTERER = 'h',
  FASTEST = 'd'
}

enum SpeedMultiplierTooltips {
  NORMAL = 'Speed multiplier',
  FAST = '5 seconds per second',
  FASTER = '1 minute per second',
  FASTERER = '1 hour per second',
  FASTEST = '1 day per second'
}
