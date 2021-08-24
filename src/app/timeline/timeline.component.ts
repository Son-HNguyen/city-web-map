import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {GlobalService} from "../../global.service";
import * as Cesium from "cesium";
import {Subscription, timer} from "rxjs";
import {map, share} from "rxjs/operators";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit, OnDestroy {
  timeActivated: boolean;
  buttonPlayIcon: ButtonPlayIcons;
  buttonPlayTooltip: ButtonPlayTooltips;
  buttonPlayColor: ButtonPlayColors;
  speedMultiplierValue: SpeedMultiplierValues;
  speedMultiplierDisplay: SpeedMultiplierDisplays;
  speedMultiplierTooltip: SpeedMultiplierTooltips;
  speedMultiplierIndex: number;
  speedMultiplierHidden: boolean;
  readonly speedMultiplierDisplays: Array<SpeedMultiplierDisplays> = [
    SpeedMultiplierDisplays.NORMAL,
    SpeedMultiplierDisplays.FAST,
    SpeedMultiplierDisplays.FASTER,
    SpeedMultiplierDisplays.FASTERER,
    SpeedMultiplierDisplays.FASTEST
  ];
  readonly speedMultiplierValues: Array<SpeedMultiplierValues> = [
    SpeedMultiplierValues.NORMAL,
    SpeedMultiplierValues.FAST,
    SpeedMultiplierValues.FASTER,
    SpeedMultiplierValues.FASTERER,
    SpeedMultiplierValues.FASTEST
  ];
  readonly speedMultiplierTooltips: Array<SpeedMultiplierTooltips> = [
    SpeedMultiplierTooltips.NORMAL,
    SpeedMultiplierTooltips.FAST,
    SpeedMultiplierTooltips.FASTER,
    SpeedMultiplierTooltips.FASTERER,
    SpeedMultiplierTooltips.FASTEST
  ];
  timeRange: FormGroup;
  currentTime: string;
  timeSubscription: Subscription;

  constructor(private GLOBALS?: GlobalService, private changeDetectorRef?: ChangeDetectorRef) {
    this.timeActivated = false;
    this.buttonPlayIcon = ButtonPlayIcons.PLAY;
    this.buttonPlayTooltip = ButtonPlayTooltips.PLAY;
    this.buttonPlayColor = ButtonPlayColors.PLAY;
    this.speedMultiplierValue = SpeedMultiplierValues.NORMAL;
    this.speedMultiplierDisplay = SpeedMultiplierDisplays.NORMAL;
    this.speedMultiplierTooltip = SpeedMultiplierTooltips.NORMAL;
    this.speedMultiplierHidden = true;
    this.speedMultiplierIndex = 0;
    this.timeRange = new FormGroup({
      start: new FormControl(),
      end: new FormControl()
    });
    this.currentTime = this.displayDate(new Date());
    this.timeSubscription = new Subscription();
  }

  ngOnInit() {
    // Load from previous workspace
    const savedTimeline = this.GLOBALS!.WORKSPACE.timeline;

    if (savedTimeline != null && savedTimeline.multiplier != null) {
      this.handleSpeed(savedTimeline.multiplier);
    }

    if (savedTimeline != null && savedTimeline.autoplay != null && savedTimeline.autoplay) {
      this.handlePlay();
    }

    // TODO Also load time range from previous workspace

    // Use RxJS timer
    this.timeSubscription = timer(0, 1000)
      .pipe(
        map(() => {
          if (this.timeActivated) {
            return Cesium.JulianDate.toDate(this.GLOBALS!.CESIUM_VIEWER.clock.currentTime);
          }
          return undefined;
        }),
        share()
      )
      .subscribe(time => {
        if (time != null) {
          this.currentTime = this.displayDate(time);
          this.changeDetectorRef?.markForCheck(); // change detection for this component to update time every second
        }
      });
  }

  displayDate(time: Date): string {
    const {DateTime} = require("luxon");
    return DateTime.fromISO(time.toISOString()).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS);
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  handlePlay() {
    // Get clock in Cesium
    let clock = this.GLOBALS!.CESIUM_VIEWER.clock;

    this.timeActivated = !this.timeActivated;
    if (this.timeActivated) {
      clock.shouldAnimate = true;
      this.buttonPlayIcon = ButtonPlayIcons.PAUSE;
      this.buttonPlayTooltip = ButtonPlayTooltips.PAUSE;
      this.buttonPlayColor = ButtonPlayColors.PAUSE;
    } else {
      clock.shouldAnimate = false;
      this.buttonPlayIcon = ButtonPlayIcons.PLAY;
      this.buttonPlayTooltip = ButtonPlayTooltips.PLAY;
      this.buttonPlayColor = ButtonPlayColors.PLAY;
    }

    // Save to workspace
    this.GLOBALS!.WORKSPACE.timeline.autoplay = this.timeActivated;

    // TODO Also save time range (when set) to workspace

    // TODO Make use of timeRange.start and timeRange.end
  }

  handleToPresent() {
    this.GLOBALS!.CESIUM_VIEWER.clock.currentTime = Cesium.JulianDate.now();

    // TODO If timeRange exists, then jump to the start of this range instead
  }

  handleSpeed(target?: SpeedMultiplierValues) {
    let currentIndex = 0;
    if (target != null) {
      this.speedMultiplierValue = target;
      switch (this.speedMultiplierValue) {
        case SpeedMultiplierValues.NORMAL:
          currentIndex = 0;
          break;
        case SpeedMultiplierValues.FAST:
          currentIndex = 1;
          break;
        case SpeedMultiplierValues.FASTER:
          currentIndex = 2;
          break;
        case SpeedMultiplierValues.FASTERER:
          currentIndex = 3;
          break;
        case SpeedMultiplierValues.FASTEST:
          currentIndex = 4;
          break;
      }
      this.speedMultiplierIndex = currentIndex;
    } else {
      currentIndex = (++this.speedMultiplierIndex) % this.speedMultiplierValues.length;
      this.speedMultiplierValue = this.speedMultiplierValues[currentIndex];
    }

    this.speedMultiplierDisplay = this.speedMultiplierDisplays[currentIndex];
    this.speedMultiplierTooltip = this.speedMultiplierTooltips[currentIndex];
    this.speedMultiplierHidden = this.speedMultiplierDisplay === SpeedMultiplierDisplays.NORMAL;

    // Set multiplier in Cesium
    this.GLOBALS!.CESIUM_VIEWER.clock.multiplier = this.speedMultiplierValue;

    // Save to workspace
    this.GLOBALS!.WORKSPACE.timeline.multiplier = this.speedMultiplierValue;

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

// Speed multiplier in seconds
export enum SpeedMultiplierValues {
  NORMAL = 1,
  FAST = 5,
  FASTER = 60,
  FASTERER = 3600,
  FASTEST = 86400
}

enum SpeedMultiplierDisplays {
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
