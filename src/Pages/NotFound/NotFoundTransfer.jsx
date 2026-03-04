import React from 'react'
import { Helmet } from 'react-helmet'
import notFound from '../../images/notfound.jpg'
import { Button } from '@mui/material'
import './NotFound.module.css'
import { useNavigate } from 'react-router-dom'


export default function NotFoundTransfer() {

  // For Navigation To another page 
  const navigate = useNavigate() ; 

  // Return Home Function
  const returnHome = ()=>{
    navigate(`/tr`) ;  
  }

  return <>
    <Helmet>
      <title>NotFound</title>
      <meta name="description" content="Helmet application" />
    </Helmet>
    <div className="err-img" style={{display:"flex",justifyContent:"center", marginTop:"30px" }}>
      <img src={notFound} alt="notFound"  style={{height:"600px",width:"600px"}}/>
    </div>
    <div style={{display : "flex" , justifyContent : "center " , alignItems : "center"}}><Button onClick={returnHome} className='notfound-btn'  variant='contained' >  عودة للصفحة الرئسية <i style={{marginRight :"10px"}} className="fa-solid fa-arrow-left"></i> </Button></div>

    </>
}
