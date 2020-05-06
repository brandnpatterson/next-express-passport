import App, { Container } from 'next/app';
import Router from 'next/router';
import Cookies from 'js-cookie';
import Page from '../components/Page';
import Header from '../components/Header';
import '../styles.css';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    if (ctx.req) {
      // server
      pageProps.user = ctx.req.user;
    } else if (Cookies.get('is_loggedin')) {
      // browser
      const res = await fetch('/api/auth/login-success');

      if (res.ok) {
        const { user } = await res.json();

        pageProps.user = user;
      }
    }

    return { pageProps };
  }

  constructor(props) {
    super(props);
    this.state = {
      user: props.pageProps.user
    };
  }

  login = async formData => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const { user } = await res.json();

        this.setState({ user });
        Cookies.set('is_loggedin', true);
        Router.push('/');
      }
    } catch (err) {
      console.log(err);
    }
  };

  logout = async () => {
    await fetch('/api/auth/logout');

    this.setState({ user: null });
    Cookies.remove('is_loggedin');
  };

  render() {
    const { Component } = this.props;

    return (
      <Container>
        <Header logout={this.logout} {...this.state} />
        <Page>
          <Component login={this.login} logout={this.logout} {...this.state} />
        </Page>
      </Container>
    );
  }
}

export default MyApp;
