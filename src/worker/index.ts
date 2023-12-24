import workerUrl from './worker.ts?worker&url';

export interface SunExposureResult {
    leftPercentage: number;
    rightPercentage: number;
    notVisiblePercentage: number;
    segments: number[];
}

export const sunExposureWorker = new Worker(workerUrl, {
    type: 'module',
});
