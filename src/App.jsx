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
  const [selectedDay, setSelectedDay] = useState("Segunda");

  const navigate = useNavigate();

  const muscleOptions = [
    "Peito",
    "Costas",
    "Bíceps",
    "Tríceps",
    "Pernas",
    "Ombros",
    "Abdômen",
  ];

  const daysOfWeek = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  // Rotina semanal sugerida
  const weeklyRoutine = {
    Segunda: ["Peito", "Tríceps", "Abdômen"],
    Terça: ["Costas", "Bíceps", "Abdômen"],
    Quarta: ["Pernas", "Ombros"],
    Quinta: ["Peito", "Tríceps", "Abdômen"],
    Sexta: ["Costas", "Bíceps", "Pernas"],
    Sábado: ["Ombros", "Abdômen"],
    Domingo: ["Descanso"],
  };

  // Autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/");
      }
    });
    return unsubscribe;
  }, [navigate]);

  // Carrega treinos do Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "treinos"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(data);
    });

    return unsubscribe;
  }, [user]);

  // Adicionar treino manual
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

  // Adicionar treino sugerido
  const addSuggestedTask = async (task) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "treinos"), { ...task, uid: user.uid });
    } catch (err) {
      console.error("Erro ao adicionar treino sugerido:", err);
    }
  };

  // Toggle treino feito
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
      navigate("/");
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  if (!user) return <p>Carregando ou usuário não logado...</p>;

  // Gera sugestões do dia
  const generateRoutine = (day) => {
    const muscles = weeklyRoutine[day];
    if (!muscles) return [];
    return muscles
      .filter((muscle) => muscle !== "Descanso")
      .map((muscle, idx) => ({
        id: `suggested-${day}-${idx}`,
        text: `Exercício de ${muscle}`,
        muscleGroup: muscle,
        day,
        done: false,
        suggested: true,
      }));
  };

  return (
    <div className="app">
      <button onClick={handleLogout} className="logout-btn">
        Deslogar
      </button>
      <h1>🏋️ Treinos Semanais</h1>

      {/* Adicionar treino manual */}
      <div className="input-area">
        <input
          type="text"
          value={newTask}
          placeholder="Nome do exercício..."
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />

        <select
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
        >
          {muscleOptions.map((muscle) => (
            <option key={muscle} value={muscle}>
              {muscle}
            </option>
          ))}
        </select>

        <select value={day} onChange={(e) => setDay(e.target.value)}>
          <option value="">Escolha o dia</option>
          {daysOfWeek.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <button onClick={addTask}>Adicionar</button>
      </div>

      {/* Sugestões da semana */}
      <div className="routine-suggestion">
        <h2>Sugestão de treino</h2>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <ul className="task-list">
          {generateRoutine(selectedDay).map((task) => (
            <li key={task.id} className="suggested">
              <span>{task.text} — <b>{task.muscleGroup}</b></span>
              <button onClick={() => addSuggestedTask(task)}>➕</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Lista de treinos do usuário */}
      <h2>Seus Treinos</h2>
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
