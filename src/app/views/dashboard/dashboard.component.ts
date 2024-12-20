import { Action } from './../../_Model/Action';
import { ProjectPercentage } from './../../_Model/ProjectPercentage';
import { ActionNumber } from './../../_Model/ActionNumber';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ProjectService } from 'src/app/_Services/project.service';
import { ProjectNumber } from 'src/app/_Model/ProjectNumber';
import { ActionsService } from 'src/app/_Services/actions.service';

export interface IChartProps {
  data?: any;
  labels?: any;
  options?: any;
  colors?: any;
  type?: any;
  legend?: any;

  [propName: string]: any;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
  nombreProjectDraftData!: ProjectNumber;
  nombreProjectInProgressData!: ProjectNumber;
  nombreProjectDoneData!: ProjectNumber;
  projectPourcentage!: ProjectPercentage;
  actionsByStatus!:Action;
  ngOnInit(): void {
    this.ChartProjectStatus();
    this.ChartProjectProgress();
    this.getActionByStatus();
    this.updateChartDataActionByActor();
  }

  constructor(private projectService:ProjectService,private actionsService:ActionsService) {}
  options = {
    maintainAspectRatio: false
  };

  Status = [
    { label: 'Label 1', color: '#b9f2a1' },
    { label: 'Label 2', color: '#6eba8c' },
    { label: 'Label 3', color: '#196671' }
  ];

  chartBarDataProjectByStatus: ChartData = {
    labels: [...this.Status.map(item => item.label),].slice(0, 3),
    datasets: [
      {
        label:'',
        backgroundColor: this.Status.map(item => item.color),
        data: [0, 0, 0] 
      }
    ],
  };
  options1: ChartOptions = {
    plugins: {
        legend: {
            display: false // Désactive l'affichage de la légende
        }
    }
};
  chartBarDataProjectProgress: ChartData = {
    labels: ['Label 1', 'Label 2', 'Label 3'],
    datasets: [
      {
        label: 'Data 1',
        data: [10, 20, 30],
      }
    ]
  };

  chartBarDataActionByActor: ChartData = {
    labels: ['Label 1', 'Label 2', 'Label 3'],
    datasets: [
      {
        label: 'Data 1',
        data: [10, 20, 30],
      }
    ]
  };

  chartBarDataForActionStatus: ChartData = {
    labels: ['Opened', 'In Progress', 'Waiting for validation', 'Closed', 'Canceled'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0],
        backgroundColor: ['#b9f2a1', '#6ec0b8', '#6eba8c', '#0e8174', '#005562'],
        hoverBackgroundColor:  ['#b9f2a1', '#0e8174', '#6eba8c', '#6ec0b8', '#005562']
      }
    ],
  };

  ChartProjectStatus() {
    this.projectService.getNombreProjectDraft().subscribe((data: ProjectNumber) => {
      this.chartBarDataProjectByStatus.datasets[0].data[0] = data.nombre;
      this.updateChart();
    });

    this.projectService.getNombreProjectInProgress().subscribe((data: ProjectNumber) => {
      this.chartBarDataProjectByStatus.datasets[0].data[1] = data.nombre;
      this.updateChart();
    });

    this.projectService.getNombreProjectDone().subscribe((data: ProjectNumber) => {
      this.chartBarDataProjectByStatus.datasets[0].data[2] = data.nombre;
      this.updateChart();
    });
  }

  updateChart() {
    // Trigger a change detection to refresh the chart
    this.chartBarDataProjectByStatus = { ...this.chartBarDataProjectByStatus };
  }

  getProjectByPourcentage() {
    this.projectService.getProjectByPourcentage().subscribe((data: ProjectPercentage) =>{
        this.projectPourcentage = data;
        console.log(this.projectPourcentage)

    })
  }

  ChartProjectProgress(): void {
    this.projectService.getProjectByPourcentage().subscribe((data: ProjectPercentage[]) => {
      const chartBarData2: ChartData = {
        labels: data.map((project: ProjectPercentage) => project.projectName),
        datasets: [
          {
            label: ' Projects by progress (%)',
            data: data.map((project: ProjectPercentage) => project.percentage),
            backgroundColor: ['#b9f2a1'],
          }
        ]
      };
      this.chartBarDataProjectProgress = chartBarData2;
    });
  }

  updateChartDataActionByActor(): void {
    this.actionsService.getActionsByActor().subscribe((data: ActionNumber[]) => {
      const chartBarDataActionByActor: ChartData = {
        labels: data.map((project: ActionNumber) => project.actorName),
        datasets: [
          {
            label: 'Action by Actor',
            data: data.map((project: ActionNumber) => project.nombre),
            backgroundColor: ['#6ec0b8'],
          }
        ]
      };
      this.chartBarDataActionByActor = chartBarDataActionByActor;
    });
  }

  getActionByStatus() {
    this.actionsService.getActionsByStatus().subscribe(
      (counts: { [status: string]: number }) => {
        const labels = ['Opened', 'In progress', 'Waiting for validation', 'Closed', 'Canceled'];
        this.chartBarDataForActionStatus.datasets[0].data = labels.map((label) => counts[label] || 0);
        this.chartBarDataForActionStatus = { ...this.chartBarDataForActionStatus };
      },
      (error) => {
        console.error('Erreur lors de la récupération des actions par statut :', error);
       }
      );
  }

}

  
 

