import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import { listCart, saveShippingAddress } from '../Redux/Actions/cartActions';
import { listMyOrders, orderGetAddress } from '../Redux/Actions/OrderActions';
import { getUserDetails, updateUserProfile } from '../Redux/Actions/userActions';
import { ORDER_ADDRESS_MY_RESET } from '../Redux/Constants/OrderConstants';
import { USER_UPDATE_PROFILE_RESET } from '../Redux/Constants/UserContants';
import Message from './../components/LoadingError/Error';
import { toast } from 'react-toastify';
import Toast from '../components/LoadingError/Toast';
import Loading from '../components/LoadingError/Loading';

const Toastobjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
};
const ShippingScreen = ({ history }) => {
    // window.scrollTo(0, 0);
    const dispatch = useDispatch();
    const UpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { success: updatesuccess, error: updateError, loading: updateLoading } = UpdateProfile;

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [image, setImage] = useState('');
    const [retult, setRetult] = useState('');

    useEffect(() => {
        if (updatesuccess) {
            dispatch({ type: USER_UPDATE_PROFILE_RESET });
            history.push('/payment');
        }
    }, [updatesuccess]);
    useEffect(() => {
        if (updateError === 'account lock up') {
            toast.error('Tài khoản của bạn đã bị khóa', Toastobjects);
            dispatch({ type: USER_UPDATE_PROFILE_RESET });
        }
    }, [dispatch, updateError]);
    useEffect(() => {
        dispatch(getUserDetails('profile'));
    }, []);
    useEffect(() => {
        if (user.address != undefined) {
            setAddress(user.address);
            setCity(user.city);
            setCountry(user.country);
            setImage(user.image);
        }
    }, [dispatch, user]);

    const valitor = (values) => {
        const { address, city, country } = values;
        if (address === '' || city === '' || country === '') {
            setRetult('Vui lòng nhập đầy đủ thông tin');
        } else return true;
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!valitor({ address, city, country })) return;
        dispatch(saveShippingAddress({ address, city, country }));
        dispatch(updateUserProfile({ id: user._id, address, city, country, image }));
        setRetult('');
    };
    return (
        <>
            <Header />
            <Toast />
            {updateLoading && <Loading />}
            <div className="container d-flex justify-content-center align-items-center login-center">
                <form className="Login col-md-8 col-lg-4 col-11" onSubmit={submitHandler}>
                    {retult !== '' && <Message variant="alert-danger text-center fs-6">{retult}</Message>}
                    <h4>Địa chỉ giao hàng</h4>
                    <input
                        type="text"
                        placeholder="Đường/Hẹp - Thôn/Phường"
                        value={address}
                        // required
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Xã - Huyện/Quận"
                        value={city}
                        // required
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Tỉnh/Thành phố"
                        value={country}
                        // required
                        onChange={(e) => setCountry(e.target.value)}
                    />
                    <button type="submit">Tiếp tục</button>
                </form>
            </div>
        </>
    );
};

export default ShippingScreen;
