import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Olympics } from 'src/app/core/models/Olympic';
import { Participations } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';

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

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  @Input() view: any;

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  single: any[] = [];

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    // this.olympics$.subscribe(data => data?.forEach((item) => {
    //   this.single.push({
    //     name: (item.country), value: (item.participations.forEach((itemPraticipations) => itemPraticipations = itemPraticipations.medalsCount)
    //   })
    // }));
    // console.log(this.single);



    
    // this.single.map(data => console.log(data));
    // Object.assign(this, this.single);

    // this.olympics$.subscribe(olympic => {
    //   this.olympicsArray = olympic;
    //   if (this.olympicsArray) {
    //     this.countriesIds = this.olympicsArray?.map(({ id }) => id);
    //     this.countriesNames = this.olympicsArray?.map(({ country }) => country);
    //     this.participationsArray = this.olympicsArray?.map(({ participations }) => participations);
    //     for (let i = 0; i < this.participationsArray.length; i++) {
    //       this.countryMedalsCount[i] = 0;
    //       for (let j = 0; j < this.participationsArray[i].length; j++) {
    //         this.countryMedalsCount[i] += this.participationsArray[i][j].medalsCount;
    //       }
    //     }

    //     for(let i = 0; i < this.countriesNames.length; i++) {
    //       this.single[i] = {"name": this.countriesNames[i], "value": this.countryMedalsCount[i]};
    //     }
  
    //     console.log(this.countriesNames.length, this.single);

    //   }
    // });

    // onSelect(event) {
    //   console.log(event);
    // }
  }
}