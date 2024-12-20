import { Component } from '@angular/core';
import { Data } from '@syncfusion/ej2-angular-grids';
import { Workshop } from 'src/app/_Model/Workshop';
import { WorkshopsService } from 'src/app/_Services/workshops.service';

@Component({
  selector: 'app-view-workshop',
  templateUrl: './view-workshop.component.html',
  styleUrls: ['./view-workshop.component.scss']
})
export class ViewWorkshopComponent {
workshop!:Workshop;
constructor(private workshopsService:WorkshopsService){}

ngOnInit(): void {
  this.workshopsService.getWorkshopById(localStorage.getItem("workshop_id")).subscribe(data => {
    this.workshop=data;
    console.log(data)
    console.log('Workshop',this.workshop)
  })
 
  console.log(localStorage.getItem("workshop_id"))
}

stripHtmlTags(str: string): string {
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.textContent || div.innerText || '';
}
}
