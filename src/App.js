import { db } from './firebaseConnection';
import './app.css'
import { useState } from 'react';
import { doc, setDoc, collection, addDoc, getDoc } from 'firebase/firestore';

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

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
  }

  async function handleGet(){

      const postRef = doc(db, "posts", "12345")

      await getDoc(postRef)
    .then((snapshot)=>{
      setTitulo(snapshot.data().autor)
      setAutor(snapshot.data().titulo)
    }).catch(()=>{
      console.log("GERROU ERRO")
    })

  }
  return (
    <div className="App">
        <h1>ReactJS + Firebase :)</h1>

        <div className='container'>
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
          <button onClick={handleGet}>Buscar Post</button>
        </div>
    </div>
  );
}

export default App;
