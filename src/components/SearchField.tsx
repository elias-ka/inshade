import { Autocomplete, TextField } from '@mui/material';
import { debounce } from 'lodash';
import { useEffect, useMemo } from 'react';
import { AddressFeature } from '../models/Address';

interface SearchFieldProps {
    label: string;
    loading: boolean;
    value: AddressFeature | null;
    options: AddressFeature[] | undefined;
    onInput: (value: string) => void;
    onChange: (value: AddressFeature | null) => void;
}

export function SearchField({ label, options, onInput, onChange, ...props }: SearchFieldProps) {
    const debouncedChangeHandler = useMemo(() => {
        return debounce((value: string) => onInput(value), 300);
    }, []);

    useEffect(() => {
        return () => {
            debouncedChangeHandler.cancel();
        };
    }, []);

    return (
        <Autocomplete
            {...props}
            clearOnEscape
            autoHighlight
            size="small"
            sx={{ width: '100%' }}
            options={options || []}
            getOptionLabel={(option) =>
                option.properties.displayName || option.properties.name || ''
            }
            isOptionEqualToValue={(option, value) => {
                return option.properties.osmdId === value.properties.osmdId;
            }}
            onChange={(_event, value) => {
                onChange(value);
            }}
            onInputChange={(_event, value, reason) => {
                if (reason === 'input') debouncedChangeHandler(value);
            }}
            renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
        />
    );
}
