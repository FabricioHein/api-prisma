import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs/dist/bcrypt";
import res from "express/lib/response";
import auth from "../auth/auth";

const prisma = new PrismaClient();

class UserController {
  async execute(name, email, password) {
    try {

      const token = await auth.generateAccessToken({ username: name });
      const hash = await bcrypt.hash(password, 10);
      let user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        return 'Usuário Existente';
      }

      let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

      if(regex.test(email)){
        user = await prisma.user.create({
          data: {
            name,
            email,
            password: hash,
            token: token
          },
        });
        return token

      }
      

      return 'Email Invalido'
    } catch (error) {
      return 'Error';
    }
  }
  async login(req, res, email, password) {
    try {

      let user = await prisma.user.findUnique({ where: { email } });
      const match = await bcrypt.compare(password, user.password);

      if(match) {
        return res.json({token: user.token})
      }
         
      return 'Error Login'
    } catch (error) {
      return 'Error';
    }
  }

  async findAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany();
      return res.json(users);
    } catch (error) {
      return res.json({ error });
    }
  }
 
  async findUser(req, res) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({ where: { id: Number(id) } });

      if (!user)
        return res.json({ error: "Não possivel encotrar esse usuario" });

      return res.json(user);
    } catch (error) {
      return res.json({ error });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      let user = await prisma.user.findUnique({ where: { id: Number(id) } });

      if (!user)
        return res.json({ error: "Não possivel encotrar esse usuario" });

      user = await prisma.user.update({
        where: { id: Number(id) },
        data: { name, email },
      });

      return res.json(user);
    } catch (error) {
      res.json({ error });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({ where: { id: Number(id) } });

      if (!user)
        return res.json({ error: "Não possivel encotrar esse usuario" });

      await prisma.user.delete({ where: { id: Number(id) } });

      return res.json({ message: "Usuario deletado" });
    } catch (error) {
      return res.json({ error });
    }
  }
}

export default UserController;
