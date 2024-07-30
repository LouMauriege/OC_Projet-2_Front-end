import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Olympics } from 'src/app/core/models/Olympic';
import { Participations } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PageDetailComponent } from '../page-detail/page-detail.component';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, NgxChartsModule, PageDetailComponent],
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

  public observableDataReceived: boolean = false;

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

  constructor(private olympicService: OlympicService,
              private router: Router) {}

  getMedalsTotal(participations: Participations[]): number {
    let medalsTotals: number = 0;
    for(let i = 0; i < participations.length; i++) {
      medalsTotals += participations[i].medalsCount;
    }
    return medalsTotals;
  }

  onSelect(data: HTMLInputElement): void {
    this.router.navigateByUrl(`details/${data.name.replace(" ", "_")}`);
  }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.olympics$.subscribe(data => data?.forEach((item) => {
      this.single.push({
        name: (item.country),
        value: (this.getMedalsTotal(item.participations))
      });
      this.observableDataReceived = true;
    }));

  }
}