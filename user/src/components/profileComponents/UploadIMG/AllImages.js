import axios from 'axios';
import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';
import styles from './Form.module.scss';

const cx = classNames.bind(styles)
function AllImages() {
    const [img, setImg] = useState([]);
    const getImage = async () => {
     const data = await axios.get("http://localhost:5000/api/ali")
     console.log(data, "đây là data")
        setImg(data.data)
    } 
    useEffect(()=> {
        getImage()
    }, [])
    return (
        <div className={cx('image-card-container')}>
            {
                img?.map(item => (
                    <div key={item._id} className={cx("image-card")}> 
                    <h4 className={cx("image-title")}>{item.title}</h4>
                    <img
                    className={cx("main-image")}
                    src={item.image}
                    alt="this is a terrible description"
                    />
                </div>
                ))

            }
        </div>
    )
}
export default AllImages;