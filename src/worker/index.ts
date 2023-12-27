import workerUrl from './worker.ts?worker&url';

export interface SunExposureResult {
    leftPercentage: string;
    rightPercentage: string;
    notVisiblePercentage: string;
    segments: number[];
}

export const sunExposureWorker = new Worker(workerUrl, {
    type: 'module',
});
