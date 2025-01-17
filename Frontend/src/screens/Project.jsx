import React, { useState,useEffect,useContext,useRef} from 'react'
import { useLocation  } from 'react-router-dom'
import { initializeSocket , receiveMessage , sendMessage } from '../config/socket.js'
import { userContext } from '../context/User.context.jsx'
import Markdown from 'markdown-to-jsx'
import axios from '../config/axios'
// import hljs from 'highlight.js';

function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}

const Project = () => {
    const location = useLocation()
    // const ref = useRef()

    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ selectedUserId, setSelectedUserId ] = useState(new Set()) // Initialized as Set
    const [ project, setProject ] = useState(location.state.project)
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [users, setUsers ] = useState([])
    const [message, setMessage] = useState('')
    const { user } = useContext(userContext)
    const messageBox = React.createRef()
    const [ messages, setMessages ] = useState([])
    const [currentFile, setCurrentFile] = useState(null)
    const [openFiles, setOpenFiles] = useState([])
    const [fileTree, setFileTree] = useState({ })



    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });


    }

    function addCollaborators() {

        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            
            setIsModalOpen(false)

        }).catch(err => {
            console.log(err)
        })

    }

    function send (){
        
        sendMessage('project-message' ,{
            message,
            sender: user,
        })
        setMessages(prevMessages => [ ...prevMessages, { sender: user, message } ]) // Update messages state
        // appendOutgoingMessage(message)
        setMessage(" ")
    }

    
    function WriteAiMessage(message) {

        const messageObject = JSON.parse(message)

        return (
            <div
                className='overflow-auto bg-slate-950 text-white rounded-sm p-2'
            >
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }



    useEffect(() => {

        initializeSocket(project._id)
        receiveMessage('project-message',data =>{
            const message = JSON.parse(data.message)
            if(message.fileTree){
                setFileTree(message.fileTree)
            }
        setMessages(prevMessages => [ ...prevMessages, data ]) 
            // appendIncomingMessage(data)
        })
        

        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {

            setProject(res.data.project)
            
        })

        axios.get('/users/all').then(res => {

            setUsers(res.data.users)
            console.log(res.data.users)

        }).catch(err => {

            console.log(err)

        })

    }, [])

    // function appendIncomingMessage (messageObject){
    //     const messageBox = document.querySelector('.message-box') 
    //     const newMessage = document.createElement('div')
    //     newMessage.classList.add('message' , 'max-w-56' ,'flex', 'flex-col','p-2','bg-slate-300')
    //     newMessage.innerHTML = `<small class = 'opacity-65 , text-xs'>${messageObject.sender.email} </small>
    //     <p class ='text-sm'>${messageObject.message}</p>`
    //     messageBox.appendChild(newMessage)
    //     scrollToBottom ()
    // }
    // function appendOutgoingMessage (){
    //     const messageBox = document.querySelector('.message-box')
    //     const newMessage = document.createElement('div')
    //     newMessage.classList.add('ml-auto','message','flex','flex-col','max-w-56','p-2','bg-slate-300')
    //     newMessage.innerHTML=`<small class = 'opacity-65 text-xs'>${user.email}</small>
    //         <p class="text-sm">${message}</p>`
        
    //     messageBox.appendChild(newMessage)
    //     scrollToBottom ()
    // }
    // function scrollToBottom() {
    //     messageBox.current.scrollTop = messageBox.current.scrollHeight
    // }
    // setOpenFiles(...new Ser([...openFiles , currentFile]))
    // openFile
    
    return (
    <main className='h-screen w-screen flex'>

        <section className='left relative h-full flex flex-col  bg-slate-300  min-w-96'>
            <header className='flex justify-between items-center p-2 px-4 bg-slate-100 w-full absolute z-10 top-0'>
            <button className='flex gap-2 ' onClick={() => setIsModalOpen(true)}>
            <i className="ri-user-add-line mr-1"></i>
            <p className=''> Add collaborator</p>
            </button>

            <button className=' p-2 hover:bg-red-100'
            onClick={()=> setIsSidePanelOpen(!isSidePanelOpen)}>
            <i className="ri-group-fill"></i>
            </button>

            </header>

            <div className='conversation-area h-full relative pt-14 pb-10 flex flex-grow flex-col'>  
            <div
                        ref={messageBox}
                        className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide">
                        {messages.map((msg, index) => (

                            <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} 
                            ${msg.sender._id == user._id.toString() && 'ml-auto'}  message flex flex-col p-2
                            bg-slate-50 w-fit rounded-md`}>

                                <small className='opacity-65 text-xs'>{msg.sender.email}</small>

                                <div className='text-sm'>
                                    {msg.sender._id === 'ai' ?
                                    WriteAiMessage(msg.message)
                                    : <p>{msg.message}</p>}
                                </div>

                            </div>
                        ))}
                    </div>

                <div className='inputField absolute bottom-0 w-full flex    '>

                    <input type='text'
                    value ={message}
                    onChange={ (e)=>setMessage(e.target.value) }
                    className='px-2 py-2 border-none outline-none rounded-md flex-grow'
                    placeholder='Enter message here !'/>

                    <button onClick={send} 
                    className='px-5 '><i className="ri-send-plane-fill"></i></button>
                </div>
            </div>

        <div className={`${isSidePanelOpen ? '-translate-x-0': '-translate-x-full'} transition-all  absolute flex flex-col h-full w-full gap-2 top-0  bg-black  `}>
            <header className='flex justify-between p-2 bg-slate-300'>
                <h1 className='font-semibold text-lg'>Collaborators</h1>
                <button className='px-2' onClick={()=> setIsSidePanelOpen(!isSidePanelOpen)}><i className="ri-close-large-line"></i></button>
            </header>

                <div className="users  flex flex-col  gap-2  bg-slate-400">
                {project.users && project.users.map(user => {
            return (
                <div   className="user cursor-pointer hover:bg-slate-200  flex gap-2 items-center">
                        <div className=' w-fit h-fit flex items-center justify-center p-3'>
                        <i className="ri-user-line"></i>
                        </div>
                    <h1 className='font-semibold text-lg ml-2'>{user.email}</h1>
                </div>
            ) 
            
            
            })}
            </div>
        </div>
        </section>

        <section className='right flex bg-red-50 flex-grow h-full'>
            <div className="explorer  bg-slate-200 flex-col h-full max-w-64 min-w-52
            ">
            <div className="file-tree w-full">
                {
                    Object.keys(fileTree).map((file,index)=>(
                        <button 
                        key={index} 
                        onClick={()=>{
                            setCurrentFile(file)
                            setOpenFiles([... new Set([...openFiles , file])])
                        }}
                        className="tree-element w-full p-2 px-4  cursor-pointer items-center gap-2 bg-slate-300">
                        <p className='font-semibold  text-lg'>{file}</p>
                    </button>
                    ))
                }
            </div>
            </div>
                {
                    currentFile &&(
                        <div className="code-editor flex flex-col flex-grow h-full shrink">

                        <div className="top flex justify-between w-full">
    
                            <div className="files flex">
                                {
                                    openFiles.map((file, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentFile(file)}
                                            className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''}`}>
                                            <p
                                                className='font-semibold text-lg'
                                            >{file}</p>
                                        </button>
                                    ))
                                }
                            </div>

                                </div>


                            <div className="bottom flex flex-grow w-full">
            {
                fileTree[currentFile] && (
                    <textarea
                        value ={fileTree[currentFile].contents}
                        onChange={
                            (e)=>{
                                setFileTree({
                                    ...fileTree,
                                    [currentFile] : {
                                        contents :e.target.value
                                    }
                                })
                            }
                        }
                        className='w-full h-full p-4 outline-none bg-black text-white'>
                    </textarea>
                )
            }
                            </div>
                        </div>
                    )
                }
        </section>

        {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {users.map(user => (

                                <div key={user.id} className={`user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center
                                ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ""}`}
                                onClick={() => handleUserClick(user._id)}>

                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user.email}</h1>
                                </div>

                            ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}
    </main>
    ) 
}

export default Project
