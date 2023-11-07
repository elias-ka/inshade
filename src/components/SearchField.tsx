import { Autocomplete, TextField, createFilterOptions } from '@mui/material';
import { debounce } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Place } from '../models/Address';

interface SearchFieldProps {
    label: string;
    loading: boolean;
    options: Place[] | undefined;
    onChange(value: Place): void;
    onInput: (value: string) => void;
}

export default function SearchField({
    label,
    options,
    loading,
    onChange,
    onInput,
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
            freeSolo
            clearOnEscape
            autoHighlight
            onChange={(_, value) => {
                if (value) {
                    const option = options?.find((o) => o.displayName === value);
                    if (option) {
                        onChange(option);
                    }
                }
            }}
            filterOptions={createFilterOptions<string>({
                ignoreCase: true,
                ignoreAccents: true,
                trim: true,
                stringify: (option) => option,
            })}
            onInputChange={(_, value) => {
                debouncedChangeHandler(value);
            }}
            loading={loading}
            size="small"
            fullWidth
            options={options?.map((option) => option.displayName ?? '') ?? []}
            renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
        />
    );
}
