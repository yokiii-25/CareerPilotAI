function Card({ children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {children}
    </div>
  );
}

export default Card;