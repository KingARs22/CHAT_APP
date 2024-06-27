import React, { useState } from 'react';
import Input from '../../components/Input/index.js';
import Button from "../../components/Button/index.js";
import { useNavigate } from 'react-router-dom';

const Form = ({ isSignInPage = false }) => {
    const [data, setData] = useState({
        ...(!isSignInPage && {
            fullName: ''
        }),
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('data :>>', data);
       
            const res = await fetch(`http://localhost:8000/api/${isSignInPage ? 'login' : 'register'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if(res.status==400){
                alert('Invalid credentials')
            }else{
                const resData = await res.json();
                if(resData.token){
                    localStorage.setItem('user:token', resData.token)
                    localStorage.setItem('user:detail',JSON.stringify(resData.user));
                    navigate('/')
                }
            }
            
        
    }

    return (
        <div className='flex items-center justify-center bg-gray-50 h-screen'>
            <div className='bg-white w-[500px] h-[600px] shadow-lg drop-shadow-lg rounded-lg flex flex-col justify-center items-center'>
                <div className="text-4xl font-sans font-extrabold">Welcome {isSignInPage && 'Back'}</div>
                <div className="text-xl font-sans mb-10">{isSignInPage ? "Sign in to continue" : "Sign up now to get started"}</div>
                <form className='flex flex-col items-center w-full' onSubmit={handleSubmit}>
                    {!isSignInPage && (
                        <Input
                            className='w-full mb-4'
                            label='Full Name'
                            name="fullName"
                            placeholder='Full Name'
                            value={data.fullName}
                            onChange={(e) => setData({ ...data, fullName: e.target.value })}
                        />
                    )}
                    <Input
                        label='Email Address'
                        name="email"
                        className='w-full mb-4'
                        type='email'
                        placeholder='E-Mail'
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                    />
                    <Input
                        label='Password'
                        name="password"
                        className='w-full mb-4'
                        type='password'
                        placeholder='Password'
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                    />
                    <Button className='w-full' label={isSignInPage ? 'Sign in' : 'Sign Up'} type='submit' />
                </form>
                <div className='mt-2'>
                    {isSignInPage ? "Don't have an account? " : "Already have an account? "}
                    <span
                        className='text-primary cursor-pointer underline hover:text-blue-600'
                        onClick={() => navigate(`/users/${isSignInPage ? 'sign_up' : 'sign_in'}`)}
                    >
                        {isSignInPage ? 'Sign up' : 'Sign in'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Form;
