import { Box, Typography } from '@mui/material';
import { SunExposureResult } from '../worker';

interface SunExposureDisplayProps {
  result: SunExposureResult;
}

const PercentageDisplay = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <Box display="flex" alignItems="center" mb={1}>
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: color,
        marginRight: 8,
      }}
    />
    <Typography>
      {label}: <strong>{value}%</strong>
    </Typography>
  </Box>
);

export function SunExposureDisplay({ result }: SunExposureDisplayProps) {
  const left = parseFloat(result.leftPercentage);
  const right = parseFloat(result.rightPercentage);
  const preferredSeating =
    left > right ? 'Right Side' : right > left ? 'Left Side' : 'No Preference';

  return (
    <Box>
      <Typography mb={1}>
        Preferred Seating: <strong>{preferredSeating}</strong>
      </Typography>
      <PercentageDisplay label="Left Side" value={result.leftPercentage} color="#FFA500" />
      <PercentageDisplay label="Right Side" value={result.rightPercentage} color="#4A90E2" />
      <PercentageDisplay label="Not Visible" value={result.notVisiblePercentage} color="gray" />
    </Box>
  );
}
