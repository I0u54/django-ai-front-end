import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import mp from '../assets/sound.m4a'

export default function Main() {
    let [data, setData] = useState([{ role: "chat", content: "Hello, I'm Isou AI. How may I assist you today?" }])
    let inputRef = useRef(null)
    let [loading,setLoading] = useState(false)
    let [counter,setCounter] = useState(0)

    let audioRef = useRef(null)
    let chatContainerRef = useRef(null);
    let [status,setStatus] = useState(true)
    
    const sendMessage = async ()=>{
        
        setLoading(true)
        let pr = inputRef.current.value;
        setData([...data,{role:'user',content:pr}])
        inputRef.current.value = ''

        
        await axios.post('http://127.0.0.1:8000/api/main',{prompt:pr},  { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res)=>{
            setData(prevData => [...prevData, res.data.data])
            setLoading(false)

        }).catch((err)=>{
            setData(prevData => [...prevData, {role:"chat",content:" Apologies for any inconvenience caused. Please try again later."}])
            setLoading(false)
        })

       

    }
    const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      sendMessage();
    }}

    useEffect(() => {
       
        if(!status){
            audioRef.current.play()
        }
        setStatus(false)
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;

      }, [data]);
    

    return (
        <div className="mainChat">
            <audio ref = {audioRef}src={mp}></audio>
            <div className="chat" ref={chatContainerRef}>
              {data.map((d) => (
                    d.role == "user" ?
                        <motion.div initial={{opacity:0,y:200}} animate={{opacity:1,y:0}} transition={{duration:0.288}}  className="message flx-end">
                            <div>
                                <p>{d.content}</p>

                            </div>


                            <img
                                src={"https://api.dicebear.com/7.x/adventurer/svg?seed="+counter}
                                alt="avatar"
                                className="ml"
                                style={{ width: "53px" }}

                            />


                        </motion.div> : <motion.div initial={{opacity:0,y:-200}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="message">


                            <img
                                src="https://api.dicebear.com/7.x/bottts/svg?seed=chat"

                                alt="avatar"
                                className="mr"


                            />
                            <div>
                                <p>{d.content}</p>

                            </div>

                        </motion.div>))}
            </div>
            <div className="promptInput">
                <img
                   src =  {"https://api.dicebear.com/7.x/adventurer/svg?seed="+counter}
                    alt="avatar"

                    style={{ width: "55px" ,cursor:"pointer"}}
                    onClick={()=>{setCounter(counter+1)}}
                   

                />


                <input type="text" placeholder="Enter a Prompt ..." ref={inputRef} onKeyDown={handleKeyDown} />
                {loading ? <div class="spinner"></div> : <i className="bi bi-send-fill" onClick={() => { sendMessage(); }}></i> }




            </div>

        </div >

    )
}