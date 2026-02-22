declare let cv: any;

export interface Editor {
    readonly rows: number;
    readonly cols: number;
    getImage(): any;
}
