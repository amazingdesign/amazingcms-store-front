import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'

import ProductCard from './ProductCard'

const ProductGrid = ({ products, onCardClick, addToCartClick, addToCartLabel, placeholder, productCardProps }) => {
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
              id={product._id}
              image={product.photo}
              name={product.name}
              price={product.price}
              currency={product.currency}
              description={product.description}
              onClick={onCardClick}
              placeholder={placeholder}
              actions={[
                {
                  addPriceTag: true,
                  label: addToCartLabel || 'Add to cart',
                  icon: 'add_shopping_cart',
                  onClick: (e) => addToCartClick && addToCartClick(e, product),
                },
              ]}
              {...productCardProps}
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
  placeholder: PropTypes.string,
  productCardProps: PropTypes.object,
}

export default ProductGrid