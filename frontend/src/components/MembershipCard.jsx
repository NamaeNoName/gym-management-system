function MembershipCard({ title, price, duration, onEnroll }) {
  return (
    <div className="membership-card">
      <img src="https://cdn-icons-png.flaticon.com/512/69/69840.png" alt="icon" />
      <h2>{title}</h2>
      <p className="price">{price} сом</p>
      <p>{duration} дней обучения</p>
      <button className="enroll-btn" onClick={onEnroll}>Записаться</button>
    </div>
  );
}

export default MembershipCard;