import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympics } from 'src/app/core/models/Olympic';
import { Participations } from 'src/app/core/models/Participation';

import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [NgxChartsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit, OnDestroy {
  // Observable to get data from database
  public olympics$!: Observable<Olympics[]>;

  // Subject to destroy the olympics$ observable
  private destroy$!: Subject<boolean>;

  // Get and format data for Ngx-Charts
  public dataObjectForChart: Object[] = [];

  // Get data for details elements
  public numberOfJO: number = 0;

  // Boolean to know when the data arrives from the observable
  public observableDataReceived: boolean = false;

  public windowWidth!: number;

  // Options to setup the chart (Ngx-Charts Library)
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  colorScheme: any = {
    domain: ['#6e4152', '#90a2d6', '#92829f', '#c8e0ef', '#8a6266']
  };

  constructor(private olympicService: OlympicService,
              private router: Router) {
							}

  /**
  * Returns total of medals.
  *
  * @param {Participations[]} participations an array of all participations.
  * @return {number} medalsTotals the total of medals from all participations.
  */
  getMedalsTotal(participations: Participations[]): number {
    let medalsTotals: number = 0;
    for(let i = 0; i < participations.length; i++) {
      medalsTotals += participations[i].medalsCount;
    }
    return medalsTotals;
  }

  tooltipFormatter(tooltipValue: any): string {
    console.log(tooltipValue.data.name, tooltipValue.data.value);
    const returnToLine: string = "\n"
    return `
    <p>${tooltipValue.data.name}</p>
    <p>${tooltipValue.data.value}</p>
    `;
  }

  /**
  * Navigate to the details page.
  *
  * @param {HTMLInputElement} data the name of the country.
  */
  onSelect(data: HTMLInputElement): void {
    // Get the name of the country and replace all spaces with underscores
    this.router.navigateByUrl(`details/${data.name.replace(" ", "_")}`);
  }

  @HostListener('window:resize')
  onResize() {
    this.getWindowWidth();
  }

  getWindowWidth() {
    this.windowWidth = window.innerWidth - 20;
  }

  ngOnInit(): void {
    this.getWindowWidth();
    // Create instance of detroy$ as Subject
    this.destroy$ = new Subject<boolean>();

    this.olympics$ = this.olympicService.getOlympics();

    // Subscribe to olympics$ observable
    this.olympics$.pipe(
      // Listen observable until destroy$ is fired
      takeUntil(this.destroy$)
      // Map data to build the chart
    ).subscribe(data => data?.forEach((item) => {
      this.dataObjectForChart.push({
        name: (item.country),
        value: (this.getMedalsTotal(item.participations))
      });
      if (item.participations.length > this.numberOfJO) {
        this.numberOfJO = item.participations.length;
      }
      this.observableDataReceived = true;
      error: (error: Error) => console.log(error); 
    }));
  }

  ngOnDestroy(): void {
    // Fire destroy$ when component destroy 
    this.destroy$.next(true);
  }
}