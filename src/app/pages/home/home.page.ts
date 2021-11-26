import { Component, Inject, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import Big from 'big.js';
import * as dayjs from "dayjs";
import { filter, map, mergeMap, share, shareReplay, startWith, switchMap, tap } from "rxjs/operators";
import { combineLatest, Observable, of } from "rxjs";
import { Tile } from "@angular/material/grid-list/tile-coordinator";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AccountInfo, ACTIVE_ACCOUNT_STREAM } from "src/app/services/accounts/AccountsStorage";

const DATE_FORMAT = 'MM-DD-YYYY';

export interface FiltersQueryParams {
    start?: string;
    end?: string;
    bots?: number[];
    coins?: string[];
}

@Component({
    selector: 'home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
    constructor(
        private $http: HttpClient,
        private $router: Router,
        private $route: ActivatedRoute,
        @Inject(ACTIVE_ACCOUNT_STREAM) private activeAccount$: Observable<AccountInfo>
    ) {}

    ICON_URL = 'https://3commas.io/currency/icon/';
    BASE_URL = 'https://api.3commas.io';
    tiles: Tile[] = [
        {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
        {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
        {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
        {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
    ] as any;

    filters: FormGroup = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
        bots: new FormControl([]),
        coins: new FormControl([])
    });

    ngOnInit() {
        this.filters.valueChanges.subscribe(filters => {
            this.$router.navigate(['.'], { queryParams: {
                ...filters,
                start: filters.start && dayjs(filters.start).format(DATE_FORMAT) || undefined,
                end: filters.end && dayjs(filters.end).format(DATE_FORMAT) || undefined,
            } });
        });
    }

    filters$ = this.filters.valueChanges.pipe(shareReplay());
    allData$ = this.activeAccount$.pipe(
        filter(account => !!account),
        switchMap(account => {
            const {key, secret} = account;
            return this.getDeals(0, key, secret);
        }),
        share()
    );
    bots$: any = this.allData$.pipe(
        map((deals: any) => {
            const bots = deals.reduce((acc: any, deal: any) => {
                const { bot_id, bot_name } = deal;

                return { ...acc, [bot_id]: { id: bot_id, name: bot_name } };
            }, {});

            return Object.values(bots);
        }),
        startWith([]),
    );

    coins$ = this.allData$.pipe(
        map((deals: any) => {
            const coins = deals.reduce((acc: any, deal: any) => {
                const { to_currency } = deal;

                return { ...acc, [to_currency]: 0 };
            }, {});

            return Object.keys(coins);
        }),
        tap(_ => {
            const params: FiltersQueryParams = this.$route.snapshot.queryParams;
            this.filters.setValue({
                start: (params.start && dayjs(params.start, DATE_FORMAT).toDate()) || null,
                end: (params.end && dayjs(params.end, DATE_FORMAT).toDate()) || null,
                bots: Array.isArray(params.bots) && params.bots.map(bot_id => +bot_id) || params.bots && [+params.bots] || [],
                coins: Array.isArray(params.coins) && params.coins || params.coins && [params.coins] || []
            });
        }),
        startWith([]),
    );
    data$ = combineLatest([
        this.allData$,
        this.filters$.pipe(startWith({ start: null, end: null, bots: [], coins: [] }))
    ]).pipe(
        map(([deals, filters]: any) => {
            return deals.filter((deal: any) => {
                const {bought_amount, sold_amount, localized_status, closed_at, bot_id, to_currency} = deal;
                const { start, end, bots, coins } = filters;
                const conditions = [
                    bought_amount !== null,
                    sold_amount !== null,
                    ['Completed', 'Closed at Market Price'].includes(localized_status),
                    (new Date(closed_at) >= new Date(start) || start === null),
                    (new Date(closed_at) <= dayjs(end).add(1, 'day').subtract(1, 'second').toDate() || end === null),
                    bots.includes(bot_id) || bots.length === 0,
                    coins.includes(to_currency) || coins.length === 0
                ];

                return conditions.every(condition => condition);
            })
        }),
        share(),
        startWith([])
    )

    profits$: Observable<{ value: number, key: string }[]> = this.data$.pipe(
        map((_: any) => {
            const deals = _.map((deal: any) => {
                const { bought_amount, bought_average_price, sold_amount, sold_average_price, bot_id, bot_name, from_currency, to_currency, pair } = deal;

                const base_profit = new Big(bought_amount).minus(new Big(sold_amount)).toString();
                const quote_profit = new Big(sold_amount)
                    .mul(new Big(sold_average_price))
                    .minus( new Big(bought_amount).mul(new Big(bought_average_price)) )
                    .toString()

                return {
                    bot_id, bot_name, from_currency, to_currency, pair,
                    base_profit,
                    quote_profit
                }
            }).reduce((acc: any, deal: any) => {
                const { from_currency, to_currency, base_profit, quote_profit } = deal;

                return {
                    ...acc,
                    [from_currency]: new Big(acc[from_currency] || 0).add(new Big(quote_profit)).toString(),
                    [to_currency]: new Big(acc[to_currency] || 0).add(new Big(base_profit)).toString(),
                }
            }, {});

            return Object.entries(deals)
                .sort(([,valueA]: any, [,valueB]: any) => { return +new Big(valueB).minus(valueA).valueOf(); })
                .map(([key, value]) => ({value, key} as any));
        })
    )

    resetValue = (value: any) => {
        this.filters.patchValue(value);
    }

    getDeals(offset = 0, key: string, secret: string): any {
        const query = Object.entries({
            scope: 'finished',
            order: 'closed_at',
            limit: 1000,
            // bot_id: 6139054,
            // bot_id: 5735570,
            offset
        }).map(([key, value]) => `${key}=${value}`).join('&');

        return this.$http.get(`${this.BASE_URL}/public/api/ver1/deals?${query}`).pipe(
            mergeMap((deals: any) => {
                if (deals.length < 1000) {
                    return of(deals);
                } else {
                    return this.getDeals(offset + 1000, key, secret).pipe(
                        map((nextDeals: any) => [...deals, ...nextDeals])
                    )
                }
            })
        )
    }

}