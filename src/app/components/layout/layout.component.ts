import { Component, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { AccountInfo, AccountsStorage, ACCOUNTS_STORAGE, ACTIVE_ACCOUNT_STREAM } from "src/app/services/accounts/AccountsStorage";

@Component({
    selector: 'layout',
    template: `
        <header>
            <mat-toolbar color="primary">
                <span>{{APP_NAME}}</span>

                <button mat-button *ngFor="let item of NAV" [routerLink]="item.path"> {{item.label}} </button>

                <span class="spacer"></span>

                <span>{{ (activeAccount$ | async)?.name }}</span>
                <button mat-icon-button class="example-icon" aria-label="Example icon-button with menu icon" [matMenuTriggerFor]="accounts">
                    <mat-icon>menu</mat-icon>
                </button>

                <mat-menu #accounts="matMenu">
                    <button mat-menu-item *ngFor="let account of accounts$ | async" (click)="setActive(account)">{{account.name}}</button>
                </mat-menu>
            </mat-toolbar>
        </header>
        <section class="page">
            <ng-content></ng-content>
        </section>
    `,
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
    constructor(
        @Inject(ACCOUNTS_STORAGE) private $accounts: AccountsStorage,
        @Inject(ACTIVE_ACCOUNT_STREAM) public activeAccount$: Observable<AccountInfo>
    ) {}

    APP_NAME = '3Commas bots stats';

    NAV = [
        { label: 'Home', path: ['/'] },
        { label: 'Accounts', path: ['/accounts'] },
    ];

    accounts$ = this.$accounts.accounts$;

    setActive(account: AccountInfo) {
        this.$accounts.active = account;
    }
}