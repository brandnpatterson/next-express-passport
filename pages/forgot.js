import { useState } from 'react';

function Forgot() {
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    email: ''
  });

  async function onSubmit(e) {
    e.preventDefault();

    if (formData.email.length === 0) {
      return setMessage('Please enter an email');
    }

    try {
      const res = await fetch('/api/email/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const { message } = await res.json();

      setMessage(message);
    } catch (err) {
      console.log(err);
    }
  }

  function onChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div>
      <h1>Send an email to reset your password</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            onChange={onChange}
            value={formData.email}
            id="email"
            type="email"
            name="email"
          />
        </div>
        <div className="form-group">
          <button type="submit">Send</button>
        </div>
        {message && message}
      </form>
    </div>
  );
}

export default Forgot;
