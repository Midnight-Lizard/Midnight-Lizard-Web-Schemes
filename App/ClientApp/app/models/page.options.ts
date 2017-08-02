export interface PageOptions
{
    pageIndex: number;
    pageSize: number;
    length: number;
}

export const getDefaultPageOptions: () => PageOptions =
    () => { return { length: 0, pageIndex: 0, pageSize: 5 }; }


export const PageSizes = [5, 10, 25, 50, 100];