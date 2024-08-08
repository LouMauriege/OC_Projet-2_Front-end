import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympics } from 'src/app/core/models/Olympic';

import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-page-detail',
  standalone: true,
  imports: [NgxChartsModule, RouterLink],
  templateUrl: './page-detail.component.html',
  styleUrl: './page-detail.component.scss'
})
export class PageDetailComponent implements OnInit, OnDestroy {
  // Observable to get data from database
  public olympics$!: Observable<Olympics[]>;

  // Subject to destroy the olympics$ observable
  private destroy$!: Subject<boolean>;

  // Boolean to know when the data arrives from the observable
  public observableDataReceived: boolean = false;

  // Get and format data for Ngx-Charts
  public dataObjectForChart: Object[] = [];

  // Get data for details elements
  public countryName: string = "";
  public medalsPerYear: any[] = [];
  public numberOfEntries: number = 0;
  public totalNumberOfMedals: number = 0;
  public totalNumberOfAthletes: number = 0;

  // Options to setup the chart (Ngx-Charts Library)
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Years';
  yAxisLabel: string = 'Number of medals';
  timeline: boolean = true;
  colorScheme: any = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(private olympicService: OlympicService,
              private route: ActivatedRoute) {}

  /**
  * Returns total of medals per years.
  *
  * @param {Olympics} olympicsData olympics data.
  * @return {number} medalsPerYear the total of medals from one participation.
  */
  getMedalsDetail(olympicsData: Olympics): Object {
    if(olympicsData.country === this.countryName) {
      olympicsData.participations.forEach((item) => {
        this.medalsPerYear.push({
          name: String(item.year),
          value: item.medalsCount,
        });
        this.totalNumberOfMedals += item.medalsCount;
        this.totalNumberOfAthletes += item.athleteCount;
        this.numberOfEntries++;
      });
    }
    return this.medalsPerYear;
  }

  ngOnInit(): void {
    // Create instance of detroy$ as Subject
    this.destroy$ = new Subject<boolean>();

    // Get the name of the country selected via the URL
    this.countryName = this.route.snapshot.params['country'].replace("_", " ");

    this.olympics$ = this.olympicService.getOlympics();

    // Subscribe to olympics$ observable
    this.olympics$.pipe(
      // Listen observable until destroy$ is fired
      takeUntil(this.destroy$)
      // Map data to build the chart
    ).subscribe(data => data?.forEach((item) => {
      console.log(item.country);
      console.log(item.participations);
      console.log(this.countryName);
      if (item.country === this.countryName) {
        this.dataObjectForChart.push({
          name: (item.country),
          series: (this.getMedalsDetail(item))
        });
      }
      this.observableDataReceived = true;
      console.log(this.dataObjectForChart);
      error: (error: Error) => console.log(error); 
    }));
  }

  ngOnDestroy(): void {
    // Fire destroy$ when component destroy 
      this.destroy$.next(true);
  }
}
