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
  speedMultiplierDisplay: SpeedMultiplierDisplays;
  speedMultiplierValue: SpeedMultiplierValues;
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
    this.speedMultiplierDisplay = SpeedMultiplierDisplays.NORMAL;
    this.speedMultiplierValue = SpeedMultiplierValues.NORMAL;
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

    // TODO Make use of timeRange.start and timeRange.end
  }

  handleToPresent() {
    this.GLOBALS!.CESIUM_VIEWER.clock.currentTime = Cesium.JulianDate.now();

    // TODO If timeRange exists, then jump to the start of this range instead
  }

  handleSpeed() {
    const currentIndex = (++this.speedMultiplierIndex) % this.speedMultiplierDisplays.length;
    this.speedMultiplierDisplay = this.speedMultiplierDisplays[currentIndex];
    this.speedMultiplierTooltip = this.speedMultiplierTooltips[currentIndex];
    this.GLOBALS!.CESIUM_VIEWER.clock.multiplier = this.speedMultiplierValues[currentIndex];
    this.speedMultiplierHidden = this.speedMultiplierDisplay === SpeedMultiplierDisplays.NORMAL;

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

enum SpeedMultiplierDisplays {
  NORMAL = '',
  FAST = 's',
  FASTER = 'm',
  FASTERER = 'h',
  FASTEST = 'd'
}

// Speed multiplier in seconds
enum SpeedMultiplierValues {
  NORMAL = 1,
  FAST = 5,
  FASTER = 60,
  FASTERER = 3600,
  FASTEST = 86400
}

enum SpeedMultiplierTooltips {
  NORMAL = 'Speed multiplier',
  FAST = '5 seconds per second',
  FASTER = '1 minute per second',
  FASTERER = '1 hour per second',
  FASTEST = '1 day per second'
}
