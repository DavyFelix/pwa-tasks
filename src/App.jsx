import { useState, useEffect } from "react";
import { auth, db } from "./utils/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("Peito");
  const [day, setDay] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const muscleOptions = ["Peito", "Costas", "Bíceps", "Tríceps", "Pernas", "Ombros", "Abdômen"];

  // Verifica se usuário está logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/"); // Redireciona para login se não logado
      }
    });
    return unsubscribe;
  }, [navigate]);

  // Carrega os treinos do Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "treinos"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(data);
    });

    return unsubscribe;
  }, [user]);

  // Adicionar treino
  const addTask = async () => {
    if (!newTask.trim() || !day || !user) return;

    const task = {
      text: newTask,
      muscleGroup,
      day,
      done: false,
      uid: user.uid,
    };

    try {
      await addDoc(collection(db, "treinos"), task);
      setNewTask("");
      setDay("");
      setMuscleGroup("Peito");
    } catch (err) {
      console.error("Erro ao adicionar treino:", err);
    }
  };

  // Marcar treino como feito
  const toggleTask = async (id, done) => {
    try {
      const taskRef = doc(db, "treinos", id);
      await updateDoc(taskRef, { done: !done });
    } catch (err) {
      console.error("Erro ao atualizar treino:", err);
    }
  };

  // Deletar treino
  const deleteTask = async (id) => {
    try {
      const taskRef = doc(db, "treinos", id);
      await deleteDoc(taskRef);
    } catch (err) {
      console.error("Erro ao deletar treino:", err);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redireciona para login
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  if (!user) return <p>Carregando ou usuário não logado...</p>;

  return (
    <div className="app">
      <h1>🏋️ Treinos Semanais</h1>
      <button onClick={handleLogout} className="logout-btn">Deslogar</button>

      <div className="input-area">
        <input
          type="text"
          value={newTask}
          placeholder="Nome do exercício..."
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />

        <select value={muscleGroup} onChange={(e) => setMuscleGroup(e.target.value)}>
          {muscleOptions.map((muscle) => (
            <option key={muscle} value={muscle}>{muscle}</option>
          ))}
        </select>

        <input type="date" value={day} onChange={(e) => setDay(e.target.value)} />

        <button onClick={addTask}>Adicionar</button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.done ? "done" : ""}>
            <span onClick={() => toggleTask(task.id, task.done)}>
              {task.text} — <b>{task.muscleGroup}</b> ({task.day})
            </span>
            <button onClick={() => deleteTask(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
