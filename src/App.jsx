import { useState, useEffect } from "react";
import { auth, db, analytics } from "./utils/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import "./App.css";

/* ---------------- HEADER ---------------- */
function Header({ onLogout, onProfile }) {
  return (
    <div className="header">
      <button onClick={onLogout} className="logout-btn">Sair</button>
      <button onClick={onProfile} className="profile-btn">Profile</button>
    </div>
  );
}

/* ---------------- FORMULÁRIO ---------------- */
function TaskForm({ newTask, setNewTask, weight, setWeight, muscleGroup, setMuscleGroup, day, setDay, addTask, muscleOptions, daysOfWeek }) {
  return (
    <div className="input-area">
      <input type="text" value={newTask} placeholder="Nome do exercício..." onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} />
      <input type="number" value={weight} placeholder="Peso (kg)" onChange={(e) => setWeight(e.target.value)} />
      <select value={muscleGroup} onChange={(e) => setMuscleGroup(e.target.value)}>
        {muscleOptions.map((muscle) => <option key={muscle} value={muscle}>{muscle}</option>)}
      </select>
      <select value={day} onChange={(e) => setDay(e.target.value)}>
        <option value="">Escolha o dia</option>
        {daysOfWeek.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <button onClick={addTask}>Adicionar</button>
    </div>
  );
}

/* ---------------- LISTA DE TREINOS ---------------- */
function TaskList({ tasks, toggleTask, deleteTask, startTimer }) {
  return (
    <>
      <h2>📋 Seus Treinos</h2>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.done ? "done" : ""}>
            <span onClick={() => toggleTask(task.id, task.done)}>{task.text} — <b>{task.muscleGroup}</b> ({task.day}) {task.weight ? `🏋️ ${task.weight}kg` : ""}</span>
            {task.done && task.finishedAt && <small>✅ Finalizado em {new Date(task.finishedAt).toLocaleDateString("pt-BR")}</small>}
            <div className="actions">
              <button onClick={() => deleteTask(task.id)}>❌</button>
              <button onClick={() => startTimer(60)}>⏱️ Descanso</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------- TIMER ---------------- */
function Timer({ timer }) {
  return <div className="timer">⏳ Descanso: <b>{timer}s</b></div>;
}

/* ---------------- APP ---------------- */
function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("Peito");
  const [day, setDay] = useState("");
  const [weight, setWeight] = useState("");
  const [user, setUser] = useState(null);
  const [timer, setTimer] = useState(null);

  const navigate = useNavigate();
  const muscleOptions = ["Peito", "Costas", "Bíceps", "Tríceps", "Pernas", "Ombros", "Abdômen"];
  const daysOfWeek = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  // Autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        logEvent(analytics, "login", { method: "email" });
      } else navigate("/");
    });
    return unsubscribe;
  }, [navigate]);

  // Carrega treinos do Firestore
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "treinos"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [user]);

  const addTask = async () => {
    if (!newTask.trim() || !day || !user) return;
    const task = { text: newTask, muscleGroup, day, weight: weight || null, done: false, uid: user.uid };
    try {
      await addDoc(collection(db, "treinos"), task);
      logEvent(analytics, "add_training", { muscleGroup: task.muscleGroup, day: task.day });
      setNewTask(""); setDay(""); setMuscleGroup("Peito"); setWeight("");
    } catch (err) { console.error(err); }
  };

  const toggleTask = async (id, done) => {
    try {
      const taskRef = doc(db, "treinos", id);
      await updateDoc(taskRef, { done: !done, finishedAt: !done ? new Date().toISOString() : null });
      logEvent(analytics, "complete_training", { taskId: id, completed: !done });
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (id) => {
    try {
      const taskRef = doc(db, "treinos", id);
      await deleteDoc(taskRef);
      logEvent(analytics, "delete_training", { taskId: id });
    } catch (err) { console.error(err); }
  };

  const startTimer = (seconds) => {
    setTimer(seconds);
    logEvent(analytics, "start_rest_timer", { duration: seconds });
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return null; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logEvent(analytics, "logout");
      navigate("/");
    } catch (err) { console.error(err); }
  };

  if (!user) return <p>Carregando...</p>;

  return (
    <div className="app">
      <Header onLogout={handleLogout} onProfile={() => { navigate("/profile"); logEvent(analytics, "view_profile"); }} />
      <h1>🏋️ Treinos Semanais</h1>

      <TaskForm
        newTask={newTask} setNewTask={setNewTask} weight={weight} setWeight={setWeight}
        muscleGroup={muscleGroup} setMuscleGroup={setMuscleGroup} day={day} setDay={setDay}
        addTask={addTask} muscleOptions={muscleOptions} daysOfWeek={daysOfWeek}
      />

      <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} startTimer={startTimer} />

      {timer !== null && <Timer timer={timer} />}
    </div>
  );
}

export default App;
