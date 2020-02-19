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
    width: 300,
  },
  media: {
    height: 180,
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
    justifyContent: 'flex-end',
  },
})

const ProductCard = ({ image, name, price, currency, description, actions, onClick, placeholder }) => {
  const classes = useStyles()
  const priceTag = `${price === undefined ? '' : String(price)} ${currency === undefined ? '' : String(currency)}`

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={image || placeholder}
          title={name}
          onClick={onClick}
        />
        <CardContent>
          <Typography noWrap={true} gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography className={classes.description} variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.actions}>
        {
          actions && actions.map(({ label, onClick, icon }, i) => (
            <Button
              className={classes.button}
              key={i}
              size="small"
              color="primary"
              onClick={onClick}
            >
              {
                icon ?
                  <Tooltip title={label}>
                    <span className={classes.buttonWithIcon}>
                      {priceTag}
                      {' '}
                      <Icon>{icon}</Icon>
                    </span>
                  </Tooltip>
                  :
                  `${priceTag} ${label}`
              }
            </Button>
          ))
        }
      </CardActions>
    </Card>
  )
}

ProductCard.propTypes = {
  onClick: PropTypes.func,
  image: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  description: PropTypes.string,
  price: PropTypes.string,
  currency: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    icon: PropTypes.string,
    onClick: PropTypes.func,
  })),
}

export default ProductCard