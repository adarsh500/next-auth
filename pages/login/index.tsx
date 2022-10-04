import { MouseEvent, useState, useEffect } from 'react';
import styles from './Login.module.scss';
import {
  useSession,
  getProviders,
  signIn,
  signOut,
  getSession,
} from 'next-auth/react';

interface Provider {
  name: string;
  id: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

const Login = ({ providers }: any) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  console.log('login', session);

  if (session) {
    return (
      <div className={styles.container}>
        <div className={styles.login}>
          <h1 className={styles.title}>Signed in as {session?.user?.email}</h1>

          <br />
          <div className={styles.socialAuthWrapper}>
            <button onClick={() => signOut()} className={styles.socialAuth}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.login}>
        <h1 className={styles.title}>Welcome back to Cal!</h1>

        {Object.values(providers).map((provider: any) => (
          <div key={provider.name} className={styles.socialAuthWrapper}>
            <button
              onClick={() => signIn(provider.id)}
              className={styles.socialAuth}
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Login;

export async function getServerSideProps(context: { req: any }) {
  const { req } = context;
  const session = await getSession({ req });
  const providers = await getProviders();

  if (session) {
    return {
      redirect: { destination: '/' },
    };
  }

  return {
    props: { providers },
  };
}
