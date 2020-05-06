import { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';

function Login({ login, user }) {
  useEffect(() => {
    if (user) {
      Router.push('/');
    }
  }, [user]);

  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  function onSubmit(e) {
    e.preventDefault();

    let errors = [];

    if (formData.email.length === 0 || formData.password.length === 0) {
      errors.push({ message: 'All fields are required' });
    }

    if (formData.password.length < 6) {
      errors.push({ message: 'Password must be at least six characters' });
    }

    if (errors.length > 0) {
      return setErrors(errors);
    }

    setErrors(null);
    login(formData);
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
        {errors &&
          errors.map((error, index) => <div key={index}>{error.message}</div>)}
      </form>
    </div>
  );
}

export default Login;
