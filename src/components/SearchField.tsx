import { Autocomplete, TextField } from '@mui/material';
import { debounce } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Place } from '../models/Address';

interface SearchFieldProps {
    label: string;
    loading: boolean;
    value: Place | null;
    options: Place[] | undefined;
    onInput: (value: string) => void;
    onChange: (value: Place | null) => void;
}

export default function SearchField({
    label,
    options,
    onInput,
    onChange,
    ...rest
}: SearchFieldProps) {
    const debouncedChangeHandler = useMemo(() => {
        return debounce((value: string) => onInput(value), 500);
    }, [onInput]);

    useEffect(() => {
        return () => {
            debouncedChangeHandler.cancel();
        };
    }, [debouncedChangeHandler]);

    return (
        <Autocomplete
            {...rest}
            clearOnEscape
            autoHighlight
            size="small"
            sx={{ width: '100%' }}
            options={options ?? []}
            getOptionLabel={(option) => option.displayName ?? ''}
            isOptionEqualToValue={(option, value) => {
                return option.osmId === value.osmId && option.placeId === value.placeId;
            }}
            onChange={(_event, value) => {
                onChange(value);
            }}
            onInputChange={(_event, value, reason) => {
                if (reason === 'input') debouncedChangeHandler(value);
            }}
            renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
            renderOption={(props, option) => {
                return (
                    <li {...props} key={option.osmId}>
                        <div>{option.displayName}</div>
                    </li>
                );
            }}
        />
    );
}
