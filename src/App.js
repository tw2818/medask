import React, { useState, useRef } from 'react';

const API_URL = "https://api.tweb.one/api/library/ask";

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const answerTextareaRef = useRef(null);

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = () => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`
    };

    const data = {
      "model": "gpt-3.5-turbo",
      "query": question,
      "libraryId": process.env.REACT_APP_LIB_ID,
      "stream": false
    };

    fetch(API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Request failed: " + response.status);
        }
        return response.json();
      })
      .then(responseData => {
        const answer = responseData.answer;
        const documents = responseData.documents;

        const titles = documents.map(document => document.title);

        const output = answer + "\n" + "[参考文献]:" + "\n" + titles.join("\n");
        setAnswer(output);
        setLoading(false);

        // Automatically adjust the height of the answer textarea
        if (answerTextareaRef.current) {
          answerTextareaRef.current.style.height = "auto";
          answerTextareaRef.current.style.height = answerTextareaRef.current.scrollHeight + "px";
        }
      })
      .catch(error => {
        console.error(error);
        setAnswer("An error occurred: " + error.message);
        setLoading(false);
      });
  };

  return (
    <div className="container">
      <h1>蓝皮书AI问答<span style={{ color: 'gray', fontSize: '12px' }}> v0.0.1</span></h1>
      <p style={{ color: 'gray', fontSize: '12px' }}> 欢迎大家提供bug</p>
      <div className="input-container">
        <textarea
          id="questionInput"
          value={question}
          onChange={handleQuestionChange}
          placeholder="请输入你的问题"
        ></textarea>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? '提交中... 请耐心等待' : '提交'}
        </button>
      </div>
      <div className="answer-container">
        <textarea
          id="answerText"
          value={answer}
          readOnly
          ref={answerTextareaRef}
          style={{ height: "auto", resize: "none" }}
        ></textarea>
      </div>
      <div style={{ color: 'gray', fontSize: '12px' }}>答案仅供参考，目前准确率不能达到100%，以后会不断优化</div>
      <div style={{ color: 'gray', fontSize: '12px' }}>作者邮箱: twebery1@gmail.com</div>
      <div style={{ color: 'gray', fontSize: '12px' }}>
        现已支持: 微生物学 药理学 诊断学 神经病学 外科学 病理学 医学遗传学 生理学 医学统计学 医学伦理学
      </div>
    </div>
  );
}

export default App;

