import React from 'react'
import { FloatingWhatsApp as FlWhatsApp } from 'react-floating-whatsapp'
import './FloatingWhatsapp.css'

const FloatingWhatsapp = () => {
  return (
    <div>
      <FlWhatsApp
        phoneNumber="+916377443324"
        accountName="Marwar Store"
        statusMessage="This is Marwar Store"
        chatMessage={
          <>
            Hello there! 🤝 <br />
            How can we help you?
          </>
        }
        placeholder="Type your message here.."
        darkMode={true}
        className='floating-wtsapp-wrapper'
        allowClickAway={true}
        allowEsc={true}
        notification={true}
        notificationDelay={5}
      />
    </div>
  )
}

export default FloatingWhatsapp