import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';

function Signup() {
  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: ''
  });

  async function onSubmit(e) {
    e.preventDefault();

    const errors = [];

    if (
      formData.email.length === 0 ||
      formData.password.length === 0 ||
      formData.passwordConfirm.length === 0
    ) {
      errors.push({ message: 'All fields are required' });
    }

    if (formData.password !== formData.passwordConfirm) {
      errors.push({ message: 'Passwords do not match' });
    }

    if (formData.password.length < 6) {
      errors.push({ message: 'Password must be at least six characters' });
    }

    if (errors.length) {
      return setErrors(errors);
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.status === 400) {
        const errors = await res.json();

        setErrors(errors);
      } else if (res.status === 200) {
        setErrors(null);

        Router.push('/login');
      }
    } catch (err) {
      console.log(err);
    }
  }

  function onChange(e) {
    setErrors(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div>
      <h1>Signup</h1>
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
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            onChange={onChange}
            value={formData.passwordConfirm}
            id="passwordConfirm"
            type="password"
            name="passwordConfirm"
          />
        </div>
        <div className="form-group">
          <button type="submit">Signup</button> or{' '}
          <Link href="/login">
            <a>Login</a>
          </Link>
        </div>
        {errors &&
          errors.map((error, index) => <div key={index}>{error.message}</div>)}
      </form>
    </div>
  );
}

export default Signup;
