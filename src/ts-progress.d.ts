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

declare var progress: {
    /**
     * @deprecated use create static function instead
     */
    new (total: number, pattern?: string, textColor?: string, title?: string, updateFrequency?: number): Progress;
    /**
     * Creates new progress bar object
     * @param options
     * @returns {Progress}
     */
    create(options: IProgressOptions): Progress
};

declare module "ts-progress"{
    export = progress;
}