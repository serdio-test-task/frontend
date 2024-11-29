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
  gridOptions: any;

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
    // {
    //   field: 'included',
    //   headerName: 'Included',
    //   cellRenderer:  (params: any) => {
    //     const input = document.createElement('input');
    //     input.type = 'checkbox';
    //     input.checked = params.value;
    //     input.addEventListener('change', () => {
    //       params.data.included = input.checked;
    //     });
    //     return input;
    //   }
    // },
    { headerName: 'Include', field: 'included', checkboxSelection: true }

  ];

  rowData = [
  ];

  constructor(private orgService: OrganizationService) {
    this.gridOptions = {
      paginationPageSize: 10,
      domLayout: 'autoHeight',
    };
  }

  ngOnInit(): void {
    console.log('here')
    this.fetchOrganizations();
  }
  onRepoSelectionChange(event: any) {
    const selectedNodes = event.api.getSelectedNodes(); // Get selected nodes from the grid API
    const selectedRows = selectedNodes.map((node: any) => node.data); // Map to row data

    if (selectedRows.length) {
      // Handle the first selected row (or iterate through all if needed)
      const repo = selectedRows[0]; // Example: Access the first selected repo
      this.orgService.getRepoDetails(repo.login, repo.name).subscribe(details => {
        repo.commits = details.commits.length;
        repo.pullRequests = details.pullRequests.length;
        repo.issues = details.issues.length;
      });
    }
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
                "git_url": org.clone_url
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
