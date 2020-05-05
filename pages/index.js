import Link from 'next/link';

function Home() {
  return (
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
  );
}

export default Home;
