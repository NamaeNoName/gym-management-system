import { useEffect, useState } from 'react';
import MembershipCard from './components/MembershipCard';
import './index.css';

function App() {
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [trainees, setTrainees] = useState([]);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [showTrainerModal, setShowTrainerModal] = useState(null); // ID выбранного плана для записи
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    refreshData();
  }, [user]);

  const refreshData = () => {
    fetch('http://localhost:5000/api/gym/memberships').then(res => res.json()).then(setPlans);
    fetch('http://localhost:5000/api/gym/trainers').then(res => res.json()).then(setTrainers);
    
    if (user?.role === 'Admin') {
      fetch('http://localhost:5000/api/gym/users').then(res => res.json()).then(setAllUsers);
    }
    if (user?.role === 'Trainer') {
      fetch(`http://localhost:5000/api/gym/my-trainees/${user._id}`).then(res => res.json()).then(setTrainees);
    }
  };

  const handleLogin = () => {
    fetch('http://localhost:5000/api/gym/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).then(res => res.json()).then(data => {
      if (data.user) setUser(data.user);
      else alert("Пользователь не найден");
    });
  };

  const handleRegister = () => {
    fetch('http://localhost:5000/api/gym/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: "123", role: "User" })
    }).then(res => res.json()).then(() => {
      alert("Регистрация успешна! Теперь войдите.");
      setIsRegistering(false);
    });
  };

  const confirmEnroll = (trainerId) => {
    fetch('http://localhost:5000/api/gym/enroll-full', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, planId: showTrainerModal, trainerId })
    }).then(res => res.json()).then(data => {
      alert(data.message);
      setUser(data.user);
      setShowTrainerModal(null);
    });
  };

  const deleteItem = (type, id) => {
    if(window.confirm("Удалить?")) {
      fetch(`http://localhost:5000/api/gym/${type}/${id}`, { method: 'DELETE' }).then(refreshData);
    }
  };

  return (
    <div className="container">
      {/* МЕНЮ АВТОРИЗАЦИИ */}
      <div className="auth-menu">
        {!user ? (
          <div className="login-box">
            {isRegistering && <input placeholder="Имя" onChange={e => setName(e.target.value)} />}
            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <button onClick={isRegistering ? handleRegister : handleLogin}>
              {isRegistering ? "Создать аккаунт" : "Войти"}
            </button>
            <p className="toggle-auth" onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Регистрация"}
            </p>
          </div>
        ) : (
          <div className="user-info">
            <span>{user.name} (<b>{user.role}</b>)</span>
            <button onClick={() => setUser(null)} style={{background: '#ff4444'}}>Выйти</button>
          </div>
        )}
      </div>

      <h1 className="main-title">Gym Management System (ID 10)</h1>

      {/* ПАНЕЛИ АДМИНА И ТРЕНЕРА (БЕЗ ИЗМЕНЕНИЙ) */}
      {user?.role === 'Admin' && (
        <section className="admin-section">
          <h2>Админ-панель</h2>
          <div className="admin-grid">
            <div className="admin-card">
              <h3>Пользователи</h3>
              {allUsers.filter(u => u.role === 'User').map(u => (
                <div key={u._id} className="list-item">{u.name} <button onClick={() => deleteItem('users', u._id)}>🗑️</button></div>
              ))}
            </div>
            <div className="admin-card">
              <h3>Тренеры</h3>
              {trainers.map(t => (
                <div key={t._id} className="list-item">{t.name} <button onClick={() => deleteItem('trainers', t._id)}>🗑️</button></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* МОДАЛЬНОЕ ОКНО ВЫБОРА ТРЕНЕРА */}
      {showTrainerModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Выберите тренера:</h3>
            <div className="trainer-options">
              {trainers.map(t => (
                <button key={t._id} onClick={() => confirmEnroll(t._id)}>
                  {t.name} ({t.specialization})
                </button>
              ))}
            </div>
            <button className="close-btn" onClick={() => setShowTrainerModal(null)}>Отмена</button>
          </div>
        </div>
      )}

      {/* СПИСОК АБОНЕМЕНТОВ */}
      <div className="app-container">
        {plans.map(plan => (
          <div key={plan._id} className="membership-card">
            <img src="https://cdn-icons-png.flaticon.com/512/69/69840.png" alt="gym" />
            <h2>{plan.title}</h2>
            <p className="price">{plan.price} сом</p>
            <button 
              className="enroll-btn" 
              onClick={() => user ? setShowTrainerModal(plan._id) : alert("Сначала войдите в систему!")}
            >
              Записаться
            </button>
            {user?.role === 'Admin' && (
              <button onClick={() => deleteItem('memberships', plan._id)} style={{marginTop: '10px', background: '#444'}}>Удалить план</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;