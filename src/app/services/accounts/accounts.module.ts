import { NgModule } from "@angular/core";
import { ACCOUNTS_STORAGE_PROVIDER, ACTIVE_ACCOUNT_PROVIDER, ACTIVE_ACCOUNT_STREAM_PROVIDER } from "./AccountsStorage";
import { LocalAccountsStorage } from "./LocalAccountsStorage";

@NgModule({
    providers: [
        LocalAccountsStorage,
        ACCOUNTS_STORAGE_PROVIDER,
        ACTIVE_ACCOUNT_PROVIDER,
        ACTIVE_ACCOUNT_STREAM_PROVIDER
    ]
})
export class AccountsModule {}