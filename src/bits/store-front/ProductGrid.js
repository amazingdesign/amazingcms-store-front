import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import ProductCard from './ProductCard'

const ProductGrid = ({ products, onCardClick, addToCartClick, addToCartLabel }) => {
  return (
    <Grid
      container
      spacing={2}
      justify={'center'}
      alignItems={'center'}
    >
      {
        products && products.map((product) => (
          <Grid
            item
            key={product._id}
          >
            <ProductCard
              image={product.photo}
              name={product.name}
              price={product.price}
              currency={product.currency}
              description={product.description}
              onClick={onCardClick}
              actions={[
                {
                  label: addToCartLabel || 'Add to cart',
                  icon: 'add_shopping_cart',
                  onClick: (e) => addToCartClick && addToCartClick(e, product),
                },
              ]}
            />
          </Grid>
        ))
      }
    </Grid>
  )
}

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
  onCardClick: PropTypes.func,
  addToCartClick: PropTypes.func,
  addToCartLabel: PropTypes.string,
}

export default ProductGrid