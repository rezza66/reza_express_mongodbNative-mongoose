const Input = ({ label, error, onChange, ...inputProps }) => {
  return (
    <div className="form-group">
      <label htmlFor={inputProps.name}>{label}</label>
      <input
        id={inputProps.name}
        className={`form-control ${error && 'is-invalid'}`}
        onChange={onChange}
        {...inputProps}
      />
      {error && error.map((err, index) => <p key={index} className="invalid-feedback">* {err}</p>)}
    </div>
  );
};

export default Input;
