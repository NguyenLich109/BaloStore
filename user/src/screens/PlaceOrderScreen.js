import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearFromCart, listCart } from '../Redux/Actions/cartActions';
import { createOrder } from '../Redux/Actions/OrderActions';
import { ORDER_CREATE_RESET } from '../Redux/Constants/OrderConstants';
import Header from './../components/Header';
import Message from './../components/LoadingError/Error';
import PayModal from '../components/Modal/PayModal';
import { toast } from 'react-toastify';
import Loading from '../components/LoadingError/Loading';
import Toast from '../components/LoadingError/Toast';
import { getUserDetails } from '../Redux/Actions/userActions';

const Toastobjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
};

const PlaceOrderScreen = ({ history }) => {
    // window.scrollTo(0, 0);
    const dispatch = useDispatch();
    // const userDetails = useSelector((state) => state.userDetails);
    // const { loading, user } = userDetails;
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const currenCartItems = cartItems
        .filter((item) => {
            const findCart = item?.product?.optionColor?.find((option) => option.color === item.color);
            if (findCart?.countInStock >= item?.qty && item?.isBuy === true) {
                return true;
            }
        })
        .reduce((arr, pro) => {
            arr.push({
                name: pro.product.name,
                color: pro.color,
                qty: pro.qty,
                image: pro.product.image[0].image,
                price: pro.product.price,
                product: pro.product._id,
            });
            return arr;
        }, []);
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // Calculate Price
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(0);
    };

    cart.itemsPrice = addDecimals(
        cart.cartItems
            .filter((item) => {
                const findCart = item?.product?.optionColor?.find((option) => option.color === item.color);
                if (findCart?.countInStock >= item?.qty && item?.isBuy === true) {
                    return true;
                }
            })
            .reduce((a, i) => a + i.qty * i.product.price, 0)
            .toFixed(0),
    );
    cart.shippingPrice = addDecimals(cart.itemsPrice > 0 ? (cart.itemsPrice > 100 ? 30000 : 20) : 0);
    cart.taxPrice = addDecimals(Number((0.05 * cart.itemsPrice).toFixed(0)));
    cart.totalPrice =
        cart?.cartItems.length > 0
            ? (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(0)
            : 0;

    const orderCreate = useSelector((state) => state.orderCreate);
    const { order, success, error } = orderCreate;
    useEffect(() => {
        if (error) {
            toast.error(error, Toastobjects);
            dispatch({ type: ORDER_CREATE_RESET });
        }
    }, [error]);
    useEffect(() => {
        dispatch(listCart());
        if (success) {
            history.push(`/order/${order._id}`);
            dispatch({ type: ORDER_CREATE_RESET });
            dispatch(clearFromCart(userInfo._id));
        }
    }, [history, dispatch, success, order, userInfo]);

    const placeOrderHandler = () => {
        //if (window.confirm("Are you sure"))
        dispatch(
            createOrder({
                orderItems: currenCartItems,
                shippingAddress: {
                    address: userInfo.address,
                    city: userInfo.city,
                    postalCode: '',
                    country: userInfo.country,
                },
                // paymentMethod: cart.paymentMethod,
                paymentMethod: 'Thanh to??n b???ng ti???n m???t',
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
                phone: userInfo.phone,
                name: userInfo.name,
                email: userInfo.email,
            }),
        );
    };

    function findCartCountInStock(item) {
        const findCart = item?.product?.optionColor?.find((option) => option.color === item.color);
        return (
            <>
                {findCart?.countInStock < item?.qty && (
                    <div className="col-md-1 col-2">
                        <span className="span" style={{ fontSize: '12px', color: 'red' }}>
                            S???n ph???m kh??ng ????? ????p ???ng b???n c???n ??i???u ch???nh l???i s??? l?????ng
                        </span>
                    </div>
                )}
                {findCart?.countInStock < item?.qty ? (
                    <div className="col-md-2 col-5">
                        <img src={`/productImage/${item.product?.image[0].image}`} alt={item.name} />
                    </div>
                ) : (
                    <div className="col-md-2 col-6">
                        <img src={`/productImage/${item.product?.image[0].image}`} alt={item.name} />
                    </div>
                )}
                {findCart?.countInStock < item?.qty ? (
                    <div className="col-md-3 col-5 d-flex align-items-center">
                        <Link to={`/products/${item.product}`}>
                            <h6>{item.product.name}</h6>
                        </Link>
                    </div>
                ) : (
                    <div className="col-md-4 col-6 d-flex align-items-center">
                        <Link to={`/products/${item.product}`}>
                            <h6>{item.product.name}</h6>
                        </Link>
                    </div>
                )}
                <div className="mt-3 mt-md-0 col-md-2 col-4  d-flex align-items-center flex-column justify-content-center ">
                    <h4 style={{ fontWeight: '600', fontSize: '16px' }}>Ph??n lo???i h??ng</h4>
                    <h6>{item?.color}</h6>
                </div>
                <div className="mt-3 mt-md-0 col-md-2 col-4  d-flex align-items-center flex-column justify-content-center ">
                    <h4 style={{ fontWeight: '600', fontSize: '16px' }}>S??? l?????ng</h4>
                    <h6>{item?.qty}</h6>
                </div>
                <div className="mt-3 mt-md-0 col-md-2 col-4 align-items-end  d-flex flex-column justify-content-center ">
                    <h4 style={{ fontWeight: '600', fontSize: '16px' }}>Gi??</h4>
                    <h6>{(item?.qty * item?.product?.price)?.toLocaleString('de-DE')}??</h6>
                </div>
            </>
        );
    }
    return (
        <>
            <Header />
            {error && <Loading />}
            <Toast />
            <div className="container">
                <PayModal
                    Title="Mua h??ng"
                    Body="B???n c?? ?????ng ?? mua hay kh??ng?"
                    HandleSubmit={placeOrderHandler}
                    Close="modal"
                ></PayModal>
                <div
                    className="row  order-detail"
                    style={{ border: '1px solid rgb(218, 216, 216)', borderRadius: '4px' }}
                >
                    <div className="col-lg-4 col-sm-4 mb-lg-4 mb-2 mb-sm-0 fix-bottom">
                        <div className="row " style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="col-lg-3 col-sm-3 mb-lg-3 center fix-bottom">
                                <div className="alert-success order-box fix-none">
                                    <i class="fas fa-user"></i>
                                </div>
                            </div>
                            <div className="col-lg-9 col-sm-9 mb-lg-9 fix-display">
                                <p>
                                    <span style={{ fontWeight: '600' }}>H??? t??n: </span>
                                    {userInfo.name}
                                </p>
                                <p>
                                    <span style={{ fontWeight: '600' }}>S??? ??i???n tho???i: </span>
                                    {userInfo.phone}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* 2 */}
                    <div className="col-lg-4 col-sm-4 mb-lg-4 mb-2 mb-sm-0 fix-bottom">
                        <div
                            className="row"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}
                        >
                            <div className="col-lg-3 col-sm-3 mb-lg-3 center fix-bottom">
                                <div className="alert-success order-box fix-none">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                            </div>
                            <div className="col-lg-9 col-sm-9 mb-lg-9">
                                <p>
                                    <span style={{ fontWeight: '600' }}>?????a ch???:</span>{' '}
                                    {`${userInfo?.city}, ${userInfo?.address}, ${userInfo?.country}`}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* 3 */}
                    <div className="col-lg-4 col-sm-4 mb-lg-4 mb-2 mb-sm-0 fix-bottom">
                        <div className="row" style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="col-lg-3 col-sm-3 mb-lg-3 center fix-bottom">
                                <div className="alert-success order-box fix-none">
                                    <i class="fab fa-paypal"></i>
                                </div>
                            </div>
                            <div className="col-lg-9 col-sm-9 mb-lg-9">
                                <p>
                                    <p>
                                        <span style={{ fontWeight: '600' }}>Ph????ng th???c:</span>{' '}
                                        {'Thanh to??n b???ng ti???n m???t'}
                                    </p>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row order-products justify-content-between">
                    <div className="col-lg-12 fix-padding cart-scroll">
                        {cart.cartItems.length === 0 ? (
                            <Message variant="alert-info mt-5">Kh??ng c?? s???n ph???m n??o ???????c ch???n</Message>
                        ) : (
                            <>
                                {cart.cartItems
                                    .filter((item) => item.isBuy == true)
                                    .map((item, index) => (
                                        <div
                                            className="order-product row"
                                            key={index}
                                            style={{ border: '1px solid rgb(218, 216, 216)', borderRadius: '4px' }}
                                        >
                                            {findCartCountInStock(item)}
                                        </div>
                                    ))}
                            </>
                        )}
                    </div>
                </div>
                <div className="row" style={{ padding: '10px 0', backgroundColor: '#fff', marginTop: '10px' }}>
                    {/* total */}
                    <div
                        className="col-lg-12 d-flex align-items-end flex-column subtotal-order"
                        style={{ border: '1px solid rgb(218, 216, 216)', borderRadius: '4px' }}
                    >
                        <table className="table fix-bottom">
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>S???n ph???m</strong>
                                    </td>
                                    <td>{Number(cart?.itemsPrice)?.toLocaleString('de-DE')}??</td>
                                    <td>
                                        <strong>Thu???</strong>
                                    </td>
                                    <td>{Number(cart?.taxPrice)?.toLocaleString('de-DE')}??</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Ph?? v???n chuy???n</strong>
                                    </td>
                                    <td>{Number(cart?.shippingPrice)?.toLocaleString('de-DE')}??</td>

                                    <td>
                                        <strong>T???ng ti???n</strong>
                                    </td>
                                    <td>{Number(cart?.totalPrice)?.toLocaleString('de-DE')}??</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div
                    className="row"
                    style={{ padding: '10px 0', backgroundColor: '#fff', marginTop: '10px', marginBottom: '30px' }}
                >
                    <div className="col-lg-12 fix-right">
                        <div style={{ fontWeight: '600', paddingRight: '10px' }}>
                            T???ng ti???n: {Number(cart.totalPrice)?.toLocaleString('de-DE')}??
                        </div>
                        {cart.cartItems.length === 0 ? null : (
                            <button
                                type="submit"
                                //onClick={placeOrderHandler}
                                // type="button"
                                class="btn btn-primary pay-button"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                                style={{ backgroundColor: '#00483d', borderColor: '#00483d' }}
                            >
                                ?????t h??ng
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlaceOrderScreen;
