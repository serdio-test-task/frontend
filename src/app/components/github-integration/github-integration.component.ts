import { Component, OnInit } from '@angular/core';
import { GithubIntegrationService } from '../../services/github-integration.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-github-integration',
    templateUrl: './github-integration.component.html',
    styleUrls: ['./github-integration.component.css'],
    providers: [DatePipe]
})
export class GithubIntegrationComponent implements OnInit {
    isConnected: boolean = false;
    connectedAt: string | null = null;
    formattedConnectedAt: string | null = null; // Store the formatted date

    constructor(private datePipe: DatePipe, private githubService: GithubIntegrationService) {}

    ngOnInit(): void {
        this.checkConnection();
    }
    checkConnection(): void {
        this.githubService.checkConnection().subscribe(
            (response: { connectedAt: string | null; }) => {
                this.isConnected = true;
                this.connectedAt = response.connectedAt;

                // Format the connectedAt date if it exists
                if (this.connectedAt) {
                    this.formattedConnectedAt = this.datePipe.transform(this.connectedAt, 'yyyy-MM-dd HH:mm:ss');
                }
            },
            (error: any) => {
                this.isConnected = false;
                console.error('Error checking connection', error);
            }
        );
    }

    connect(): void {
        window.location.href = 'http://localhost:3000/api/github/auth';
    }

    disconnect(): void {
        this.githubService.disconnect().subscribe(
            () => {
                this.isConnected = false;
                this.connectedAt = null;
                this.formattedConnectedAt = null; // Reset formatted date
            },
            (error: any) => console.error('Error disconnecting', error)
        );
    }
}
