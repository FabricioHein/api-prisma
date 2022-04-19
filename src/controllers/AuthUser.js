import UserController from "../controllers/UserController";

class AuthUser {
  async userCreate(req, res) {
    const { name, email, password } = req.body;

    const createUser = new UserController();
    const tokenUser = await createUser.execute(name, email, password);

    res.json(tokenUser);
  }
  async login(req, res) {
    const { name, email, password } = req.body;

    const createUser = new UserController();
    const tokenUser = await createUser.login(req, res, email, password);

    res.json(tokenUser);
  }
}

export default AuthUser;
