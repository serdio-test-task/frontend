import { Component, OnInit } from '@angular/core';
import { OrganizationService } from 'src/app/services/organization.service';
import {GridOptions} from "ag-grid-community";

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
})
export class OrganizationComponent implements OnInit {
  stategridOptions: GridOptions;

  gridOptions: any;

  // Column definitions for repositories
  columnDefs = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true,width: 150 },
    { headerName: 'Name', field: 'name', sortable: true, filter: true,width: 150 },
    { headerName: 'Organization', field: 'login', sortable: true, filter: true,width: 150 },
    {
      headerName: 'URL',
      field: 'git_url',
      width: 300,
      cellRenderer: (params: any) =>
          `<a href="${params.value}" target="_blank">${params.value}</a>`,
    },
    { headerName: 'Include', field: 'included', checkboxSelection: true, width: 150 },
    { headerName: 'Commits', field: 'commits', sortable: true, filter: true,width: 100 },
    { headerName: 'PRs', field: 'pullRequests', sortable: true, filter: true,width: 100 },
    { headerName: 'Issues', field: 'issues', sortable: true, filter: true,width: 100 },
  ];

  // Initial data for repositories
  rowData: any[] = [];

  // Aggregated User Stats
  userStats: any[] = [];

  // Column definitions for user-level aggregated stats
  statsColumnDefs = [
    { headerName: 'User', field: 'user', sortable: true, filter: true,width: 300 },
    { headerName: 'Total Commits', field: 'totalCommits', sortable: true, filter: true,width: 300 },
    { headerName: 'Total Pull Requests', field: 'totalPullRequests', sortable: true, filter: true,width: 300 },
    { headerName: 'Total Issues', field: 'totalIssues', sortable: true, filter: true,width: 300 },
  ];

  constructor(private orgService: OrganizationService) {
    this.gridOptions = {
      paginationPageSize: 10,
      domLayout: 'autoHeight',
    };
    this.stategridOptions = {
      paginationPageSize: 10,
      domLayout: 'autoHeight',
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
    const selectedRepos = selectedNodes.map((node: any) => node.data);
    if(selectedRepos.length){
      selectedRepos.forEach((repo: any) => {
        this.orgService.getRepoDetails(repo.login, repo.name).subscribe(
            (details: any) => {
              repo.commits = details.commits.length;
              repo.pullRequests = details.pullRequests.length;
              repo.issues = details.issues.length;
              event.api.refreshCells({ rowNodes: [repo] });
              for (const key in details.userStats) {
                const selectedObject = details.userStats[key];
                this.updateUserStats({...selectedObject, user: key});              }

            },
            (error) =>
                console.error(
                    `Error fetching details for repo ${repo.name}:`,
                    error
                )
        );

      });
    } else {
      this.gridOptions.api.setRowData([]);
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
    if (this.gridOptions.api) {
      console.log(this.userStats)
      this.gridOptions.api.setRowData(this.userStats);
    }
  }
}
