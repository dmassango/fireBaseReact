import { useState, useEffect } from 'react'
import './admin.css'

import { auth, db } from '../../firebaseConnection'
import { signOut } from 'firebase/auth'

import { 
  addDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  updateDoc
} from 'firebase/firestore'

export default function Admin(){
  const [tarefaInput, setTarefaInput] = useState('')
  const [user, setUser] = useState({})
  const [edit, setEdit] = useState({})

  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    async function loadTarefas(){
      const userDetail = localStorage.getItem("@detailUser")
      setUser(JSON.parse(userDetail))

      if(userDetail){
        const data = JSON.parse(userDetail);
        
        const tarefaRef = collection(db, "tarefas")
        const q = query(tarefaRef, orderBy("creation_date", "desc"), where("created_by", "==", data?.uid))

        const unsub = onSnapshot(q, (snapshot) => {
          let lista = [];

          snapshot.forEach((doc)=> {
            lista.push({
              id: doc.id,
              task: doc.data().task,
              created_by: doc.data().created_by,
              creation_date: doc.data().creation_date,
            })
          })
          
          console.log(lista);
          setTarefas(lista);


        })

      }

    }

    loadTarefas();
  }, [])

  async function handleRegister(e){
    e.preventDefault();

    if(tarefaInput === ''){
      alert("Digite sua tarefa...")
      return;
    }

    if(edit?.id){
        handleUpdateTarefa(edit?.id);
        return;
    }

    await addDoc(collection(db, "tarefas"), {
        task: tarefaInput,
        creation_date: new Date(),
        update_date: "",
        created_by: user?.uid
    })
    .then(() => {
      console.log("TAREFA REGISTRADA")
      setTarefaInput('')
    })
    .catch((error) => {
      console.log("ERRO AO REGISTRAR " + error)
    })


  }

  async function handleLogout(){
    await signOut(auth);
  }

  async function deleteTarefa(id){
    const docRef = doc(db, "tarefas", id)
    await deleteDoc(docRef)
  }

  async function editTarefa(item){
    setTarefaInput(item.task)
    setEdit(item)
  }

  async function handleUpdateTarefa(id){
    const docRef = doc(db, "tarefas", id)
    await updateDoc (docRef, {
        task: tarefaInput,
        update_date: new Date(),
    })
    .then(() => {
        console.log("TAREFA ACTUALIZADA")
        setTarefaInput('')
        setEdit({})
      })
      .catch((error) => {
        console.log("ERRO AO ACTUALIZAR " + error)
        setTarefaInput('')
        setEdit({})
      })
  }

  return(
    <div className="admin-container">
      <h1>Minhas tarefas</h1>

      <form className="form" onSubmit={handleRegister}>
        <textarea
          placeholder="Digite sua tarefa..."
          value={tarefaInput}
          onChange={(e) => setTarefaInput(e.target.value) }
        />

        {Object.keys(edit).length > 0 ? (
             <button className="btn-register" type="submit">Actualizar tarefa</button> 
        ) : (
            <button className="btn-register" type="submit">Registrar tarefa</button>
        )}
      </form>


      {tarefas.map((item) => (
         <article key={item.id} className="list">
         <p>{item.task}</p>
         <p>{item.created_by}</p>
 
         <div>
           <button onClick={()=>editTarefa(item)}>Editar</button>
           <button onClick={()=>deleteTarefa(item.id)} className="btn-delete">Apagar</button>
         </div>
       </article>
      ))}
      <button className="btn-logout" onClick={handleLogout}>Sair</button>

    </div>
  )
}