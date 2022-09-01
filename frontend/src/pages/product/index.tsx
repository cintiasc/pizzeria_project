import { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import { IoMdAdd } from 'react-icons/io';
import { toast } from 'react-toastify';

import { Header } from '../../components/Header/index';
import { canSSRAuth } from "../../utils/canSSRAuth";
import styles from './styles.module.scss';
import { setupAPIClient } from '../../services/api';

type ItemProps = {
    id: string;
    name: string;
}

interface CategoryProps{
    categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps){
    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null);
    const [categories, setCategories] = useState(categoryList || [])
    const [categorySelected, setCategorySelected] = useState(0)

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(!e.target.files){
            return;
        }

        const image = e.target.files[0];

        if(!image){
            return;
        }

        if(image.type === 'image/jpeg' || image.type === 'image/pmg'){
            setImageAvatar(image)
            setAvatarUrl(URL.createObjectURL(e.target.files[0]))
        }
    }

    async function handleRegister(e: FormEvent){
        e.preventDefault();

        try {
            const data = new FormData();
            if(name === '' || price === '' || description === '' || imageAvatar === null) {
                toast.error("Preencha todos os campos!");
                return;
            }

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('category_id', categories[categorySelected].id);
            data.append('file', imageAvatar);

            const apiClient = setupAPIClient();

            await apiClient.post('/product', data);

            toast.success('Produto cadastrado com sucesso');

        } catch (error) {
            toast.error("Ops! Erro ao cadastrar!")
        }

        setName('');
        setPrice('');
        setDescription('');
        setImageAvatar(null);
        setAvatarUrl('');
        // setCategorySelected(0);
    }

    function handleChangeCategory(event){
        setCategorySelected(event.target.value)
    }
    return (
        <>
            <Head>
                <title>Novo produto - Sujeito Pizzaria</title>
            </Head>

            <Header />
            
            <main className={styles.container}>
                <div>
                    <h1>Novo produto</h1>

                    <form className={styles.form} onSubmit={handleRegister}>

                        {/* image */}
                        <label className={styles.labelAvatar}>
                            <span>
                                <IoMdAdd size={30} color="#FFF" />
                                
                            </span>

                            <input type="file" accept='image/png, image/jpeg' onChange={handleFile}/>

                            {avatarUrl && (
                                <img 
                                className={styles.preview}
                                src={avatarUrl}
                                alt='Foto do produto'
                                width={250}
                                height={250}
                                />
                            )}

                        </label>

                        <select value={categorySelected} onChange={handleChangeCategory}>
                            {categories.map( (item, index) => {
                                return (
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>

                        <input 
                            type="text"
                            placeholder="Digite o nome do produto"
                            className={styles.input}
                            value={name}
                            onChange={ (e) => setName(e.target.value)}
                        />

                        <input 
                            type="text"
                            placeholder="Preço o nome do produto"
                            className={styles.input}
                            value={price}
                            onChange={ (e) => setPrice(e.target.value)}
                        />

                        <textarea
                            placeholder='Descreva o seu produto'
                            className={styles.input}
                            value={description}
                            onChange={ (e) => setDescription(e.target.value)}
                        />

                        <button className={styles.buttonAdd} type="submit">
                            Cadastrar
                        </button>
                    </form>
                </div>
            </main>
        </>
    )
}

export const getServerSideProps = canSSRAuth(
    async (ctx) =>{
        const apiClient = setupAPIClient(ctx)

        const response = await apiClient.get('/category')

        return {
            props: {
                categoryList: response.data
            }
        }
    }
)