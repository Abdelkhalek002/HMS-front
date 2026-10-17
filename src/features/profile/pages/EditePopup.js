import React from 'react'
import "../../../layouts/Popup.css"
import { Button, MenuItem, Select, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../../../RTK/User/UserSlice'
import { getAllLevels } from '../../../RTK/Level/LevelSlice'

const EditePopup = () => {
    const profileInfo = useSelector(getUserProfile);
    const userLoad = useSelector(state => state.UserSlice.load)

    // For Dispatch Action 
    const dispatch = useDispatch();

    // For Get All Level
    const { data, load } = useSelector(state => state.LevelSlice)

    console.log(load);

    const [level, setLevel] = React.useState('');

    const handleChange = (event) => {
        console.log(event.target.value)
        setLevel(event.target.value);
    };

    return (
        <div className='main-popup'>

            <h2 className='popup-title'>تعديل البيانات</h2>

            <div className='popup-all-filed'>
                <div className='row'>
                    <label>الاسم</label>
                    <TextField defaultValue={profileInfo.userName} className='popup-field' id="outlined-basic" variant="outlined" />
                </div>

                <div className='row'>
                    <label>الرقم القومي</label>
                    <TextField defaultValue={!userLoad ? profileInfo.national_id : ""} className='popup-field' id="outlined-basic" variant="outlined" />
                </div>

                <div className='row'>
                    <label>الموبايل</label>
                    <TextField defaultValue={!userLoad ? profileInfo.phoneNumber : ""} className='popup-field' id="outlined-basic" variant="outlined" />
                </div>

                <div className='row'>
                    <label>الفرقة</label>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={level}
                        onChange={handleChange}
                    >
                        {
                            !load ? data.map((item) => {
                                return <MenuItem value={item.level_id}>{item.levelName}</MenuItem>
                            }) : ""
                        }

                    </Select>
                </div>

            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Button variant="contained" className='popup-btn'>حفظ</Button>
            </div>

        </div>
    )
}

export default EditePopup
