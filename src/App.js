import { db, auth } from './firebaseConnection';
import './app.css'
import { useState, useEffect } from 'react';
import { 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot} from 'firebase/firestore';

  import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
  } from 'firebase/auth';

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');
  const [posts, setPosts] = useState([]);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  useEffect(()=>{
    async function loadPosts(){
        const onsub = onSnapshot(collection(db, "posts"), (snapshot)=>{
          let listaPost = [];

          snapshot.forEach((doc) => { 
            listaPost.push({
              id: doc.id,
              titulo: doc.data().titulo,
              autor: doc.data().autor,
            })
          })
    
         setPosts(listaPost);
        })
    }
    loadPosts()
  },[])

  useEffect(()=>{
    async function checkLogin(){
      onAuthStateChanged(auth, (user)=>{
        if(user){
          console.log(user);
          setUser(true)
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
        }else{
          setUser(false)
          setUserDetail({})
        }
      })
    }

    checkLogin();

  },[])


  

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

}
async function handleDelete(id){
  /*alert("Apagar");*/
  const docRef = doc(db, "posts", id)

  await deleteDoc (docRef)
  
}

async function novoUtilizador(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(()=>{
      console.log("POST APAGADO")
      setEmail('')
      setSenha('')
    })
    .catch((error)=>{
      if(error.code === 'auth/weak-password'){
        alert("Senha muito fraca")
      }else if (error.code === 'auth/email-already-in-use'){
        alert("Email ja existe")
      }
    })
}
async function logarUtilizador(){
  await signInWithEmailAndPassword(auth, email, senha)
  .then((value)=>{
    console.log("LOGADO COM SUCESSO")
    setUserDetail({
      uid: value.user.uid,
      email: value.user.email
    })
    setUser(true)
    
    setEmail('')
    setSenha('')
  })
  .catch((error)=>{
    console.log("O email não tem formato válido.: " + error.code)
  })
}

async function fazerLogout(){
  await signOut(auth)
  setUser(false)
  setUserDetail({})
}

  return (
    <div className="App">
        <h1>ReactJS + Firebase :-)</h1>

        { user && (
          <div>
            <strong>Seja bem-vindo(a) Estas Logado</strong><br/>
            <span>ID: {userDetail.uid} - Email: {userDetail.email}</span>
            <br/><button onClick={fazerLogout}>Sair</button>
            <br/><br/>
          </div>
        )}

        <div className='container'>
          <h2>Utilizadores</h2>
          <label>Emal:</label>
            <input
              placeholder='Digite seu Email'
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
          />


        <label>Senha:</label>
            <input
              placeholder='Digite sua senha'
              value={senha}
              onChange={(e)=> setSenha(e.target.value)}
          />
        <button onClick={novoUtilizador}>Cadastrar</button>
        <button onClick={logarUtilizador}>Login</button>
                   
        </div>
        <br/>
        <br/>
        <hr/>

        <h2>Posts</h2>
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
