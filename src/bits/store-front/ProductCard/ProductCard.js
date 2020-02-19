/* eslint-disable max-lines */
import React from 'react'
import PropTypes from 'prop-types'

import {
  Tooltip,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Icon from '@bit/amazingdesign.react-redux-mui-starter.icon'

const useStyles = makeStyles({
  root: {
    width: (props) => props.fullScreen ? '100%' : 300,
  },
  media: {
    height: (props) => props.fullScreen ? 400 : 180,
  },
  description: {
    height: 60,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  button: {
    padding: '0.25rem 0.75rem',
  },
  buttonWithIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1rem',
  },
  actions: {
    justifyContent: 'flex-start',
  },
})

const ProductCard = ({
  id,
  image,
  name,
  price,
  currency,
  description,
  content,
  actions,
  onClick,
  placeholder,
  fullScreen,
  displayDescription = true,
  children,
}) => {
  const classes = useStyles({ fullScreen })
  const priceTag = `${price === undefined ? '' : String(price)} ${currency === undefined ? '' : String(currency)}`

  const CardActionAreaComponent = fullScreen ? React.Fragment : CardActionArea

  return (
    <Card className={classes.root}>
      <CardActionAreaComponent
        onClick={() => onClick && onClick(id)}
      >
        <CardMedia
          className={classes.media}
          image={image || placeholder}
          title={name}
        />
        <CardContent>
          <Typography noWrap={true} gutterBottom variant={'h5'} component={'h2'}>
            {name}
          </Typography>
          {
            displayDescription ?
              <>
                <Typography variant={'body2'} color={'textSecondary'} component={'div'}>
                  {content}
                </Typography>
                <Typography className={classes.description} variant={'body2'} color={'textSecondary'} component={'p'}>
                  {description}
                </Typography>
              </>
              :
              children
          }
          {children}
        </CardContent>
      </CardActionAreaComponent>
      <CardActions className={classes.actions}>
        {
          actions && actions.map(({ label, onClick, icon, addPriceTag }, i) => (
            <Button
              className={classes.button}
              key={i}
              size={'small'}
              color={'primary'}
              onClick={onClick}
            >
              {
                icon ?
                  <Tooltip title={label}>
                    <span className={classes.buttonWithIcon}>
                      {addPriceTag ? `${priceTag} ` : ''}
                      <Icon>{icon}</Icon>
                    </span>
                  </Tooltip>
                  :
                  `${addPriceTag ? `${priceTag} ` : ''}${label}`
              }
            </Button>
          ))
        }
      </CardActions>
    </Card>
  )
}

ProductCard.propTypes = {
  children: PropTypes.node,
  displayDescription: PropTypes.bool,
  fullScreen: PropTypes.bool,
  onClick: PropTypes.func,
  id: PropTypes.string,
  image: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  description: PropTypes.string,
  price: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  currency: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    icon: PropTypes.string,
    onClick: PropTypes.func,
  })),
}

export default ProductCard