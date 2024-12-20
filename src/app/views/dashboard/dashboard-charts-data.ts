import { Injectable, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/utils';
import { ProjectNumber } from 'src/app/_Model/ProjectNumber';
import { ProjectService } from 'src/app/_Services/project.service';

export interface IChartProps {
  data?: any;
  labels?: any;
  options?: any;
  colors?: any;
  type?: any;
  legend?: any;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData  implements OnInit{
  nombreProjectDraftData!: ProjectNumber;
  nombreProjectInProgressData!: ProjectNumber;
  nombreProjectDoneData!: ProjectNumber;
  constructor(private projectService:ProjectService) {
    this.initMainChart();
  }
  ngOnInit(): void {
    this.projectService.getNombreProjectDraft().subscribe(
      (data: ProjectNumber) => {
        this.nombreProjectDraftData = data;
        console.log(this.nombreProjectDraftData)
      },
      (error: any) => {
        console.error('Error fetching nombreProjectDraft:', error);
      }
    );
    this.geNombretProjectToDo();
    this.geNombretProjectDone();
    this.geNombretProjectDone();
  
  }

  public mainChart: IChartProps = {};

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  initMainChart(period: string = 'Month') {
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = hexToRgba(brandInfo, 10);
    const brandDanger = getStyle('--cui-danger') || '#f86c6b';

    // mainChart
    // mainChart
    this.mainChart['elements'] = period === 'Month' ? 12 : 27;
    this.mainChart['Data1'] = [];
    this.mainChart['Data2'] = [];
    this.mainChart['Data3'] = [];

    // generate random values for mainChart
    for (let i = 0; i <= this.mainChart['elements']; i++) {
      this.mainChart['Data1'].push(this.random(50, 240));
      this.mainChart['Data2'].push(this.random(20, 160));
      this.mainChart['Data3'].push(65);
    }

    let labels: string[] = [];
    if (period === 'Month') {
      labels = ['To Do', 'Ongoing', 'Done'];
    } 

    const colors = [
      {
        // brandInfo
        backgroundColor: brandInfoBg,
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        fill: true
      },
      {
        // brandSuccess
        backgroundColor: 'transparent',
        borderColor: brandSuccess || '#4dbd74',
        pointHoverBackgroundColor: '#fff'
      },
      {
        // brandDanger
        backgroundColor: 'transparent',
        borderColor: brandDanger || '#f86c6b',
        pointHoverBackgroundColor: brandDanger,
        borderWidth: 1,
        borderDash: [8, 5]
      }
    ];

    const datasets = [
      {
        data: [], 
        label: 'Current',
        ...colors[0]
      },
      {
        data: [],
        label: 'Previous',
        ...colors[1]
      },
      {
        data: [], 
        label: 'BEP',
        ...colors[2]
      }
    ];

    const plugins = {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          labelColor: function(context: any) {
            return {
              backgroundColor: context.dataset.borderColor
            };
          }
        }
      }
    };

    const options = {
      maintainAspectRatio: false,
      plugins,
      scales: {
        x: {
          grid: {
            drawOnChartArea: false
          }
        },
        y: {
          beginAtZero: true,
          max: 250,
          ticks: {
            maxTicksLimit: 5,
            stepSize: Math.ceil(250 / 5)
          }
        }
      },
      elements: {
        line: {
          tension: 0.4
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      }
    };

    this.mainChart.type = 'line';
    this.mainChart.options = options;
    this.mainChart.data = {
      datasets,
      labels
    };
  }
  geNombretProjectToDo(){
    this.projectService.getNombreProjectDraft().subscribe((data: ProjectNumber) =>{
      this.nombreProjectDraftData = data;
      console.log(this.nombreProjectDraftData)
    //  this.mainChart.data.datasets[0].data = [this.nombreProjectDraftData.nombre];
      // console.log(this.toDo);
      // this.doughnutChartData =  [
      //   [this.toDo.nombre, this.onGoing.nombre, this.done.nombre,0]
      // ];
    })
    
  }

  geNombretProjectOnGoing(){
    this.projectService.getNombreProjectInProgress().subscribe((data: ProjectNumber) =>{
      this.nombreProjectInProgressData = data;
      console.log(this.nombreProjectInProgressData)
      this.mainChart.data.datasets[1].data = [this.nombreProjectInProgressData.nombre];

      // console.log(this.onGoing)
      // this.doughnutChartData =  [
      //   [this.toDo.nombre, this.onGoing.nombre, this.done.nombre,0]
      // ];
    })
  }

  geNombretProjectDone(){
    this.projectService.getNombreProjectDone().subscribe((data: ProjectNumber) =>{
      this.nombreProjectDoneData = data;
      this.mainChart.data.datasets[2].data = [this.nombreProjectDoneData.nombre];
      // this.doughnutChartData =  [
      //   [this.toDo.nombre, this.onGoing.nombre, this.done.nombre,0]
      // ];
    })
  }

}