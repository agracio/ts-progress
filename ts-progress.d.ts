declare module "ts-progress"{

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
        update();

        /**
         * Finishes progress
         */
        done();
    }

    function create(options: ProgressOptions): Progress
}