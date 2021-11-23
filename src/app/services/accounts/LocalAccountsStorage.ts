import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AccountInfo, AccountsStorage } from "./AccountsStorage";

@Injectable()
export class LocalAccountsStorage implements AccountsStorage {
    constructor() {
        const accountsStorageValue: string = localStorage.getItem(this.ACCOUNT_KEY) || '';
        if (accountsStorageValue) {
            const value = JSON.parse(atob(accountsStorageValue));
            this.accounts = value;
        }
        const activeAccountStorageValue: string = localStorage.getItem(this.ACTIVE_ACCOUNT_KEY) || '';
        if (activeAccountStorageValue) {
            const value = JSON.parse(atob(activeAccountStorageValue));
            this.active = value;
        }
    }

    private readonly ACCOUNT_KEY = 'accounts';
    private readonly ACTIVE_ACCOUNT_KEY = 'active';

    private _accounts$ = new BehaviorSubject<AccountInfo[]>([]);
    get accounts$() { return this._accounts$.asObservable(); }
    set accounts(accounts: AccountInfo[]) { 
        this._accounts$.next(accounts);
        localStorage.setItem(this.ACCOUNT_KEY, btoa(JSON.stringify(accounts)));
    }

    private _active$ = new BehaviorSubject<AccountInfo | null>(null);
    get active$(): Observable<AccountInfo> { return this._active$.asObservable() as Observable<AccountInfo>; }
    get active(): AccountInfo { return this._active$.getValue() as AccountInfo; } 
    set active(account: AccountInfo) {
        this._active$.next(account);
        localStorage.setItem(this.ACTIVE_ACCOUNT_KEY, btoa(JSON.stringify(account)));
    }


    add(account: AccountInfo) {
        const accounts: AccountInfo[] = this._accounts$.getValue();
        const updated: AccountInfo[] = [...accounts, account];

        this.accounts = updated;
    }

    remove(account: AccountInfo) {
        const {name, key, secret} = account;
        const accounts: AccountInfo[] = this._accounts$.getValue();
        const updated: AccountInfo[] = accounts.filter(acc => {
            return acc.key !== key && acc.name !== name && acc.secret !== secret;
        });

        this.accounts = updated;
    } 
}