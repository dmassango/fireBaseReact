import { db } from './firebaseConnection';
import './app.css'
import { useState } from 'react';
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc} from 'firebase/firestore';

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');
  const [posts, setPosts] = useState([]);

  async function handleAdd(){
    /*await setDoc(doc(db, "posts", "12345"), {
      titulo: titulo,
      autor: autor,
    })
    .then(()=>{
      console.log("DADOS REGISTRADOS NO BANCO")
    })
    .catch((error)=>{
      console.log("GERROU ERRO" + error)
    })*/

    await addDoc (collection(db, "posts"),{
      titulo: titulo,
      autor: autor,
    }).then(()=>{
      console.log("DADOS REGISTRADOS NO BANCO")
      setTitulo('');
      setAutor('');
    }).catch((error)=>{
      console.log("GERROU ERRO" + error)
    })

    handleGet();
  }

  async function handleGet(){

     /* const postRef = doc(db, "posts", "1234")

      await getDoc(postRef)
    .then((snapshot)=>{
      setTitulo(snapshot.data().autor)
      setAutor(snapshot.data().titulo)
    }).catch(()=>{
      console.log("GERROU ERRO")
    })*/

    const postRef = collection(db, "posts")
    await getDocs(postRef) 
    .then((snapshot)=>{
      let lista = [];

      snapshot.forEach((doc) => { 
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })

     setPosts(lista);

  })
  .catch(()=>{
    console.log("GERROU ERRO")
  })
}

async function handleUpdate(){
  /*alert("Funciona");*/
  const docRef = doc(db, "posts", idPost)

  await updateDoc (docRef, {
    titulo: titulo,
    autor: autor
  })
  .then(()=>{
    console.log("POST ACTUALIZADO")
    setTitulo('');
      setAutor('');
      setIdPost('');
  })
  .catch(()=>{
    console.log("GERROU ERRO")
  })

  handleGet();
}


  return (
    <div className="App">
        <h1>ReactJS + Firebase :-)</h1>

        <div className='container'>

        <label>Id do Post:</label>
            <input
              placeholder='Digite ID do Post'
              value={idPost}
              onChange={(e)=> setIdPost(e.target.value)}
            />

          <label>Titulo:</label>
            <textarea 
              type='text' 
              placeholder='Digite o titulo'
              value={titulo}
              onChange={(e)=> setTitulo(e.target.value)}
            />

          <label>Autor:</label>
            <input
              type='text' 
              placeholder='Autor do post'
              value={autor}
              onChange={(e)=> setAutor(e.target.value)}
            />

          <button onClick={handleAdd}>Cadastrar</button>
          <button onClick={handleGet}>Buscar Lista</button>
          <button onClick={handleUpdate}>Actualizar</button>

            <ul>
              {posts.map((post)=>{
                  return(
                    <li key={post.id}>
                    <strong>ID: {post.id}</strong><br/>
                      <span>Titulo: {post.titulo}</span><br/>
                      <span>Autor: {post.autor}</span><br/><br/>
                    </li>
                  )
              })}
            </ul>

        </div>
    </div>
  );
}

export default App;
