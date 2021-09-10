import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {GlobalService} from "../../global.service";
import * as Cesium from "cesium";
import {Subscription, timer} from "rxjs";
import {map, share} from "rxjs/operators";
import {ClockRange} from "cesium";

export enum SpeedMultipliers {
  NORMAL,
  FAST,
  FASTER,
  FASTERER,
  FASTEST
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit, OnDestroy {
  timeActivated: boolean;
  buttonPlay: ButtonPlay;
  static readonly DEFAULT_BUTTON_PLAY_CONFIGS: ButtonPlayConfigs = {
    PLAY: {
      icon: 'play_arrow',
      tooltip: 'Simulate time',
      color: 'accent'
    },
    PAUSE: {
      icon: 'pause',
      tooltip: 'Pause time',
      color: 'warn'
    }
  }

  speedMultiplier: SpeedMultiplier;
  static readonly DEFAULT_SPEED_MULTIPLIERS: Array<SpeedMultiplier> = [
    {
      multiplier: SpeedMultipliers.NORMAL,
      value: 1,
      tooltip: 'Speed multiplier',
      display: '',
      hidden: true
    },
    {
      multiplier: SpeedMultipliers.FAST,
      value: 5,
      tooltip: '5 seconds per second',
      display: 's',
      hidden: false
    },
    {
      multiplier: SpeedMultipliers.FASTER,
      value: 60,
      tooltip: '1 minute per second',
      display: 'm',
      hidden: false
    },
    {
      multiplier: SpeedMultipliers.FASTERER,
      value: 3600,
      tooltip: '1 hour per second',
      display: 'h',
      hidden: false
    },
    {
      multiplier: SpeedMultipliers.FASTEST,
      value: 86400,
      tooltip: '1 day per second',
      display: 'd',
      hidden: false
    },
  ];

  timeRangeControl: FormGroup;
  currentTimeString: string;
  timeSubscription: Subscription;

  constructor(private GLOBALS?: GlobalService, private changeDetectorRef?: ChangeDetectorRef) {
    this.timeActivated = false;
    this.buttonPlay = Object.assign({}, TimelineComponent.DEFAULT_BUTTON_PLAY_CONFIGS.PLAY);
    this.speedMultiplier = Object.assign({}, TimelineComponent.DEFAULT_SPEED_MULTIPLIERS[SpeedMultipliers.NORMAL]);
    const {DateTime} = require('luxon');
    this.timeRangeControl = new FormGroup({
      start: new FormControl(DateTime.now().minus({days: 3})),
      end: new FormControl(DateTime.now().plus({days: 3}))
    });
    this.currentTimeString = this.displayDate(new Date());
    this.timeSubscription = new Subscription();
  }

  ngOnInit() {
    // Set loop between time range
    this.GLOBALS!.CESIUM_VIEWER.clock.clockRange = ClockRange.LOOP_STOP;

    // Load from previous workspace
    const savedTimeline = this.GLOBALS!.WORKSPACE.timeline;

    if (savedTimeline != null) {
      // Set current time from previous workspace
      if (savedTimeline.current != null) {
        const savedCurrentDate = new Date(savedTimeline.current);
        this.currentTimeString = this.displayDate(savedCurrentDate);
        this.GLOBALS!.CESIUM_VIEWER.clock.currentTime = Cesium.JulianDate.fromDate(savedCurrentDate);
      }
      // Set speed multiplier from previous workspace
      if (savedTimeline.multiplier != null) {
        this.handleSpeed(savedTimeline.multiplier);
      }
      // Set play behaviours from previous workspace
      if (savedTimeline.autoplay != null && savedTimeline.autoplay) {
        this.handlePlay();
      }
      // Set time range from previous workspace
      if (savedTimeline.range != null
        && savedTimeline.range.start != null
        && savedTimeline.range.end != null) {
        this.timeRangeControl.setValue({
          start: new Date(savedTimeline.range.start),
          end: new Date(savedTimeline.range.end)
        });
        this.handleTimeRange(true);
      }
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
          this.currentTimeString = this.displayDate(time);
          // Save current time to workspace
          this.GLOBALS!.WORKSPACE.timeline.current = new Date(time.valueOf());
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

  handleReset() {
    const timelineComponent = new TimelineComponent();
    this.timeActivated = timelineComponent.timeActivated;
    this.buttonPlay = Object.assign({}, timelineComponent.buttonPlay);
    this.speedMultiplier = Object.assign({}, timelineComponent.speedMultiplier);
    this.timeRangeControl.setValue({
      start: new Date(timelineComponent.timeRangeControl.value.start),
      end: new Date(timelineComponent.timeRangeControl.value.end)
    });
    this.currentTimeString = timelineComponent.currentTimeString;

    this.handleToPresent();
    this.handleSpeed(this.speedMultiplier.multiplier);
    this.handlePlay(false);
    this.handleTimeRange();
  }

  handlePlay(update?: boolean) {
    // Get clock in Cesium
    let clock = this.GLOBALS!.CESIUM_VIEWER.clock;

    if (update == null || update) {
      this.timeActivated = !this.timeActivated;
    }

    if (this.timeActivated) {
      clock.shouldAnimate = true;
      this.buttonPlay.icon = TimelineComponent.DEFAULT_BUTTON_PLAY_CONFIGS.PAUSE.icon;
      this.buttonPlay.tooltip = TimelineComponent.DEFAULT_BUTTON_PLAY_CONFIGS.PAUSE.tooltip;
      this.buttonPlay.color = TimelineComponent.DEFAULT_BUTTON_PLAY_CONFIGS.PAUSE.color;
    } else {
      clock.shouldAnimate = false;
      this.buttonPlay.icon = TimelineComponent.DEFAULT_BUTTON_PLAY_CONFIGS.PLAY.icon;
      this.buttonPlay.tooltip = TimelineComponent.DEFAULT_BUTTON_PLAY_CONFIGS.PLAY.tooltip;
      this.buttonPlay.color = TimelineComponent.DEFAULT_BUTTON_PLAY_CONFIGS.PLAY.color;
    }

    // Save to workspace
    this.GLOBALS!.WORKSPACE.timeline.autoplay = this.timeActivated;
    this.GLOBALS!.WORKSPACE.timeline.current = new Date(Cesium.JulianDate.toDate(clock.currentTime).valueOf());

    // TODO Also save time range (when set) to workspace

    // TODO Make use of timeRange.start and timeRange.end
  }

  handleToPresent() {
    const currentDate = new Date();
    this.GLOBALS!.CESIUM_VIEWER.clock.currentTime = Cesium.JulianDate.fromDate(currentDate);
    this.GLOBALS!.WORKSPACE.timeline.current = new Date(currentDate.valueOf()); // Save to workspace
    this.currentTimeString = this.displayDate(currentDate);

    // TODO If timeRange exists, then jump to the start of this range instead
  }

  handleSpeed(target?: SpeedMultipliers) {
    let multiplierEnum, multiplierValue, tooltip, display, hidden;
    if (target != null) {
      multiplierEnum = target;
    } else {
      const enumLength = Object.keys(SpeedMultipliers).length / 2; // not applicable for enums with strings
      multiplierEnum = (this.speedMultiplier.multiplier + 1) % enumLength;
    }
    multiplierValue = TimelineComponent.DEFAULT_SPEED_MULTIPLIERS[multiplierEnum].value;
    tooltip = TimelineComponent.DEFAULT_SPEED_MULTIPLIERS[multiplierEnum].tooltip;
    display = TimelineComponent.DEFAULT_SPEED_MULTIPLIERS[multiplierEnum].display;
    hidden = TimelineComponent.DEFAULT_SPEED_MULTIPLIERS[multiplierEnum].hidden;

    // Set multiplier in Cesium
    this.GLOBALS!.CESIUM_VIEWER.clock.multiplier = multiplierValue;

    // Save to workspace
    this.GLOBALS!.WORKSPACE.timeline.multiplier = multiplierEnum;

    this.speedMultiplier.multiplier = multiplierEnum;
    this.speedMultiplier.value = multiplierValue;
    this.speedMultiplier.tooltip = tooltip;
    this.speedMultiplier.display = display;
    this.speedMultiplier.hidden = hidden;

    // TODO Make use of timeRange.start and timeRange.end
  }

  handleTimeRange(fromInit?: boolean) {
    if (this.timeRangeControl.value == null
      || this.timeRangeControl.value.start == null
      || this.timeRangeControl.value.end == null) {
      return;
    }

    if (fromInit == null || !fromInit) {
      this.GLOBALS!.WORKSPACE.timeline.range = {
        start: new Date(this.timeRangeControl.value.start.valueOf()),
        end: new Date(this.timeRangeControl.value.end.valueOf())
      };
    }

    this.GLOBALS!.CESIUM_VIEWER.clock.startTime =
      Cesium.JulianDate.fromDate(new Date(this.timeRangeControl.value.start.valueOf()));
    this.GLOBALS!.CESIUM_VIEWER.clock.stopTime =
      Cesium.JulianDate.fromDate(new Date(this.timeRangeControl.value.end.valueOf()));

    // Save to workspace
    if (fromInit != null && fromInit) {
      this.GLOBALS!.WORKSPACE.timeline.range = {
        start: new Date(this.timeRangeControl.value.start.valueOf()),
        end: new Date(this.timeRangeControl.value.end.valueOf())
      };
    }

    // TODO Effects to other elements?
  }
}

export interface DatePickerTimeRange {
  start: Date,
  end: Date
}

export interface ButtonPlay {
  icon: string,
  tooltip: string,
  color: string
}

export interface ButtonPlayConfigs {
  PLAY: ButtonPlay,
  PAUSE: ButtonPlay
}

export interface SpeedMultiplier {
  multiplier: SpeedMultipliers,
  value: number, // in seconds, such as 1 minute (60s) per second
  tooltip: string,
  display: string,
  hidden: boolean
}
