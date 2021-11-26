import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AccountInfo, ACTIVE_ACCOUNT } from "./services/accounts/AccountsStorage";

import * as hmacSHA256 from 'crypto-js/hmac-sha256';
import * as Hex from 'crypto-js/enc-hex';

@Injectable()
export class TestInterceptor implements HttpInterceptor {
    constructor(
        @Inject(ACTIVE_ACCOUNT) private activeAccount: AccountInfo
    ) {}

    private readonly BASE_URL = 'https://api.3commas.io';

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const request = this.handleRequest(req);

        return next.handle(request);
    }

    handleRequest = (req: HttpRequest<any>): HttpRequest<any> => {
        if (!req.url.startsWith(this.BASE_URL)) return req;

        const url = req.url.replace(this.BASE_URL, '');
        const signature: string = this.sign(url);
        const request = req.clone({
            setHeaders: {
                apikey: this.activeAccount.key,
                signature
            },
        });

        return request;
    }

    sign(url: string): string {
        const hmac = hmacSHA256(url, this.activeAccount.secret);
        const hmacDigest = Hex.stringify(hmac);

        return hmacDigest;
    }
}

export const interceptor = {
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: TestInterceptor
};
