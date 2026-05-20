import { useState } from "react";
import API from "../services/api";

export default function LogInteraction() {

    const [message,setMessage]=useState("");

    const [success,setSuccess]=
    useState("");

const [form,setForm]=useState({

hcp_name:"",
interaction_type:"",
date:"",
time:"",
attendees:"",
topics:"",
materials:"",
samples:"",
sentiment:"",
outcomes:"",
follow_up:""

});
function summarizeVoice(){

    const summary=[];
    
    if(form.hcp_name){
    
    summary.push(
    
    `Met ${form.hcp_name}`
    
    );
    
    }
    
    if(form.interaction_type){
    
    summary.push(
    
    `for a ${form.interaction_type.toLowerCase()}`
    
    );
    
    }
    
    if(form.topics){
    
    summary.push(
    
    `and discussed ${form.topics}`
    
    );
    
    }
    
    if(form.materials){
    
    summary.push(
    
    `Shared ${form.materials}`
    
    );
    
    }
    
    if(form.samples){
    
    summary.push(
    
    `Distributed ${form.samples}`
    
    );
    
    }
    
    if(form.sentiment){
    
    summary.push(
    
    `The interaction felt ${form.sentiment.toLowerCase()}`
    
    );
    
    }
    
    if(form.outcomes){
    
    summary.push(
    
    `${form.outcomes}`
    
    );
    
    }
    
    if(form.follow_up){
    
    summary.push(
    
    `Follow up: ${form.follow_up}`
    
    );
    
    }
    
    if(summary.length===0){
    
    setMessage(
    
    "Describe the interaction first to generate a summary."
    
    );
    
    return;
    
    }
    
    setMessage(
    
    summary.join(". ") + "."
    
    );
    
    }
    function startVoiceInput(){

        const SpeechRecognition=
        
        window.SpeechRecognition
        ||
        window.webkitSpeechRecognition;
        
        if(!SpeechRecognition){
        
        alert(
        "Voice input not supported"
        );
        
        return;
        
        }
        
        const recognition=
        new SpeechRecognition();
        
        recognition.lang=
        "en-US";
        
        recognition.interimResults=
        false;
        
        recognition.maxAlternatives=
        1;
        
        recognition.start();
        
        recognition.onresult=
        (event)=>{
        
        setMessage(
        
        event.results[0][0].transcript
        
        );
        
        };
        
        recognition.onerror=
        ()=>{
        
        alert(
        "Unable to capture voice"
        );
        
        };
        
        }
        function addMaterial(){

            const value=
            
            window.prompt(
            "Enter material shared"
            );
            
            if(!value) return;
            
            setForm(
            
            prev=>({
            
            ...prev,
            
            materials:
            
            prev.materials
            
            ?
            
            prev.materials
            +
            ", "
            +
            value
            
            :
            
            value
            
            })
            
            );
            
            }
            
            
            
            function addSample(){
            
            const value=
            
            window.prompt(
            "Enter sample"
            );
            
            if(!value) return;
            
            setForm(
            
            prev=>({
            
            ...prev,
            
            samples:
            
            prev.samples
            
            ?
            
            prev.samples
            +
            ", "
            +
            value
            
            :
            
            value
            
            })
            
            );
            
            }
async function sendMessage(){
    
if(!message.trim()) return;

try{

const res=
await API.post(
    "/chat",
    {
    
    message,
    
    current_form:form
    
    }
    )

if(
res.data.form_data
){

setForm(
res.data.form_data
);

}

setMessage("");

}

catch{

alert(
"Unable to process interaction"
);

}

}

return(

<>

<style>

{`

.left-scroll::-webkit-scrollbar{
width:8px;
}

.left-scroll::-webkit-scrollbar-thumb{
background:#D6DCE5;
border-radius:20px;
}

.left-scroll::-webkit-scrollbar-track{
background:transparent;
}

textarea::placeholder{
color:#6B7280;
}

`}

</style>

<div style={styles.page}>

<h1 style={styles.heading}>

Log HCP Interaction

</h1>

<div style={styles.layout}>

<div
style={styles.left}
className="left-scroll"
>

<div style={styles.sectionTitle}>

Interaction Details

</div>

<div style={styles.row}>

<Field
label="HCP Name"
value={form.hcp_name}
/>

<SelectField
label="Interaction Type"
value={form.interaction_type}
/>

</div>

<div style={styles.row}>

<Field
label="Date"
value={form.date}
/>

<Field
label="Time"
value={form.time}
/>

</div>

<Field
label="Attendees"
value={form.attendees}
/>

<TextField
label="Topics Discussed"
value={form.topics}
/>

<div style={styles.voiceArea}>

<button

onClick={summarizeVoice}

style={styles.voiceButton}

>

🎤 Summarize

</button>

<button

onClick={startVoiceInput}

style={styles.voiceButton}

>

🎙 Record Voice

</button>

</div>

<Card
title="Materials Shared"
value={form.materials}
button="🔍 Search/Add"
onClick={addMaterial}
/>

<Card
title="Samples Distributed"
value={form.samples}
button="＋ Add Sample"
onClick={addSample}
/>

<div style={styles.label}>

Observed / Inferred HCP Sentiment

</div>

<div style={styles.sentimentRow}>

{[
["Positive","🙂"],
["Neutral","😐"],
["Negative","☹️"]

].map(([value,emoji])=>(

<div
key={value}
style={styles.sentimentItem}
>

<div
style={
form.sentiment===value
?
styles.radioActive
:
styles.radio
}
/>

<span style={styles.emoji}>

{emoji}

</span>

<span
style={
form.sentiment===value
?
styles.sentimentTextActive
:
styles.sentimentText
}
>

{value}

</span>

</div>

))}

</div>

<TextField
label="Outcomes"
value={form.outcomes}
/>

<TextField
label="Follow-up Actions"
value={form.follow_up}
/>

</div>

<div style={styles.right}>

<div style={styles.aiTitle}>

🤖 AI Assistant

</div>

<div style={styles.aiSubtitle}>

Log interaction details here via chat

</div>

<div style={styles.tip}>

Describe naturally.

Example:

Met Dr Smith and discussed treatment outcomes. Shared brochure and agreed to reconnect next week.

</div>

<textarea

value={message}

spellCheck={false}

onChange={(e)=>

setMessage(
e.target.value
)

}

placeholder="Describe Interaction..."

style={styles.chat}

/>

<button

onClick={sendMessage}

style={styles.log}

>

Log

</button>

</div>

</div>

</div>

</>

);

}

