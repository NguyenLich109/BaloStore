import React, { useEffect} from 'react'; //useState
import { useDispatch, useSelector } from 'react-redux';
import { Link} from 'react-router-dom'; // useHistory
import { ListCategory } from '../Redux/Actions/categoryActions';
// import { listProduct } from '../Redux/Actions/ProductActions';

export default function NavBar({ onRemove }) {
    const dispatch = useDispatch();

    const lcategories = useSelector((state) => state.CategoryList);
    const { categories } = lcategories;

    useEffect(() => {
        dispatch(ListCategory());
    }, ['']); // ,[]
    return (
        <>
            {/* Pc-navbar */}

            <div className="navbar-menu">
                <ul className="navbar-list">
                    {categories.map((category) => (
                        <li className="navbar-list__li">
                            <Link to={`/category/${category._id}`}>{category.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            {/* tablet-mobile modal */}
            <div className="navbar-tablet">
                <div className="modal-tablet"></div>
                <div className="modal-nav">
                    <div className="modal-nav__img">
                        <img src="/images/logo.png" alt='logo'></img>
                    </div>
                    <ul className="modal-nav__list">
                        {categories.map((category) => (
                            <li className="navbar-list__li">
                                <label>{category.name}</label>
                            </li>
                        ))}
                    </ul>
                    <div className="modal-icon" onClick={onRemove}>
                        <i className="fas fa-times-circle"></i>
                    </div>
                </div>
            </div>
        </>
    );
}
