import React, { useEffect, useState, useRef } from 'react'
import User from '../../assets/user-circle.svg'
import Calls from '../../assets/phone-call.svg'
import Input from '../../components/Input'
import Send from '../../assets/send.svg'
import Attach from '../../assets/circle-plus.svg'
import { json } from 'react-router-dom'
import { io } from 'socket.io-client'


const Dashboard = () => {
   


    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail'))) 
    const[conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const messageRef = useRef(null);

    useEffect(()=>{
        setSocket(io('http://localhost:8080'))
    }, [])

    useEffect(()=> {
        messageRef?.current?.scrollIntoView({behavior: 'smooth'})
    }, [messages?.messages])

    useEffect(()=>{
        socket?.emit('addUser', user?.id);
        socket?.on('getUsers', users =>{
            console.log('activeUsers :>>',users);
        })
        socket?.on('getMessage', data =>{
            //console.log('data :>>', data);
            setMessages(prev => ({
                ...prev,
                messages: [...prev.messages, {user: data.user, message: data.message}]
           }))
        })
    }, [socket])
    
    useEffect(()=>{
        const loggedInUser = JSON.parse(localStorage.getItem('user:detail'))
        const fetchConversations = async() => {
            const res = await fetch(`http://localhost:8000/api/conversations/${loggedInUser?.id}`,{
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                },
            });
            const resData = await res.json()
            setConversations(resData)
        }
        fetchConversations()
    }, [])

    useEffect(()=>{
        const fetchUsers = async() =>{
            const res = await fetch(`http://localhost:8000/api/users/${user?.id}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }   
            });
            const resData = await res.json()
            setUsers(resData)
        }
        fetchUsers()
    }, [])


    const fetchMessages = async(conversationId, receiver)=>{
        const res = await fetch(`http://localhost:8000/api/messages/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const resData = await res.json()
        setMessages({messages : resData, receiver, conversationId})
    } 

    const sendMessage= async(e) => {
        socket?.emit('sendMessage',{
            conversationId: messages?.conversationId,
            senderId: user?.id,
            message,
            receiverId: messages?.receiver?.receiverId
        });
        const res = await fetch('http://localhost:8000/api/messages',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                conversationId: messages?.conversationId,
                senderId: user?.id,
                message,
                receiverId: messages?.receiver?.receiverId
            })
        });
        setMessage('')
    }
   
  return (
    <div className='w-screen flex overflow-auto'> 
        <div className='w-[30%] h-screen shadow-md drop-shadow-lg shadow-black bg-white overflow-scroll overflow-x-hidden scrollbar-none'>
            <div className='flex justify-center items-center'>
                <img className=" my-3" src={User} width={60} height={60}/>
                <div className='ml-5'>
                    <h3 className='text-2xl font-sans font-semibold'>{user?.fullName}</h3>
                    <p className='text-lg font-sans font-thin text-center'>My account</p>
                </div>
            </div>
            <hr/>
            <div>
                <div className='mt-5 pl-4 text-secondary text-lg pb-4 border-b border-b-black'>Messages</div>
                <div>
                    {   
                        conversations.length >0 ?
                        conversations.map(({conversationId , user})=>{
                            return(
                                <div className='cursor-pointer flex border-b border-b-gray-300 hover:bg-gray-200' onClick={()=>
                                fetchMessages(conversationId, user)}>
                                <div className=' flex items-center pt-2 pb-2 pl-4'>
                                    <img src={User} width={40} height={40}/>    
                                    <div className='pl-4'>
                                        <h3 className='font-sans text-lg'>{user?.fullName}</h3>
                                        <p className='font-sans text-xs font-thin text-gray-500'>{user?.email}</p>
                                    </div>                                    
                                </div>
                                </div>
                            
                            )
                        }) : <div className='text-center text-lg font-semibold p-1'>No Conversations</div>
                    }
                    
                </div>
            </div>
        </div>
        <div className='w-[50%] h-screen bg-white flex flex-col items-center'>
            {
                messages?.receiver?.fullName &&
                <div className='w-[75%] bg-blue-200 h-[60px] rounded-full my-14 flex items-center mb-3'>
                <div className='cursor-pointer ml-3s'><img src={User} width={60} height={60}/></div>
                <div className='p-2 mr-auto'>
                    <h3 className='text-lg font-sans font-semibold'> {messages?.receiver?.fullName}</h3>
                    <p className='text-sm font-sans font-thin text-gray-700'> {messages?.receiver?.email }</p>
                </div>
                <div className='cursor-pointer m-3'><img src={Calls} width={30} height={30}/></div>
                </div>
            }
            <div className='h-[85%] border border-gray-200 w-full overflow-scroll overflow-x-hidden scrollbar-none'>
                <div className='px-10 py-10'>
                    
                    
                    {
                        messages?.messages?.length > 0 ?
                        messages.messages.map(({message, user:{ id }= {} })=>{
                            return(
                                <>
                                     <div className={`max-w-[40%] rounded-b-2xl p-3 mb-2 ${id===user?.id ? 'ml-auto bg-blue-600 rounded-tl-2xl': 'rounded-tr-2xl bg-gray-300'}`}>
                                        {message}
                                    </div>
                                    <div ref={messageRef}></div>
                                </>
                               
                            )
                                                            
                        }): <div className='text-primary text-center text-lg font-semibold'>No Messages</div>
                    }
                </div>
            </div>
            {
                messages?.receiver && 
                <div className='w-full flex justify-center items-center p-4'>
                <div className='w-full pl-4 pr-2'>
                        <Input placeholder='Type a message...' value={message} onChange={(e)=>setMessage(e.target.value)}/>
                </div>
                <div className={`bg-gray-200 pt-2 pl-1 cursor-pointer mt-1 ml-1 w-[45px] h-[40px] rounded-full ${!message && 'pointer-events-none'}`}onClick={()=> sendMessage()} >
                    <img src={Send} width={30} height={30}/>
                </div>
                <div className={`bg-gray-200 cursor-pointer pt-1 pl-1 mt-2 ml-1 w-[45px] h-[40px] rounded-full ${!message && 'pointer-events-none'}`}>
                    <img src={Attach} width={30} height={30}/>
                </div>

            </div>
            }
           
            
            
           
        </div>
        <div className='w-[20%] h-screen px-4 py-8 overflow-scroll overflow-x-hidden scrollbar-none'>
            <div className='font-semibold text-blue-800'>People</div>
            <div>
                    {   
                        users.length >0 ?
                        users.map(({userId , user})=>{
                            return(
                                <div className='cursor-pointer flex border-b border-b-gray-300 hover:bg-gray-200' onClick={()=>
                                fetchMessages('new', user)}>
                                <div className=' flex items-center pt-2 pb-2 pl-4'>
                                    <img src={User} width={40} height={40}/>    
                                    <div className='pl-4'>
                                        <h3 className='font-sans text-lg'>{user?.fullName}</h3>
                                        <p className='font-sans text-xs font-thin text-gray-500'>{user?.email}</p>
                                    </div>                                    
                                </div>
                                </div>
                            
                            )
                        }) : <div className='text-center text-lg font-semibold p-1'>No Conversations</div>
                    }
                    
                </div>
        </div>
    </div>
  )
}

export default Dashboard