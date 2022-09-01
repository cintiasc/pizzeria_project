import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies, destroyCoockie } from 'nookies';
import { destroyCookie } from '../../node_modules/nookies/dist/index';

import { AuthTokenError } from '../services/errors/AuthTokenError';
// only logged users can access this page(s)
export function canSSRAuth<P>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const coockies = parseCookies(ctx);

        const token = coockies['@nextauth.token'];

        if(!token){
            return {
                redirect:{
                    destination: '/',
                    permanent: false,
                }
            }
        }

        try {
            return await fn(ctx);
        } catch (err) {
            if(err instanceof AuthTokenError){
                destroyCookie(ctx, '@nextauth.token');

                return {
                    redirect:{
                        destination: '/',
                        permanent: false
                    }
                }
            }
        }
    }
}
