import { Autocomplete, TextField } from '@mui/material';
import { useTimezoneSelect } from 'react-timezone-select';

interface TimezoneSelectProps {
    onChange(tz: string): void;
    value: string;
}

export default function TimezoneSelect({ onChange, value }: TimezoneSelectProps) {
    const { options: tzOptions, parseTimezone } = useTimezoneSelect({});

    return (
        <Autocomplete
            autoComplete
            autoHighlight
            disableClearable
            options={tzOptions}
            onChange={(_, tz) => {
                if (tz) onChange(tz.value);
            }}
            value={parseTimezone(value)}
            size="small"
            renderInput={(params) => <TextField {...params} label="Timezone" variant="outlined" />}
        />
    );
}
