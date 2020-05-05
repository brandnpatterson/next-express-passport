import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';

function Login() {
  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.status === 400) {
        const { error } = await res.json();

        return setErrors(error);
      }

      Router.push('/');
      setErrors(false);
    } catch (err) {
      console.log(err);
    }
  }

  function onChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div>
      <h1>Login</h1>
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
          <label htmlFor="password">Password</label>
          <input
            onChange={onChange}
            value={formData.password}
            id="password"
            type="password"
            name="password"
          />
        </div>
        <div className="form-group">
          <button type="submit">Login</button> or{' '}
          <Link href="/signup">
            <a>Signup</a>
          </Link>
        </div>
        {errors && errors.map((error, index) => <div key={index}>{error}</div>)}
      </form>
    </div>
  );
}

export default Login;
