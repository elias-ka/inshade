import SunCalc from 'suncalc';

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const findAzimuth = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);

    const diffRad = toRadians(lon2 - lon1);

    const y = Math.sin(diffRad) * Math.cos(lat2Rad);
    const x =
        Math.cos(lat1Rad) * Math.sin(lat2Rad) -
        Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(diffRad);

    let azimuth = Math.atan2(y, x);
    azimuth = (azimuth + 2 * Math.PI) % (2 * Math.PI);

    return azimuth;
};

enum SunlitSide {
    LEFT = -1,
    RIGHT = 1,
    NOT_VISIBLE = 0,
}

const getSunlitSide = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    date: Date
): SunlitSide => {
    const { sunset, sunrise } = SunCalc.getTimes(date, lat1, lon1);
    if (date > sunset && date < sunrise) {
        return SunlitSide.NOT_VISIBLE;
    }

    const { altitude, azimuth } = SunCalc.getPosition(date, lat1, lon1);
    if (altitude < 0 || altitude > Math.PI / 2 || azimuth < 0 || azimuth > 2 * Math.PI) {
        return SunlitSide.NOT_VISIBLE;
    }

    const busAzimuth = findAzimuth(lat1, lon1, lat2, lon2);
    const diff = busAzimuth - azimuth;

    if (diff >= Math.PI) {
        return SunlitSide.LEFT;
    } else if (diff < -Math.PI || diff >= 0) {
        return SunlitSide.RIGHT;
    } else {
        return SunlitSide.LEFT;
    }
};

onmessage = (event: MessageEvent<[Date, number[][], number]>) => {
    const [date, coordinates, duration] = event.data;

    const segments: SunlitSide[] = [];

    let leftCount = 0;
    let rightCount = 0;
    let notVisibleCount = 0;

    const coordinateDuration = duration / coordinates.length;

    for (let i = 1; i < coordinates.length; i++) {
        const [lon1, lat1] = coordinates[i - 1];
        const [lon2, lat2] = coordinates[i];

        date.setSeconds(date.getSeconds() + coordinateDuration);
        const sunlitSide = getSunlitSide(lat1, lon1, lat2, lon2, date);

        if (sunlitSide === SunlitSide.LEFT) {
            leftCount++;
        } else if (sunlitSide === SunlitSide.RIGHT) {
            rightCount++;
        } else if (sunlitSide === SunlitSide.NOT_VISIBLE) {
            notVisibleCount++;
        }

        segments.push(sunlitSide);
    }

    const pct = (count: number): string => {
        return ((count / segments.length) * 100 || 0).toFixed(2);
    };

    postMessage({
        leftPercentage: pct(leftCount),
        rightPercentage: pct(rightCount),
        notVisiblePercentage: pct(notVisibleCount),
        segments,
    });
};
