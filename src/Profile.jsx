import { useEffect, useState } from "react";
import { auth, db, analytics } from "./utils/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { logEvent } from "firebase/analytics";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

  
        logEvent(analytics, "view_profile");

        const docRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || currentUser.displayName || "");
          setBio(data.bio || "");
          setPhotoURL(data.photoURL || currentUser.photoURL || "");
        } else {

          await setDoc(docRef, {
            name: currentUser.displayName || "Usuário",
            email: currentUser.email,
            bio: "",
            photoURL: currentUser.photoURL || "",
          });
          setName(currentUser.displayName || "");
          setBio("");
          setPhotoURL(currentUser.photoURL || "");
        }
      } else {
        navigate("/"); 
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  async function handleSave(e) {
    e.preventDefault();
    if (!user) return;

    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, {
      name,
      bio,
      photoURL,
    });

    setEditMode(false);
    alert("Perfil atualizado!");


    logEvent(analytics, "save_profile", { nameLength: name.length, bioLength: bio.length });
  }

  if (loading) return <p>Carregando perfil...</p>;
  if (!user) return <p>Você precisa estar logado para ver o perfil.</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={photoURL || "https://i.pravatar.cc/150?img=12"}
          alt="Foto de perfil"
          className="profile-avatar"
        />

        {!editMode ? (
          <>
            <h2>{name}</h2>
            <p className="email">{user.email}</p>
            <p className="bio">{bio}</p>
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Editar Perfil
            </button>
            <button className="back-btn" onClick={() => navigate("/app")}>
              🔙 Voltar
            </button>
          </>
        ) : (
          <form className="profile-form" onSubmit={handleSave}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome"
            />
            <input
              type="text"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="URL da foto"
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Escreva sua bio..."
            />
            <button type="submit" className="save-btn">
              Salvar
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditMode(false);
                logEvent(analytics, "cancel_edit_profile"); 
              }}
            >
              Cancelar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
