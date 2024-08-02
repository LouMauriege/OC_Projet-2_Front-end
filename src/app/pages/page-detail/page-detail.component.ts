import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RouterLink } from '@angular/router';
import { Olympics } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Observable, of } from 'rxjs';
import { Participations } from 'src/app/core/models/Participation';

@Component({
  selector: 'app-page-detail',
  standalone: true,
  imports: [NgxChartsModule, RouterLink],
  templateUrl: './page-detail.component.html',
  styleUrl: './page-detail.component.scss'
})
export class PageDetailComponent implements OnInit{
  public olympics$: Observable<Olympics[] | null> = of(null);
  public observableDataReceived: boolean = false;
  public countryName: string = "";
  public medalsPerYear: any[] = [];
  public numberOfEntries: number = 0;
  public totalNumberOfAthletes: number = 0;
  public totalNumberOfMedals: number = 0;

  multi: any[] = [];
  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
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

  getMedalsDetail(arg1: Olympics) {
    if(arg1.country === this.countryName) {
      arg1.participations.forEach((item) => {
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
    this.countryName = this.route.snapshot.params['country'].replace("_", " ");

    this.olympics$ = this.olympicService.getOlympics();

    this.olympics$.subscribe(data => data?.forEach((item) => {
      console.log(item.country);
      console.log(item.participations);
      console.log(this.countryName);
      if (item.country === this.countryName) {
        this.multi.push({
          name: (item.country),
          series: (this.getMedalsDetail(item))
        });
      }
      this.observableDataReceived = true;
      console.log(this.multi);
    }));
  }
}
