import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Olympics } from 'src/app/core/models/Olympic';
import { Participations } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

import { BaseChartDirective } from 'ng2-charts';
import { Chart } from 'chart.js/auto';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [BaseChartDirective, CommonModule],
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

  createChart(countriesNames: Array<String>, countriesMedalsCount: Array<Number>){
  
    this.chart = new Chart("MyChart", {
      type: 'pie',
      data: {
        labels: countriesNames,
        datasets: [{
          label: '# of Votes',
          data: countriesMedalsCount,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  ngOnInit(): void {
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

        this.createChart(this.countriesNames, this.countryMedalsCount);
      }
    });
  }
}
