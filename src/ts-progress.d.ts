interface IProgressOptions{
    total: number,
    pattern?: string,
    textColor?: string,
    title?: string,
    updateFrequency?: number
}

interface Progress{
    update();
}

declare module "ts-progress"{
    var progress: {
        /**
         * @deprecated use Progress.create(options: IProgressOptions)
         */
        new (total: number, pattern?: string, textColor?: string, title?: string, updateFrequency?: number): Progress;
        /**
         * Creates new progress bar object
         * @param options {IProgressOptions}
         * @returns {Progress}
         */
        create(options: IProgressOptions): Progress
    };
    export = progress;
}