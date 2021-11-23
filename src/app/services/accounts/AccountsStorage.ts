import { InjectionToken, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { LocalAccountsStorage } from "./LocalAccountsStorage";

export interface AccountInfo {
    name: string;
    key: string;
    secret: string;
};

export interface AccountsStorage {
    active: AccountInfo;
    active$: Observable<AccountInfo>;
    accounts$: Observable<AccountInfo[]>
    add: (account: AccountInfo) => void
    remove: (account: AccountInfo) => void
};

export const ACCOUNTS_STORAGE = new InjectionToken('@veliohart/accounts_storage', {
    providedIn: 'root'
} as any);
export const ACTIVE_ACCOUNT_STREAM = new InjectionToken('@veliohart/active_account_stream');
export const ACTIVE_ACCOUNT = new InjectionToken('@veliohart/active_account');

export const ACCOUNTS_STORAGE_PROVIDER = {
    provide: ACCOUNTS_STORAGE,
    deps: [Injector],
    multi: false,
    useFactory: (injector: Injector) => {
        return injector.get(LocalAccountsStorage);
    }
};

export const ACTIVE_ACCOUNT_STREAM_PROVIDER = {
    provide: ACTIVE_ACCOUNT_STREAM,
    deps: [ACCOUNTS_STORAGE],
    multi: false,
    useFactory: (storage: AccountsStorage) => {
        return storage.active$
    },
};

export const ACTIVE_ACCOUNT_PROVIDER = {
    provide: ACTIVE_ACCOUNT,
    deps: [ACCOUNTS_STORAGE],
    multi: false,
    useFactory: (storage: AccountsStorage) => {
        return storage.active
    },
};
