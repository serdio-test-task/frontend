import { Component, OnInit } from '@angular/core';
import { OrganizationService } from 'src/app/services/organization.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
})
export class OrganizationComponent implements OnInit {
  displayedColumns: string[] = ['avatar', 'login', 'id', 'description'];
  organizations: any[] = [];
  columnDefs = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true },
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Organization', field: 'login', sortable: true, filter: true },
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    {
      headerName: 'URL',
      field: 'git_url',
      cellRenderer: (params: any) =>{
        console.log(params)
        return `<a href="${params.value}" target="_blank">${params.value}</a>`
      }

    },
    {
      headerName: 'Include',
      field: 'include',
      cellRenderer: (params: any) => {
        const checked = params.value ? 'checked' : '';
        return `<input type="checkbox" ${checked} />`;
      },
    },
  ];

  rowData = [
  ];

  constructor(private orgService: OrganizationService) {}

  ngOnInit(): void {
    console.log('here')
    this.fetchOrganizations();
  }

  fetchOrganizations(): void {
    this.orgService.getOrganizations().subscribe(
      (response) => {
            this.rowData = response.map((org:any) => {
             return  {
                "id": org.id,
                "name": org.name,
                "full_name": org.full_name,
                "login": org.owner.login,
                "node_id": org.owner.node_id,
                "avatar_url": org.owner.avatar_url,
                "git_url": org.clone_url,

              }
              console.log(org)
            })
      },
      (error: any) => {
        console.error('Error checking connection', error);
      }
    );
  }
}
