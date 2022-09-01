import { useContext, FormEvent, useState } from "react";
import Link from 'next/link';
import { toast } from 'react-toastify';
import { sign } from "crypto";

import styles from '../../styles/home.module.scss';
import Head from "../../node_modules/next/head";
import Image from "../../node_modules/next/image";
import logoImg from "../../public/logo.svg";
import { Input } from "../components/ui/Input/index";
import { Button } from "../components/ui/Button/index";

import { AuthContext } from "../contexts/AuthContext";
import { canSSRGuest } from "../utils/canSSRGuest";


export default function Home() {
  const { signIn } =useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent) {
    event.preventDefault(); //stop reload

    if(email === '' || password === ''){
        toast.warning("Favor preencha os dados!")
      return;
    }

    setLoading(true);

    let data = {
      email,
      password
    }

    await signIn(data)

    setLoading(false);
  }
  return (
    <>
      <Head>
        <title>Sujeito Pizza - Faça seu login</title>      
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo da Pizzaria" />

        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input 
              placeholder="Digite seu email"
              type="email"
              value={email}
              onChange={ (e) => setEmail(e.target.value) }
            />

            <Input 
              placeholder="Digite sua senha"
              type="password"
              value={password}
              onChange={ (e) => setPassword(e.target.value) }
            />

            <Button 
              type="submit"
              loading={loading}
            >
              Acessar
            </Button>            
          </form>

          <Link href="/signup">
            <a className={styles.text}>Não possui uma conta? Cadastre-se</a>
          </Link>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(
  async (ctx) => {
    return {
      props:{}
    }
  }
)