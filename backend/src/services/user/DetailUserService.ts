import prismaClient from "../../prisma";

class DetailUserService {
    async execute(user_id: string){
        const user = await prismaClient.user.findFirst({
            
            select: {
                id: true,
                name: true,
                email: true,
            },
            where: {
                id: user_id
            }
        })
        
        return user;
    }
}

export { DetailUserService }