/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { auth, fs } from "../Config/Config";
import { CartProducts } from "./CartProducts";
import { Link } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();
export const Cart = () => {

  // getting current user function
  function GetCurrentUser(){
      const [user, setUser]=useState(null);
      useEffect(()=>{
          auth.onAuthStateChanged(user=>{
              if(user){
                  fs.collection('users').doc(user.uid).get().then(snapshot=>{
                      setUser(snapshot.data().FullName);
                  })
              }
              else{
                  setUser(null);
              }
          })
      },[])
      return user;
  }

  const user = GetCurrentUser();
  // console.log(user);
  
  // state of cart products
  const [cartProducts, setCartProducts]=useState([]);

  // getting cart products from firestore collection and updating the state
  useEffect(()=>{
      auth.onAuthStateChanged(user=>{
          if(user){
              fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{
                  const newCartProduct = snapshot.docs.map((doc)=>({
                      ID: doc.id,
                      ...doc.data(),
                  }));
                  setCartProducts(newCartProduct);                    
              })
          }
          else{
              console.log('user is not signed in to retrieve cart');
          }
      })
  },[])

  // console.log(cartProducts);
  
  // getting the qty from cartProducts in a seperate array
  const qty = cartProducts.map(cartProduct=>{
      return cartProduct.qty;
  })

  // reducing the qty in a single value
  const reducerOfQty = (accumulator, currentValue)=>accumulator+currentValue;

  const totalQty = qty.reduce(reducerOfQty,0);

  // console.log(totalQty);

  // getting the TotalProductPrice from cartProducts in a seperate array
  const price = cartProducts.map((cartProduct)=>{
      return cartProduct.TotalProductPrice;
  })

  // reducing the price in a single value
  const reducerOfPrice = (accumulator,currentValue)=>accumulator+currentValue;

  const totalPrice = price.reduce(reducerOfPrice,0);

  // global variable
  let Product;
  const cartErase =async(id)=>{
    let productID=0;
    console.log(id);
    const cart= await fs.collection('users').doc(id).get().then(snapshot=>{
      (productID=snapshot.data().title);
    });
    console.log(productID);
  //   const Product = await fs.collection('Product').get();
  //   Product.map((P)=>{
  //     if (P.name = name){
  //       P.qtyinstock=P.qtyinstock-qty;
  //     }
  //   })
  //   fs.collection('Product ').update(Product).then(()=>{
  //     console.log('Stock Updates');
  // }).catch(()=>{
  //   console.log('Error')
  // })
  }


  // cart product increase function
  const cartProductIncrease=(cartProduct)=>{
      // console.log(cartProduct);
      Product=cartProduct;
      Product.qty=Product.qty+1;
      Product.TotalProductPrice=Product.qty*Product.price;
      // updating in database
      auth.onAuthStateChanged(user=>{
          if(user){
              fs.collection('Cart ' + user.uid).doc(cartProduct.ID).update(Product).then(()=>{
                  console.log('increment added');
              })
          }
          else{
              console.log('user is not logged in to increment');
          }
      })
  }

  // cart product decrease functionality
  const cartProductDecrease =(cartProduct)=>{
      Product=cartProduct;
      if(Product.qty > 1){
          Product.qty=Product.qty-1;
          Product.TotalProductPrice=Product.qty*Product.price;
           // updating in database
          auth.onAuthStateChanged(user=>{
              if(user){
                  fs.collection('Cart ' + user.uid).doc(cartProduct.ID).update(Product).then(()=>{
                      console.log('decrement');
                  })
              }
              else{
                  console.log('user is not logged in to decrement');
              }
          })
      }
  }

   // state of totalProducts
   const [totalProducts, setTotalProducts]=useState(0);
   // getting cart products   
   useEffect(()=>{        
       auth.onAuthStateChanged(user=>{
           if(user){
               fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{
                   const qty = snapshot.docs.length;
                   setTotalProducts(qty);
               })
           }
       })       
   },[])
   

   // charging payment
   const navigate = useNavigate();
   const handleToken = async(token)=>{
       console.log(token);
       const uid = auth.currentUser.uid;
             const carts = await fs.collection('Cart ' + uid).get();
             for(var snap of carts.docs){
               console.log(snap.data().id);
               cartErase(snap.data().id);

                 fs.collection('Cart ' + uid).doc(snap.id).delete();
             }
   }
 
  return (
      <>
          <Navbar user={user} totalProducts={totalProducts} />           
          <br></br>
          {cartProducts.length > 0 && (
              <div className='container-fluid'>
                  <h1 className='text-center'>Cart</h1>
                  <div className='products-box'>
                      <CartProducts cartProducts={cartProducts}
                         cartProductIncrease={cartProductIncrease}
                         cartProductDecrease={cartProductDecrease}
                      />
                  </div>
                  <div className='summary-box'>
                      <h5>Cart Summary</h5>
                      <br></br>
                      <div>
                      Total No of Products: <span>{totalQty}</span>
                      </div>
                      <div>
                      Total Price to Pay: <span>Rs. {totalPrice}</span>
                      </div>
                      <br></br>
                      <button className="button-wide" onClick={
                        handleToken
                      }>Checkout</button>

                      
            <StripeCheckout
              stripeKey="pk_test_51KrKMVSEH1CJ35WzdAR34XIvo238oObJ4iqnNSEWPCIDQ9UL4vwcP8JkDz4vJ289laJBZmeT49iNK9LEXCWhNFKI00jgXNJEIS"
              token={handleToken}
              billingAddress
              shippingAddress
              name="All Products"
              amount={totalPrice * 100}
            ></StripeCheckout> 
          </div>
        </div>
      )}
      {cartProducts.length < 1 && (
        <div className="container-fluid">No products to show</div>
      )}
    </>
  );
};
