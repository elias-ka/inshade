import { Autocomplete, TextField, Typography } from '@mui/material';
import { SyntheticEvent } from 'react';
import { ITimezoneOption, useTimezoneSelect } from 'react-timezone-select';

interface TimezoneSelectProps {
    onChange(event: SyntheticEvent<Element, Event>, tz: ITimezoneOption): void;
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
            onChange={onChange}
            value={parseTimezone(value)}
            size="small"
            renderInput={(params) => <TextField {...params} label="Timezone" variant="outlined" />}
            renderOption={(props, option) => {
                return (
                    <li {...props} key={option.value}>
                        <Typography variant="body2">{option.label}</Typography>
                    </li>
                );
            }}
        />
    );
}
