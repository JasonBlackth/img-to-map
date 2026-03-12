

export interface Editor {
    readonly rows: number;
    readonly cols: number;

    handleValuesChanged(): any;
}
