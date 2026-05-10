import { useEffect, useState } from 'react';
import './index.css';

function App() {
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [myStudents, setMyStudents] = useState([]);
  
  const [adminTab, setAdminTab] = useState('add'); // 'add', 'edit', 'users'
  const [isRegistering, setIsRegistering] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  
  const [newPlan, setNewPlan] = useState({ title: '', price: '' });
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);

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
      fetch(`http://localhost:5000/api/gym/trainer-students/${user._id}`).then(res => res.json()).then(setMyStudents);
    }
  };

  const handleAuth = () => {
    const url = isRegistering ? 'users' : 'users/login';
    fetch(`http://localhost:5000/api/gym/${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: login, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message && !data.user) return alert(data.message);
      if (isRegistering) {
        setIsRegistering(false);
        alert("Аккаунт создан!");
      } else {
        setUser(data.user);
      }
    });
  };

  const updateRole = (userId, newRole) => {
    fetch('http://localhost:5000/api/gym/users/role', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newRole })
    }).then(() => {
      refreshData();
      alert("Роль изменена!");
    });
  };

  if (!user) return (
    <div className="auth-page">
      <div className="auth-card-main">
        <h1 className="logo">GYM<span>FIT</span></h1>
        <h2>{isRegistering ? "Регистрация" : "Вход"}</h2>
        <div className="auth-form">
          <input placeholder="Логин" onChange={e => setLogin(e.target.value)} />
          <input type="password" placeholder="Пароль" onChange={e => setPassword(e.target.value)} />
          <button className="auth-submit-btn" onClick={handleAuth}>
            {isRegistering ? "Создать аккаунт" : "Войти"}
          </button>
          <p className="auth-toggle" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Уже есть логин? Войти" : "Нет логина? Создать"}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <header className="main-header">
        <h1 className="logo">GYM<span>FIT</span></h1>
        <div className="header-user">
          <div className="user-meta">
            <span>{user.email} <b className="badge">{user.role}</b></span>
          </div>
          <button onClick={() => setUser(null)} className="logout-btn">Выйти</button>
        </div>
      </header>

      {user.role === 'Admin' && (
        <section className="admin-section">
          <div className="admin-tabs">
            <button className={adminTab === 'add' ? 'active' : ''} onClick={() => setAdminTab('add')}>➕ Добавить тариф</button>
            <button className={adminTab === 'edit' ? 'active' : ''} onClick={() => setAdminTab('edit')}>⚙️ Управление тарифами</button>
            <button className={adminTab === 'users' ? 'active' : ''} onClick={() => setAdminTab('users')}>👥 Аккаунты</button>
          </div>

          <div className="admin-content">
            {adminTab === 'add' && (
              <form className="admin-card" onSubmit={e => {
                e.preventDefault();
                const method = editingPlanId ? 'PUT' : 'POST';
                const url = editingPlanId ? `/memberships/${editingPlanId}` : '/memberships';
                fetch(`http://localhost:5000/api/gym${url}`, {
                  method, headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newPlan)
                }).then(() => {
                  refreshData();
                  setNewPlan({title:'', price:''});
                  setEditingPlanId(null);
                  alert("Сохранено!");
                });
              }}>
                <h3>{editingPlanId ? "✏️ Редактировать" : "➕ Новый тариф"}</h3>
                <input placeholder="Название" value={newPlan.title} onChange={e => setNewPlan({...newPlan, title: e.target.value})} />
                <input placeholder="Цена" value={newPlan.price} onChange={e => setNewPlan({...newPlan, price: e.target.value})} />
                <button type="submit">Сохранить</button>
                {editingPlanId && <button type="button" onClick={() => {setEditingPlanId(null); setNewPlan({title:'', price:''})}}>Отмена</button>}
              </form>
            )}

            {adminTab === 'edit' && (
              <div className="manage-grid">
                {plans.map(p => (
                  <div key={p._id} className="manage-item">
                    <span><b>{p.title}</b> — {p.price} сом</span>
                    <div className="actions">
                      <button onClick={() => {setNewPlan(p); setEditingPlanId(p._id); setAdminTab('add');}}>✏️</button>
                      <button onClick={() => fetch(`http://localhost:5000/api/gym/memberships/${p._id}`, {method:'DELETE'}).then(refreshData)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {adminTab === 'users' && (
              <div className="users-list">
                <table className="admin-table">
                  <thead><tr><th>Логин</th><th>Роль</th><th>Действие</th></tr></thead>
                  <tbody>
                    {allUsers.map(u => (
                      <tr key={u._id}>
                        <td>{u.email}</td>
                        <td>
                          <select value={u.role} onChange={(e) => updateRole(u._id, e.target.value)}>
                            <option value="User">User</option>
                            <option value="Trainer">Trainer</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </td>
                        <td>
                          <button className="del-btn-small" onClick={() => fetch(`http://localhost:5000/api/gym/users/${u._id}`, {method:'DELETE'}).then(refreshData)}>Удалить</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {user.role === 'Trainer' && (
        <section className="trainer-section">
          <h2>👥 Мои подопечные</h2>
          <div className="students-grid">
            {myStudents.map(s => (
              <div key={s._id} className="trainee-card">
                <h4>{s.email}</h4>
                <p>Тариф: {s.enrolledPlan?.title || "Не выбран"}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <main className="main-content">
        <h2 className="main-title">Доступные тарифы</h2>
        <div className="app-container">
          {plans.map(plan => (
            <div key={plan._id} className="membership-card-v2">
              <h2>{plan.title}</h2>
              <div className="price">{plan.price} сом</div>
              <button className="enroll-btn-v2" onClick={() => setSelectedPlanDetails(plan)}>Выбрать</button>
            </div>
          ))}
        </div>
      </main>

      {selectedPlanDetails && (
        <div className="modal-overlay">
          <div className="modal-content info-modal">
            <h3>Выберите тренера для: {selectedPlanDetails.title}</h3>
            <div className="trainer-picker">
              {trainers.length > 0 ? trainers.map(t => (
                <div key={t._id} className="trainer-row" onClick={() => {
                  fetch('http://localhost:5000/api/gym/enroll-full', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user._id, planId: selectedPlanDetails._id, trainerId: t._id })
                  }).then(res => res.json()).then(data => {
                    setUser(data.user);
                    setSelectedPlanDetails(null);
                    alert("Запись прошла успешно!");
                  });
                }}>
                  <span><b>{t.email}</b></span>
                  <button className="select-mini-btn">Записаться</button>
                </div>
              )) : <p>Нет доступных тренеров</p>}
            </div>
            <button className="close-btn" onClick={() => setSelectedPlanDetails(null)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;