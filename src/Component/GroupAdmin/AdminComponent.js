import React from 'react'
import userPic from "./../../images/userProfile.jpg";
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';
import './admincomp.css' ;
import { Block, RemoveCircleOutlineRounded } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../RTK/Auth/AuthSlice.js';


const AdminComponent = ({ id, title, email, date, status, image, active, blocked, handleDelete, handleBlock, handleUnblock }) => {

    const dispatch = useDispatch();

    const { token, payLoad } = useSelector(getUserInfo);



    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        height: 150,
        boxShadow: 24,
        p: 2,
        borderRadius: 2
    };

    return <> <div className='user-card'>
        <div className='user-header'>
            <img src={userPic} alt='head' loading='lazy' />
            <div className='det'>
                <p className='user-name'>{title}</p>
                <Tooltip title={email} placement="top" arrow>
                    <a href={`mailto:${email}`} type='email' className='user-email' style={{ fontSize: "12px"}}>
                        {email}
                    </a>
                </Tooltip>
                {blocked ? (
                    <p className='user-blocked' style={{
                        color: "red", fontSize: "13px", fontWeight: "bold"
                    }}>محظور</p>
                ) : (null)}
            </div>

            <div className='block'>
                <Tooltip title="حذف المستخدم" arrow>
                    <IconButton onClick={handleDelete} aria-label="delete" size="small" color='error' style={{ marginRight: "20px" }} className='delete-icon'>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>

            </div>
        </div>

        <div className='user-status'>
            <div className='user-status-row'>
                <p className='user-status-f'>تاريخ الانشاء</p>
                <p className='user-status-v'>{date}</p>
            </div>

            <div className='user-status-row'>
                <p className='user-status-f'>الحالة </p>
                <p className={`user-status ${status === 1 ? 'user-active' : 'user-inactive'} `} >{status === 1 ? 'نشط' : "غير نشط"}</p>
            </div>
        </div>

        <div className='circle'>
            <Link className='circle-link' to={`/profile/${id}`}>
                <Tooltip className='tooltip' title="المزيد" arrow placement='right'>
<div className='double-arrow'>
                    <span className="material-symbols-outlined">
                        <span class="material-symbols-outlined">
                            keyboard_double_arrow_down
                        </span>
                    </span>
                    </div>
                </Tooltip>
            </Link>
        </div>
    </div>
    </>;
}



export default AdminComponent;
