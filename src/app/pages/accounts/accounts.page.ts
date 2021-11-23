import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, tap } from "rxjs";
import { AccountInfo, AccountsStorage, ACCOUNTS_STORAGE } from "src/app/services/accounts/AccountsStorage";

@Component({
    selector: 'accounts',
    templateUrl: './accounts.page.html',
    styleUrls: ['./accounts.page.scss']
})
export class AccountsPage {
    constructor(
        @Inject(ACCOUNTS_STORAGE) private $accounts: AccountsStorage
    ) {
        this.dataSource = new AccountsDataSource($accounts.accounts$.pipe(tap(console.log)));
    }

    displayedColumns = ['name', 'key', 'secret'];
    dataSource: AccountsDataSource;

    account = new FormGroup({
        name: new FormControl(null, Validators.required),
        key: new FormControl(null, Validators.required),
        secret: new FormControl(null, Validators.required),
    });

    addAccount() {
        if (this.account.invalid) {
            return;
        }

        this.$accounts.add(this.account.value);
        this.account.setValue({ name: null, key: null, secret: null });
        this.account.markAsPristine();
        this.account.markAsUntouched();
    }
}

export class AccountsDataSource extends DataSource<AccountInfo[]> {
    disconnect(collectionViewer: CollectionViewer): void {
        // throw new Error("Method not implemented.");
        console.log('disconnect', collectionViewer)
    }
    constructor(private stream$: Observable<AccountInfo[]>) {
        super();
    }

    connect(): any {
        return this.stream$
    }
}
