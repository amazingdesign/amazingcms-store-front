import React from 'react'
import PropTypes from 'prop-types'

import { Paper, IconButton, InputBase, Divider, Tooltip } from '@material-ui/core'
import { Check as CheckIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}))

const InputWithButton = ({
  placeholder,
  onClick,
  onChange,
  value,
  inputBaseProps,
  paperProps,
  dividerProps,
  iconButtonProps,
  iconProps,
  buttonComponent: ButtonComponent,
  tooltip,
}) => {
  const classes = useStyles()
  const TooltipComponent = tooltip ? Tooltip : React.Fragment

  return (
    <Paper
      variant={'outlined'}
      className={classes.root}
      {...paperProps}
    >
      <InputBase
        className={classes.input}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...inputBaseProps}
      />
      <Divider
        className={classes.divider}
        orientation={'vertical'}
        {...dividerProps}
      />
      <TooltipComponent title={tooltip}>
        {
          ButtonComponent ?
            <ButtonComponent
              onClick={onClick}
              {...iconButtonProps}
            />
            :
            <IconButton
              color={'primary'}
              className={classes.iconButton}
              onClick={onClick}
              {...iconButtonProps}
            >
              <CheckIcon {...iconProps} />
            </IconButton>
        }
      </TooltipComponent>
    </Paper>
  )
}

InputWithButton.propTypes = {
  tooltip: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  inputBaseProps: PropTypes.object,
  paperProps: PropTypes.object,
  dividerProps: PropTypes.object,
  iconButtonProps: PropTypes.object,
  iconProps: PropTypes.object,
  buttonComponent: PropTypes.func,
  onClick: PropTypes.func,
}

export default InputWithButton