function Field({

label,
value

}){

return(

<div style={styles.field}>

<label style={styles.label}>

{label}

</label>

<input

disabled

value={value || ""}

style={styles.input}

/>

</div>

);

}

function SelectField({

label,
value

}){

return(

<div style={styles.field}>

<label style={styles.label}>

{label}

</label>

<select

disabled

style={styles.input}

>

<option>

{
value
||
"Meeting"
}

</option>

</select>

</div>

);

}

function TextField({

label,
value

}){

return(

<div style={styles.field}>

<label style={styles.label}>

{label}

</label>

<textarea

disabled

value={value || ""}

style={styles.textarea}

/>

</div>

);

}
function Card({

    title,
    value,
    button,
    onClick
    
    }){
    
    return(
    
    <div style={styles.field}>
    
    <div style={styles.label}>
    
    {title}
    
    </div>
    
    <div style={styles.card}>
    
    <div>
    
    {
    
    value
    
    ||
    
    `No ${title.toLowerCase()} added`
    
    }
    
    </div>
    
    <button
    
    onClick={onClick}
    
    style={styles.searchBtn}
    
    >
    
    {button}
    
    </button>
    
    </div>
    
    </div>
    
    );
    
    }


const styles={

page:{
background:"#F7F8FA",
minHeight:"100vh",
padding:"24px",
fontFamily:"Segoe UI"
},

heading:{
fontSize:"32px",
fontWeight:"700",
color:"#1F2937",
marginBottom:"18px"
},

layout:{
display:"grid",
gridTemplateColumns:"2fr 1fr",
gap:"20px",
height:"calc(100vh - 110px)"
},

left:{
background:"#FFFFFF",
borderRadius:"14px",
padding:"24px",
overflowY:"auto"
},

right:{
background:"#FFFFFF",
borderRadius:"14px",
padding:"24px",
display:"flex",
flexDirection:"column"
},

sectionTitle:{
fontSize:"18px",
fontWeight:"700",
marginBottom:"20px"
},

row:{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"16px"
},

field:{
marginBottom:"18px"
},

label:{
fontSize:"13px",
color:"#596575",
marginBottom:"8px",
display:"block"
},

input:{
width:"100%",
padding:"12px",
boxSizing:"border-box",
border:"1px solid #E6EAF0",
borderRadius:"8px",
background:"#FAFBFC"
},

textarea:{
width:"100%",
height:"90px",
padding:"12px",
boxSizing:"border-box",
border:"1px solid #E6EAF0",
borderRadius:"8px",
background:"#FAFBFC",
resize:"none",
color:"#2B313B"
},

voiceArea:{

    display:"flex",
    
    gap:"14px",
    
    marginBottom:"18px"
    
    },
    
    voiceButton:{
    
    background:"transparent",
    
    border:"none",
    
    color:"#497CFF",
    
    fontSize:"13px",
    
    cursor:"pointer",
    
    padding:0
    
    },

card:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"14px",
background:"#FAFBFC",
border:"1px solid #E6EAF0",
borderRadius:"10px"
},

