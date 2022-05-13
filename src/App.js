import logo from './logo.svg';
import './App.css';
import { useState } from "react";
import Lottie from "react-lottie";
import animationData from './robot';


function CustomRow(props) {
  return (
    <tbody>
      <tr>
        <td>Prompt: </td>
        <td>{props.prompt}</td>
        <td>Result:</td>
        <td>{props.result}</td>
      </tr>
    </tbody>
  )}

function App() {

const [result, setResult] = useState(null);
const [error, setError] = useState(null);
const [submissions, setSubmissions] = useState(
    JSON.parse(localStorage.getItem('coding-challenge-submissions')) || []
  );

const [textarea, setTextarea] = useState(
    ""
  );
const [shake, setShake] = useState(false);
const [buttonText, setButtonText] = useState("Submit");

//for lottiefiles robot animation
 const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };
const apiKey = process.env.REACT_APP_API

const data = {
 prompt: "",
 temperature: 0.5,
 max_tokens: 64,
 top_p: 1.0,
 frequency_penalty: 0.0,
 presence_penalty: 0.0,
};

const handleChange = (event) => {
  let value = event.target.value
  setTextarea(value)
  data.prompt = value
}

const clearHistory = () => {
  localStorage.setItem('coding-challenge-submissions', null)
  setSubmissions([])
}

const fetchData = () => {

  data.prompt = textarea
  if (data.prompt !== "") {
    setTextarea("")
    setButtonText("Loading ...");
    fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify(data),
    }).then((response) => response.json())
    .then((actualData) => {
      let newRow = {prompt: data.prompt, result: actualData.choices[0].text}
      setSubmissions([newRow, ...submissions])
      localStorage.setItem('coding-challenge-submissions', JSON.stringify([newRow, ...submissions]))
    })
    .catch((err) => {
      console.log(err.message);
    }).finally(() => {
      setButtonText("Submit");
    })
  }
};

  return (
    <div className="App">
      <div className="main">
        <h1>Making Work Easy</h1>
        <p>Enter Prompt</p>
        <textarea type="textarea" value={textarea} onChange={handleChange}></textarea>
        <button onClick={fetchData}>{buttonText}</button>
        <h2>Responses:<button class="clear" onClick={clearHistory}>Clear</button></h2>
        <table>
          {submissions.length <= 0 ?
          <div> 
          <div>
          <Lottie options={defaultOptions} height={200} width={200}/>
          <h3>So this is what empty space looks like . . .</h3>
          </div>
      </div>
          : submissions.map((row, index)=>
          (
            <CustomRow prompt={row.prompt} result={row.result}></CustomRow>
          ))}
        </table>
            <ul class="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
      </div>
    </div>
  );
}
  
export default App;
