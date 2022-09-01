import prismaClient from '../../prisma'
import  { hash } from 'bcryptjs'
 
interface UserRequest{
    name: string;
    email: string;
    password: string;
}

class CreateUserService{
    async execute( {name, email, password} : UserRequest){

        //verify if email was informed
        if(!email) {
            throw new Error("e-mail incorreto")
        }

        //check if already exists the informed user
        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email: email
            }
         })

        if(userAlreadyExists){
             throw new Error("Esse usuário já foi cadastrado")
        }

        const passwordHash = await hash(password, 8)
        
        //create user register
        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        })

        return user;
    }
}   

export { CreateUserService }