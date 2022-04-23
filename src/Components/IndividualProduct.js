import React from 'react'

export const IndividualProduct = ({individualProduct, addToCart}) => {
    //console.log(individualProduct);       <div className='product-text qty-single'>Rs. {individualProduct.qty}</div>
   
    const handleAddToCart=()=>{
        addToCart(individualProduct);
    }  
    return (
        <div className='product'>
            <div className='product-img'>
                <img src={individualProduct.url} alt="product-img"/>
            </div>
            <div className='product-text title'>{individualProduct.title}</div>
            <div className='product-text description'>{individualProduct.description}</div>
            <div className='product-text price'>Rs. {individualProduct.price}/-</div>
            
            {individualProduct.qtyinstock < 1 && (
                <div className='product-text qty-in-stock'>No Units in Stock. Sorry!</div>

            ) } 
            {individualProduct.qtyinstock > 0 && (
            <div className='product-text qty-in-stock'>{individualProduct.qtyinstock} Units Available</div>
            ) } 
            <div ><button className='button-wide' onClick={handleAddToCart}>ADD TO CART</button></div>
        </div> 
    )
}
