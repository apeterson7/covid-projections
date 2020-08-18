import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { YAxisScale } from './interfaces';

const ScaleSelector: React.FC<{
  scale: YAxisScale;
  setScale: (updatedScale: YAxisScale) => void;
}> = ({ scale, setScale }) => {
  const onChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setScale(event.target.value as YAxisScale);
  };

  return (
    <FormControl>
      <InputLabel id="select-y-axis-scale-label">Scale</InputLabel>
      <Select
        labelId="select-y-axis-scale-label"
        id="select-scale"
        value={scale}
        onChange={onChange}
      >
        <MenuItem value={YAxisScale.LINEAR}>Linear</MenuItem>
        <MenuItem value={YAxisScale.LOG}>Log</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ScaleSelector;
