interface IProgressOptions{
    total: number,
    pattern?: string,
    textColor?: string,
    title?: string,
    updateFrequency?: number
}

declare module "ts-progress"{
    export class Progress{
        static create(options: IProgressOptions): Progress;
        update(): void;
    }
}