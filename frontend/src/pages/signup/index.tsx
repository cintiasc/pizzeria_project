import { FormEvent, useState, useContext } from "react";

import Head from "next/head";
import Image from "next/image";

import styles from '../../../styles/home.module.scss';
import logoImg from "../../../public/logo.svg";

import { Input } from "../../components/ui/Input/index";
import { Button } from "../../components/ui/Button/index";

import Link from "next/link";


import { AuthContext } from "../../contexts/AuthContext";
import { toast } from 'react-toastify';

export default function SignUp() {
  const { signUp } = useContext(AuthContext);
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    if(name ==='' || email ==='' || password ===''){
      toast.error("PREENCHA TODOS OS CAMPOS")
      return;
    }

    setLoading(true);

    let data = {
      name,
      email,
      password
    }

    await signUp(data)

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Sujeito Pizza - Faça seu cadastro</title>      
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo da Pizzaria" />


        <div className={styles.login}>
        <h1>Cadastro:</h1>
          <form onSubmit={handleSignUp}>
            <Input 
              placeholder="Digite seu nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input 
              placeholder="Digite seu email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              placeholder="Digite sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button 
              type="submit"
              loading={loading}
            >
              Cadastrar
            </Button>            
          </form>

          <Link href="/">
            <a className={styles.text}>Já possui uma conta? Faça o login.</a>
          </Link>
        </div>
      </div>
    </>
  )
}
