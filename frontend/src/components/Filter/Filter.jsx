import React from 'react'
import {
  Grid,
  Select,
  FormControlLabel,
  MenuItem,
  Checkbox,
  createStyles,
  withStyles,
  TextField,
} from '@material-ui/core'

const filterStyles = theme =>
  createStyles({
    orderBySelect: {
      marginLeft: theme.spacing.unit,
    },
  })

const Filter = ({
  classes,
  onToggleWithName,
  onToggleWithImage,
  onOrderBy,
  withName,
  withImage,
  orderBy,
  onDateChange,
  dateChange,
}) => (
  <Grid item>
    <Grid container direction="row">
      {/* <FormControlLabel
        control={
          <Checkbox
            checked={withName}
            onChange={event => onToggleWithName && onToggleWithName()}
          />
        }
        label="With names"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={withImage}
            onChange={event => onToggleWithImage && onToggleWithImage()}
          />
        }
        label="With images"
      />
      <FormControlLabel
        control={
          <Select
            className={classes.orderBySelect}
            value={orderBy}
            onChange={event => onOrderBy && onOrderBy(event.target.value)}
          >
            <MenuItem value="id">ID</MenuItem>
            <MenuItem value="imageUrl">Image</MenuItem>
            <MenuItem value="displayName">Name</MenuItem>
            <MenuItem value="owner">Owner</MenuItem>
          </Select>
        }
        label="Order By:"
        labelPlacement="start"
      /> */}
        <TextField
          label="Start Date"
          type="date"
          defaultValue="2017-01-01"
          value={dateChange}
          //className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={event => onDateChange && onDateChange(event.target.value)}
        />
    </Grid>
  </Grid>
)

const StyledFilter = withStyles(filterStyles)(Filter)

export default StyledFilter
