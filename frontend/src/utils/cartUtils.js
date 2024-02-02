export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, items) => acc + items.price * items.qty, 0)
  );
  state.shippingPrice = addDecimals(state.itemsPrice > 200 ? 100 : 40);
  state.totalPrice = (
    Number(state.itemsPrice) + Number(state.shippingPrice)
  ).toFixed(2);
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
