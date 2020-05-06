import Link from 'next/link';

function Header({ logout, user }) {
  return (
    <div>
      <ul className="nav">
        <li>
          <Link href="/">
            <a>Welcome</a>
          </Link>
        </li>
        {user ? (
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        ) : (
          <React.Fragment>
            <li>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </li>
            <li>
              <Link href="/signup">
                <a>Signup</a>
              </Link>
            </li>
          </React.Fragment>
        )}
      </ul>
    </div>
  );
}

export default Header;
