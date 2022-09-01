import { AppProps } from '../../node_modules/next/app';
import { ToastContainer } from 'react-toastify';
// import { ToastContainer } from './../../node_modules/react-toastify/dist/index';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/scss/main.scss'
// import 'react-toastify/dist/ReactToastify.min.css'

import { AuthProvider } from '../contexts/AuthContext';
import '../../styles/globals.scss';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer autoClose={3000} />
    </AuthProvider>
    )
}

export default MyApp
