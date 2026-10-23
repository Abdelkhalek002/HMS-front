import React, { useState } from 'react';
import defaultAdminPic from "../../../images/generic-avatar.jpg";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import { Tooltip } from '@mui/material';
import './admincomp.css';
import { BASE_URL } from '../../../services/http';
import AdminLogsModal from './AdminLogsModal.jsx';
import EditAdminModal from './EditAdminModal.jsx';
import usePermission from '../../../hooks/usePermission';
import { isStatusActive } from '../adminFilterUtils.js';

import {
    isSuperAdminRole,
    isCounterRole,
    isTransferRole,
    isViewerRole
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
    const [logsOpen, setLogsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const { can, isSuperAdmin, PERMISSIONS } = usePermission();
    const canReadLogs = isSuperAdmin || can(PERMISSIONS.LOGS_READ);
    const canUpdateAdmin = isSuperAdmin || can(PERMISSIONS.ADMINS_UPDATE);

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
        if (isSuperAdminRole(roleVal) || roleVal === 'SUPER_ADMIN') return 'مدير النظام';
        if (isCounterRole(roleVal) || roleVal === 'COUNTER') return 'كاونتر';
        if (isTransferRole(roleVal) || roleVal === 'TRANSFER_CLERK') return 'مسؤول التحويلات';
        if (isViewerRole(roleVal) || roleVal === 'OBSERVER') return 'ملاحظ';
        if (roleVal === 'MEDICAL_CHECK_MANAGER') return 'مسؤول الكشف الطبي';
        if (roleVal === 'MEDICAL_TESTS_MANAGER') return 'مسؤول التحاليل';
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

    const activeState = isStatusActive(isActive !== undefined ? isActive : (status !== undefined ? status : active));


    return (
        <>
            <div className='user-card'>
                <div className='user-header' style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                        <img
                            src={getImageSrc()}
                            alt={title || 'admin'}
                            loading='lazy'
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultAdminPic;
                            }}
                        />
                        <div className='det' style={{ marginRight: '10px', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                            <p className='user-name' style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</p>
                            <Tooltip title={email} placement="top" arrow>
                                <a href={`mailto:${email}`} type='email' className='user-email' style={{ fontSize: "12px", display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
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
                    </div>

                    <div className='block' style={{ display: 'flex', gap: '2px', flexShrink: 0, alignItems: 'center' }}>
                        {canUpdateAdmin && (
                            <Tooltip title="تعديل بيانات المسؤول" arrow>
                                <IconButton
                                    onClick={() => setEditOpen(true)}
                                    aria-label="edit-admin"
                                    size="small"
                                    color="primary"
                                    className="edit-icon"
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canReadLogs && (
                            <Tooltip title="عرض سجل عمليات هذا المسؤول" arrow>
                                <IconButton
                                    onClick={() => setLogsOpen(true)}
                                    aria-label="admin-logs"
                                    size="small"
                                    color="primary"
                                    className="logs-icon"
                                >
                                    <HistoryIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="حذف المسؤول" arrow>
                            <IconButton
                                onClick={handleDelete}
                                aria-label="delete"
                                size="small"
                                color='error'
                                className='delete-icon'
                            >
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

                    
                </div>
            </div>

            {/* Admin Logs Modal */}
            <AdminLogsModal
                open={logsOpen}
                onClose={() => setLogsOpen(false)}
                admin={{ id, username: title, email }}
            />
                    {/* Edit Admin Modal */}
            <EditAdminModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                admin={{ id, username: title, email, role, status, isActive: activeState, image }}
            />
        </>
    );
};

export default AdminComponent;