searchBtn:{
padding:"8px 14px",
border:"1px solid #DDE4EE",
borderRadius:"8px",
background:"#FFFFFF",
color:"#497CFF"
},

sentimentRow:{

    display:"flex",
    
    flexDirection:"row",
    
    alignItems:"center",
    
    justifyContent:"flex-start",
    
    gap:"32px",
    
    marginBottom:"22px",
    
    width:"100%"
    
    },
    
    sentimentItem:{
    
    display:"flex",
    
    alignItems:"center",
    
    gap:"8px",
    
    minWidth:"110px"
    
    },
    
    radio:{
    
    width:"14px",
    
    height:"14px",
    
    border:"2px solid #BFC7D3",
    
    borderRadius:"50%",
    
    background:"#FFFFFF",
    
    display:"inline-block",
    
    boxSizing:"border-box"
    
    },
    
    radioActive:{
    
    width:"14px",
    
    height:"14px",
    
    border:"2px solid #8B5CF6",
    
    background:"#8B5CF6",
    
    borderRadius:"50%",
    
    display:"inline-block",
    
    boxSizing:"border-box"
    
    },
    
    emoji:{
    
    fontSize:"16px"
    
    },
    
    sentimentText:{
    
    fontSize:"13px",
    
    color:"#5B6572"
    
    },
    
    sentimentTextActive:{
    
    fontSize:"13px",
    
    fontWeight:"600",
    
    color:"#202124"
    
    },

active:{
fontSize:"30px"
},

inactive:{
fontSize:"26px",
opacity:0.35
},

aiTitle:{
fontWeight:"700",
color:"#497CFF"
},

aiSubtitle:{
fontSize:"13px",
color:"#7B8794",
marginBottom:"16px"
},

tip:{
background:"#EAF9FC",
padding:"16px",
borderRadius:"12px",
color:"#334155",
fontSize:"14px",
lineHeight:"1.7",
marginBottom:"16px"
},

chat:{
width:"100%",
height:"120px",
padding:"16px",
fontSize:"15px",
lineHeight:"1.6",
fontWeight:"500",
background:"#FFFFFF",
border:"1px solid #D9E1EC",
borderRadius:"12px",
resize:"none",
color:"#2B313B",
boxSizing:"border-box"
},

log:{
marginTop:"16px",
padding:"14px",
background:"#3B82F6",
color:"white",
border:"none",
borderRadius:"10px"
}

};