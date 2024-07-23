import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Olympics } from 'src/app/core/models/Olympic';
import { Participations } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympics[] | null> = of(null);
  public olympicsArray: Olympics[] | null = [];
  public chart: any;
  public countriesIds: Array<number> = [];
  public countriesNames: Array<string> = [];
  public participationsArray: Array<Array<Participations>> = [];
  public countryMedalsCount: Array<number> = [];

  constructor(private olympicService: OlympicService) {}

    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    xAxisLabel = 'Country';
    showYAxisLabel = true;
    yAxisLabel = 'Medals';

    @Input() view: any;
  
    colorScheme: any = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    single: any[] = [];

    obj: any = {};

    onSelect(event: any) {
      console.log(event);
    }

  ngOnInit(): void {
    this.single = [
      {
        "name": "Germany",
        "value": 8940000
      },
      {
        "name": "USA",
        "value": 5000000
      },
      {
        "name": "France",
        "value": 7200000
      }
    ];

    this.olympics$ = this.olympicService.getOlympics();

    this.olympics$.subscribe(olympic => {
      this.olympicsArray = olympic;
      if (this.olympicsArray) {
        this.countriesIds = this.olympicsArray?.map(({ id }) => id);
        this.countriesNames = this.olympicsArray?.map(({ country }) => country);
        this.participationsArray = this.olympicsArray?.map(({ participations }) => participations);
        for (let i = 0; i < this.participationsArray.length; i++) {
          this.countryMedalsCount[i] = 0;
          for (let j = 0; j < this.participationsArray[i].length; j++) {
            this.countryMedalsCount[i] += this.participationsArray[i][j].medalsCount;
          }
        }

        console.log(this.countriesIds);
        console.log(this.countriesNames);
        console.log(this.countryMedalsCount);

        
        this.countriesNames.forEach(((i, j) => { this.obj[i] = this.countryMedalsCount[j] }));
        console.log(this.obj);

      }
    });
  }
}
