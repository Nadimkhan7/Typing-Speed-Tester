import { useEffect, useRef, useState } from 'react'
import './App.css'
import sentences  from '../textData';

function App() {
 console.log("my app is running");
 console.log(sentences)
  const [input,SetInput]=useState("");
  const [startTime,SetStartTime]=useState(null);
  const [endTime,SetEndTime]=useState(null);
  const [result,SetResult]=useState(null);
  const [resultHistory,SetResultHistory]=useState([]);
  const [timer,SetTimer]=useState(60);
  const [Text,SetText]=useState("");
  const inputRef=useRef(null);
  const [a,SetA]=useState(1);
  const [clear,SetClear]=useState(false);

  const [eligible,setEligible]=useState(false);
  
  // console.log("timer",timer);
  // console.log("sentencePart",sentences[key][3]);

  //This function will run when we start our page

 const resetTest=(nextA = a)=>{
  console.log("resetTest function is running");
  // console.log("a",a)
    let key=`one${nextA}`;
 
    const random=sentences[key][Math.floor(Math.random()* sentences[key].length)];
    console.log("random",random);
    SetText(random);
    SetInput("");
    SetStartTime(null);
    SetEndTime(null);
    SetTimer(60);
    SetResult(null);
    inputRef.current.focus();
 }

  useEffect(()=>{
    resetTest();
  },[])

  useEffect(()=>{
    console.log("our useeffect is running")
   let interval;
   if(startTime && !endTime && timer>0){
     interval=setInterval(()=>{ 
       SetTimer(prev=> prev-1);
       console.log("timer",timer)
       },1000)
     
   }

   if(timer==0 && !result){
    calculateResult(startTime,new Date(),input,true);
   }

   return ()=> clearInterval(interval);
  },[startTime,endTime,timer,result])



  const handlechnage=(e)=>{
    // console.log(e.target.value)
      SetInput(e.target.value);


      if(!startTime && e.target.value.length>0){
        const now=new Date();
        SetStartTime(now);
        
      }

      if(e.target.value.length>=Text.length){
        const end=new Date();
        SetEndTime(end);
        calculateResult(startTime,end,e.target.value);
      }
  }

  const calculateResult=(start,end,input,isTimeout=false)=>{
    console.log(start,"start")
    console.log(end,"end")
         const timeTaken=(end-start)/1000;
         console.log("timeTaken",timeTaken)
         const words=Text.trim().split("").length;
         const speed=Math.round((words/timeTaken)*60);
     
     
         const correctChars=input.split("").filter((ch,i)=>{
          console.log("ch",ch);
          console.log("text",Text[i]);
          return ch===Text[i]}).length;
         console.log("correctChars",correctChars);
         const accuracy=Math.ceil((correctChars/Text.length) * 100);
         if(accuracy>=90){
          setEligible(true);
          SetClear(true);
          
         }
         else{
            setEligible(false)
            // clear=false;
            SetClear(false);
         }
         
            
         
         const res={
            speed:isTimeout ? 0 : speed,
            accuracy,
            time:isTimeout ? 10 : timeTaken.toFixed(2),
            a

         }

         SetResult(res);
         SetResultHistory((prevState)=>[...prevState,res]);
  }


  const getHighlightedText=()=>{
    return Text.split("").map((char,index)=>{
       let typedChar=input[index];
       let className="";
       if(typedChar===undefined) className="";
       else if(typedChar ===char) className="correct";
       else className="incorrect"
        
       return (
        <span key={index} className={className}>{char}</span>
       );

    }); 

   
  }
  return (
    <>
    <div className='container'>
       <h1>Typing Speed Tester 💻</h1>
       <p className='timer'>⌛ Time Left: {timer}s</p>
       <div className='box'>
         <p className='quote noselect '>
          
            
           { Text &&  getHighlightedText()}
            
          
         </p>
         <textarea ref={inputRef} className='input' placeholder='start typing here.......' value={input} onChange={handlechnage} disabled={result || timer===0} />
         { result ?   
          (
           <div className='result'>
               <p>Speed :{result.speed} LPM</p>
               <p>Accuracy : {result.accuracy}% </p>
               <p>Time Taken : {result.time}s</p>


              {a < 4 && (
               <p>Level {result.a} is {clear ? "" : "not"} completed</p>
              )}
               
               {
                 (a==4 && clear) ?  <p className='winner'>You Won 🏆</p> : ""
               }
                
               <button onClick={()=>{
                   resetTest(1);
                   SetA(1);
               }}>Try Again</button>
               {
                // console.log("eligible JSX",eligible)
                // eligible ? (<button onClick={()=>{
                //        a=a+1;
                //        resetTest();
                // }} className='nextbtn'>Next Challenge</button>) : ""
                   (eligible && a<=3) ? (<button   onClick={() => {
                     SetA((prev)=>{
                        resetTest(prev+1);
                        return prev+1;
                     });
                     
                     }} 
                     className='nextbtn'
                   >
                  Next Challenge
                  </button>) : ""
                }
               
            </div>
          ):(<p className='information'>Star Typing to check your speed</p>)

         }
       </div>

       {resultHistory.length >0 && (
          <div className='History'>
              <h3>Past Result</h3>
              <ul>
                 {
                  resultHistory.map((r,i)=>{

                   return <li key={i}>
                      <b>{i+1}.</b> Speed :{r.speed} WPM | Accuracy :{r.accuracy}% | Time: {r.time}s
                    </li>
                  })
                 }
              </ul>
          </div>
       ) }
       
    </div>



    </>
  )
}

export default App;
