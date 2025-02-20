interface ProgressOptions{
    total: number,
    pattern?: string,
    textColor?: string,
    title?: string,
    updateFrequency?: number
}

interface Progress{
    /**
     * Updates progress
     */
    update(): void;

    /**
     * Finishes progress
     */
    done(): void;
}

declare module "ts-progress"{
    function create(options: ProgressOptions): Progress
}