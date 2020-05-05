import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

function ResetToken() {
  const router = useRouter();
  const { token } = router.query;

  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: ''
  });

  async function onSubmit(e) {
    e.preventDefault();

    const data = {
      ...formData,
      token
    };

    try {
      const res = await fetch('/api/email/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const { message } = await res.json();

      setMessage(message);
      setSuccess(true);
    } catch (err) {
      console.log(err);
    }
  }

  function onChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div>
      {success ? (
        <div>
          Success! {message}. Use your new password to{' '}
          <Link href="/login">
            <a>Login</a>
          </Link>
        </div>
      ) : (
        <div>
          <h1>Reset your password</h1>
          <form onSubmit={onSubmit}>
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
              <label htmlFor="passwordConfirm">Password Confirm</label>
              <input
                onChange={onChange}
                value={formData.passwordConfirm}
                id="passwordConfirm"
                type="password"
                name="passwordConfirm"
              />
            </div>
            <div className="form-group">
              <button type="submit">Reset</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ResetToken;
