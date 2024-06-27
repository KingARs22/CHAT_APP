import React from 'react'

const Input = ({
    label='',
    name='',
    type='text',
    className="",
    isRequired=true,
    placeholder='',
    value='',
    onChange=()=>{},
}) => {
  return (
    <div>
        <label htmlFor={name} className='block mt-2 pl-2 mb-0.8 text-sm font-medium text-gray-700 dark:text-gray-300'>{label}</label>
        <input type={type} id={name} className={`text-sm border border-gray-700 w-full rounded-lg block p-2.5 ${className}`} placeholder={placeholder} required={isRequired} value={value} onChange={onChange}/>
    </div>
  )
}

export default Input