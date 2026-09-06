import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('Shraddhanjali_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Add global state for cart drawer visibility
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('Shraddhanjali_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (event) => {
        // Check if event is already in cart
        const exists = cart.find((item) => item.id === event.id);
        if (exists) {
            toast.error(`${event.name} is already in the cart!`, {
                duration: 2000,
                style: {
                    background: '#23253b',
                    color: '#fff',
                    border: '1px solid rgba(255, 77, 77, 0.4)',
                    fontSize: '14px',
                    padding: '12px 16px',
                    maxWidth: '85vw'
                },
                iconTheme: {
                    primary: '#ff4d4d',
                    secondary: '#fff'
                }
            });
            return;
        }

        setCart([...cart, event]);
        toast.success(`${event.name} added! Go to cart to checkout →`, {
            duration: 2500,
            style: {
                background: '#23253b',
                color: '#fff',
                border: '1px solid rgba(123, 97, 255, 0.4)',
                fontSize: '14px',
                padding: '12px 16px',
                maxWidth: '85vw'
            },
            iconTheme: {
                primary: '#7b61ff',
                secondary: '#fff'
            }
        });
    };

    const removeFromCart = (eventId) => {
        setCart(cart.filter((item) => item.id !== eventId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const isItemInCart = (eventId) => {
        return cart.some((item) => item.id === eventId);
    };

    const value = {
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isItemInCart,
        isCartOpen,
        setIsCartOpen
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
