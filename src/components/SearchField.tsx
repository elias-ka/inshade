import { Autocomplete, TextField } from '@mui/material';
import { debounce } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Place } from '../models/Address';

interface SearchFieldProps {
    label: string;
    loading: boolean;
    options: Place[] | undefined;
    onChange: (place: Place | null) => void;
    onInput: (value: string) => void;
}

export default function SearchField({
    label,
    options,
    loading,
    onChange,
    onInput,
}: SearchFieldProps) {
    const debouncedInputHandler = useMemo(() => {
        return debounce((value: string) => onInput(value), 500);
    }, [onInput]);

    useEffect(() => {
        return () => {
            debouncedInputHandler.cancel();
        };
    }, [debouncedInputHandler]);

    return (
        <Autocomplete
            freeSolo
            size="small"
            loading={loading}
            options={options ?? []}
            filterOptions={(opts) => opts}
            onChange={(_, value) => (value && typeof value === 'object' ? onChange(value) : null)}
            onInputChange={(_, value, reason) => {
                return reason === 'input' ? debouncedInputHandler(value) : onChange(null);
            }}
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.displayName ?? ''
            }
            renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
        />
    );
}
