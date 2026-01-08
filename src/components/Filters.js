function Filters({ search, setSearch }) {
  return (
    <div className="filters-container">
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default Filters;
