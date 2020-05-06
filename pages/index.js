import Link from 'next/link';

function Home({ logout, user }) {
  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.email}</h1>
          <button onClick={logout} type="button">
            Logout
          </button>
        </div>
      ) : (
        <div>
          <h1>Welcome!</h1>
          <p>
            <Link href="/login">
              <a>Login</a>
            </Link>{' '}
            or{' '}
            <Link href="/signup">
              <a>Signup</a>
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;
