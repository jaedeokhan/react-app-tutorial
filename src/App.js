import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

const MODE_WELCOME = 'WELCOME';
const MODE_READ = 'READ';
const MODE_CREATE = 'CREATE';
const MODE_UPDATE = 'UPDATE';

function Header(props) {
  return (
    <header>
        <h1><a href="/" onClick={(event) => {
          event.preventDefault();
          props.onChangeMode();
        }}>{props.title}</a></h1>
    </header>
  )  
}

function Nav(props) {
  const lis = [];
  for (let i = 0; i < props.topcis.length; i++){
    let t = props.topcis[i];
    lis.push(
    <li key={t.id}>
      <a id={t.id} href={'/read/' + t.id} onClick={(event) => {
      event.preventDefault();
      props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a>
    </li>);
  }
  return (
    <nav>
      <ol>
        {lis}
      </ol>
    </nav>
  )
}

function Article(props) {
  return (
    <article>
        <h2>{props.title}</h2>
        {props.body}
    </article>
  )
}

function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form onSubmit={(event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onCreate(title, body);
      }}>
        <p><input type="text" name="title" placeholder="title"/></p>
        <p><textarea name="body" placeholder="body"></textarea></p>
        <p><input type="submit" value="Create"/></p>
      </form>
    </article>
  )
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return (
    <article>
    <h2>Update</h2>
    <form onSubmit={(event) => {
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p>
        <input type="text" name="title" placeholder="title" 
               value={title} onChange={(event) => {
                setTitle(event.target.value);
               }}/>
      </p>
      <p>
        <textarea name="body" placeholder="body" 
                  value={body} onChange={(event) => {
                    setBody(event.target.value);
                  }}></textarea>
      </p>
      <p><input type="submit" value="Update"/></p>
    </form>
  </article>   
  )
}

function App() {
  const [mode, setMode] = useState(MODE_WELCOME);
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id : 1, title : 'html', body : 'html is ...'},
    {id : 2, title : 'css', body : 'css is ...'},
    {id : 3, title : 'js', body : 'js is ...'}
  ]);

  let content = null;
  let contextControl = null;

  if (mode === MODE_WELCOME) {
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  } else if (mode === MODE_READ) {
    let title, body = null;
    for (let i = 0; i < topics.length; i++){
      if (topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <li><a href={'/update/' + id} onClick={(event) => {
            event.preventDefault();
            setMode(MODE_UPDATE);
            }}>Update</a>         
      </li>
      <li><input type="button" value="Delete" onClick={() => {
        const newTopics = [];
        for (let i = 0; i < topics.length; i++){
          if (topics[i].id !== id){
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode(MODE_WELCOME);
      }}/></li>
    </>  
  } else if (mode === MODE_CREATE) {
    content = <Create onCreate={(_title, _body) => {
      const newTopic = {id:nextId, title:_title, body:_body};
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics)
      setMode(MODE_READ);
      setId(nextId);
      setNextId(nextId + 1);
    }}></Create>
  } else if (mode === MODE_UPDATE) {
    let title, body = null;
    for (let i = 0; i < topics.length; i++){
      if (topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(_title, _body) => {
      const newTopics = [...topics];
      const updatedTopic = {id: id, title:_title, body:_body};
      for (let i = 0; i < newTopics.length; i++){
        if (newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode(MODE_READ);
    }}></Update>
  }

  return (
    <div>
      <Header title="WEB" onChangeMode={() => {
        setMode(MODE_WELCOME);
      }}></Header>

      <Nav topcis={topics} onChangeMode={(_id) => {
        setMode(MODE_READ);
        setId(_id);
      }}></Nav>

      {content}
      <ul>
        <li>
            <a href="/create" onClick={(event) => {
            event.preventDefault();
            setMode(MODE_CREATE);
            }}>Create</a>
        </li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
