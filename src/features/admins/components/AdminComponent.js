import React from 'react';
import defaultAdminPic from "../../../images/generic-avatar.jpg";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';
import './admincomp.css';
import { BASE_URL } from '../../../services/http';

import {
    isSuperAdminRole,
    isSecondSuperAdminRole,
    isCounterRole,
    isTransferRole,
    isViewerRole,
    isMedicalCheckManagerRole,
    isExternalHospitalAdminRole
} from '../../../ActorType';

const AdminComponent = ({
    id,
    title,
    email,
    date,
    status,
    image,
    active,
    blocked,
    role,
    isActive,
    isConfirmed,
    handleDelete,
    handleBlock,
    handleUnblock
}) => {
    const getImageSrc = () => {
        if (!image) return defaultAdminPic;
        if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('blob:') || image.startsWith('data:'))) {
            return image;
        }
        const cleanPath = typeof image === 'string' && image.startsWith('/') ? image.substring(1) : image;
        if (cleanPath.startsWith('uploads/')) {
            return `${BASE_URL}/${cleanPath}`;
        }
        if (cleanPath.startsWith('admins/')) {
            return `${BASE_URL}/uploads/${cleanPath}`;
        }
        return `${BASE_URL}/uploads/admins/${cleanPath}`;
    };

    const getRoleName = (roleVal) => {
        if (isSuperAdminRole(roleVal)) return 'مدير النظام';
        if (isSecondSuperAdminRole(roleVal)) return 'مدير ثان';
        if (isCounterRole(roleVal)) return 'كاونتر';
        if (isTransferRole(roleVal)) return 'مسؤول التحويلات';
        if (isMedicalCheckManagerRole(roleVal)) return 'مسؤول الكشف الطبي';
        if (isExternalHospitalAdminRole(roleVal)) return 'أدمن مستشفي خارجي';
        if (isViewerRole(roleVal)) return 'ملاحظ';
        return roleVal || 'مسؤول';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch {
            return dateStr;
        }
    };

    const activeState = isActive !== undefined
        ? Boolean(isActive)
        : (status === 1 || status === true || active === 1 || active === true);

    const confirmedState = isConfirmed !== undefined ? Boolean(isConfirmed) : null;

    return <> <div className='user-card'>
        <div className='user-header'>
            <img
                src={getImageSrc()}
                alt={title || 'admin'}
                loading='lazy'
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAdminPic;
                }}
            />
            <div className='det'>
                <p className='user-name'>{title}</p>
                <Tooltip title={email} placement="top" arrow>
                    <a href={`mailto:${email}`} type='email' className='user-email' style={{ fontSize: "12px" }}>
                        {email}
                    </a>
                </Tooltip>
                {role && (
                    <div>
                        <span className='admin-role-badge'>{getRoleName(role)}</span>
                    </div>
                )}
                {blocked ? (
                    <p className='user-blocked' style={{
                        color: "red", fontSize: "13px", fontWeight: "bold"
                    }}>محظور</p>
                ) : null}
            </div>

            <div className='block'>
                <Tooltip title="حذف المسؤول" arrow>
                    <IconButton onClick={handleDelete} aria-label="delete" size="small" color='error' style={{ marginRight: "20px" }} className='delete-icon'>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </div>

        <div className='user-status'>
            <div className='user-status-row'>
                <p className='user-status-f'>تاريخ الإنشاء</p>
                <p className='user-status-v'>{formatDate(date)}</p>
            </div>

            <div className='user-status-row'>
                <p className='user-status-f'>الحالة </p>
                <p className={`user-status ${activeState ? 'user-active' : 'user-inactive'}`} >{activeState ? 'نشط' : "غير نشط"}</p>
            </div>

            {confirmedState !== null && (
                <div className='user-status-row'>
                    <p className='user-status-f'>التأكيد </p>
                    <p className={`user-status ${confirmedState ? 'user-active' : 'user-inactive'}`} >{confirmedState ? 'مؤكد' : "غير مؤكد"}</p>
                </div>
            )}
        </div>
    </div>
    </>;
}



export default AdminComponent;
