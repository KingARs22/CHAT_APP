import React from 'react'

const Button = ({
    label='Button',
    type='button',
    className='',
    disable=false,

}) => {
  return (
    <button type={type} className='text-white bg-primary rounded-lg text-center mt-10 p-2.5 w-1/6 font-medium hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300'>{label}</button> 
  )
}

export default Button