import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt=""  className='footerImg'/>
            <p>Authentic Italian Flavors, Perfectly Wood-Fired with Rich Sauces and Irresistible Tastes – Ilcibo Pizzeria 🍕</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
     
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>7837503116</li>
                <li>thevasudevkapoor@gmail.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2021 © Ilcibo Pizzeria - All Right Reserved.</p>
    </div>
  )
}

export default Footer
