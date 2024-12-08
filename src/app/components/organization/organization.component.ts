import { Component, OnInit } from '@angular/core';
import { OrganizationService } from 'src/app/services/organization.service';
import {
  GridOptions
} from "ag-grid-community";
@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
})
export class OrganizationComponent implements OnInit {
  stategridOptions: GridOptions;
  gridOptions: any;
  columnDefs = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, width: 150 },
    { headerName: 'Name', field: 'name', sortable: true, filter: true, width: 150 },
    { headerName: 'Organization', field: 'login', sortable: true, filter: true, width: 150 },
    {
      headerName: 'URL',
      field: 'git_url',
      width: 300,
      cellRenderer: (params: any) =>
          `<a href="${params.value}" target="_blank">${params.value}</a>`,
    },
    {
      headerName: 'Include',
      field: 'included',
      checkboxSelection: true, // Checkbox for each row
      width: 150
    },
    { headerName: 'Commits', field: 'commits', sortable: true, filter: true, width: 100 },
    { headerName: 'PRs', field: 'pullRequests', sortable: true, filter: true, width: 100 },
    { headerName: 'Issues', field: 'issues', sortable: true, filter: true, width: 100 },
  ];
  rowData: any[] = [];
  userStats: any[] = [];
  statsColumnDefs = [
    { headerName: 'User', field: 'user', sortable: true, filter: true, width: 300 },
    { headerName: 'Total Commits', field: 'totalCommits', sortable: true, filter: true, width: 300 },
    { headerName: 'Total Pull Requests', field: 'totalPullRequests', sortable: true, filter: true, width: 300 },
    { headerName: 'Total Issues', field: 'totalIssues', sortable: true, filter: true, width: 300 },
  ];
  constructor(private orgService: OrganizationService) {
    this.gridOptions = {
      paginationPageSize: 10,
      rowSelection: 'multiple',
      overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Loading...</span>',

      domLayout: 'autoHeight',
      getRowId: ({ data }: any) => {
        console.log('Row data:', data); // Log the row data to check its structure
        const id = data.id || data.node_id || data.login; // Ensure a unique ID
        if (!id) {
          console.error('Missing unique identifier for row', data); // Log an error if no ID is found
        }
        return id;
      },
    };

    this.stategridOptions = {
      paginationPageSize: 10,
      domLayout: 'autoHeight',
      overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Loading...</span>',

    };
  }

  ngOnInit(): void {
    console.log('Fetching organizations...');
    this.fetchOrganizations();
  }

  /**
   * Fetch organizations and populate the row data
   */
  fetchOrganizations(): void {
    this.orgService.getOrganizations().subscribe(
        (response) => {
          this.rowData = response.map((org: any) => ({
            id: org.id,
            name: org.name,
            full_name: org.full_name,
            login: org.owner.login,
            node_id: org.owner.node_id,
            avatar_url: org.owner.avatar_url,
            git_url: org.clone_url,
            included: false,
            commits: 0,
            pullRequests: 0,
            issues: 0
          }));
        },
        (error: any) => {
          console.error('Error fetching organizations:', error);
        }
    );
  }

  /**
   * Handle checkbox selection for repositories
   * @param event AG Grid selection event
   */
  onRepoSelectionChange(event: any): void {
    const selectedNodes = event.api.getSelectedNodes();
    this.userStats = []
    if (this.stategridOptions.api) {
      this.stategridOptions.api.showLoadingOverlay();
    }

    this.rowData.forEach((repo: any) => {
      const isChecked = event.api.getSelectedNodes().some((node: any) => node.data.id === repo.id);
      if (isChecked) {
        this.orgService.getRepoDetails(repo.login, repo.name).subscribe(
            (details: any) => {
              repo.commits = details?.counts?.commitsCount || 0;
              repo.pullRequests = details?.counts?.pullRequestsCount || 0;
              repo.issues = details?.counts?.issuesCount || 0;

              let users =  Object.keys(details.userStats);
              this.userStats = this.userStats.filter(stat => users.includes(stat.user))
              for (const key in details.userStats) {
                const selectedObject = details.userStats[key];
                this.updateUserStats({...selectedObject, user: key});
              }
              this.rowData = this.rowData.map((r) => {
                if (r.id === repo.id) {
                  return repo;  // Update the row with new counts
                }
                return r;
              });

              event.api.refreshCells({ rowNodes: [repo] });
            },
            (error) =>
                console.error(`Error fetching details for repo ${repo.name}:`, error)
        );
      } else {
        repo.commits = 0;
        repo.pullRequests = 0;
        repo.issues = 0;

        this.rowData = this.rowData.map((r) => {
          if (r.id === repo.id) {
            return repo;
          }
          return r;
        });

        event.api.refreshCells({ rowNodes: [repo] });
      }
    });
    if (this.stategridOptions.api) {
      this.stategridOptions.api.hideOverlay();
    }
  }

  /**
   * Update user-level aggregated stats
   * @param details Repository details containing user stats
   */
  updateUserStats(details: any): void {
    const { commits, pullRequests, issues, user } = details;
    const existingUserStat = this.userStats.find((stat) => stat.user === user);

    if (existingUserStat) {
      existingUserStat.totalCommits += commits;
      existingUserStat.totalPullRequests += pullRequests;
      existingUserStat.totalIssues += issues;
    } else {
      this.userStats.push({
        user,
        totalCommits: commits,
        totalPullRequests: pullRequests,
        totalIssues: issues,
      });
    }
    if (this.stategridOptions.api) {
      this.stategridOptions.api.setRowData(this.userStats);
    }
  }
}
