import { db } from './firebaseConnection';
import './app.css'
import { useState } from 'react';
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc} from 'firebase/firestore';

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');
  const [posts, setPosts] = useState([]);

  async function handleAdd(){
    /*alert("Cadastrar");*/
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
/*alert("Buscar");*/
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

handleGet();

async function handleUpdate(id){
  /*alert("Actualizar");*/
  const docRef = doc(db, "posts", id)

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
async function handleDelete(id){
  /*alert("Apagar");*/
  const docRef = doc(db, "posts", id)

  await deleteDoc (docRef)
  .then(()=>{
    console.log("POST APAGADO")
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

        {/*<label>Id do Post:</label>
            <input
              placeholder='Digite ID do Post'
              value={idPost}
              onChange={(e)=> setIdPost(e.target.value)}
  />*/}

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
          {/*<button onClick={handleGet}>Buscar Lista</button>*/}

            <ul>
              {posts.map((post)=>{
                  return(
                    <li key={post.id}>
                    <strong>ID: {post.id}</strong><br/>
                      <span>Titulo: {post.titulo}</span><br/>
                      <span>Autor: {post.autor}</span><br/><br/>
                      <button onClick={()=>handleDelete(post.id)}>Apagar</button>
                      <button onClick={()=>handleUpdate(post.id)}>Actualizar</button><br/><br/>
                    </li>
                  )
              })}
            </ul>

        </div>
    </div>
  );
}

export default App;
