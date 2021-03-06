import React from 'react'
import {Icon} from 'react-icons-kit'
import {plus} from 'react-icons-kit/feather/plus'
import {minus} from 'react-icons-kit/feather/minus'
import {auth,fs} from '../Config/Config'
export const IndividualCartProduct = ({cartProduct,cartProductIncrease,cartProductDecrease}) => {
    const handleCartProductIncrease=()=>{
        cartProductIncrease(cartProduct);
    }

    const handleCartProductDecrease=()=>{
        cartProductDecrease(cartProduct);
    }

    const handleCartProductDelete=()=>{
        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('Cart ' + user.uid).doc(cartProduct.ID).delete().then(()=>{
                    console.log('successfully deleted');
                })
            }
        })
    }
    return (
        <div className='product'>
            <div className='product-img'>
                <img src={cartProduct.url} alt="product-img"/>
            </div>
            <div className='product-text title'>{cartProduct.title}</div>
            <div className='product-text description'>{cartProduct.description}</div>
            <div className='product-text price'>Rs. {cartProduct.price}</div>

            <div className='product-text qty-in-stock'>{cartProduct.qtyinstock} Units Available</div>

            <span>Quantity</span>
            <div className='product-text quantity-box'>
                <div className='action-btns minus' onClick={handleCartProductDecrease}>
                    <Icon icon={minus} size={20}/>
                </div>                
                <div>{cartProduct.qty}</div>
                {cartProduct.qty < cartProduct.qtyinstock && (
                    <div>
                <div className='action-btns plus' onClick={handleCartProductIncrease} >
                    <Icon icon={plus} size={20}/>
                </div>

                    </div>
            ) }              
            </div>
            <div className='product-text cart-price'>Rs. {cartProduct.qty*cartProduct.price}</div>
            <div className=''><button className='delete-button' onClick={handleCartProductDelete}>DELETE</button></div>            
        </div>
    )
}