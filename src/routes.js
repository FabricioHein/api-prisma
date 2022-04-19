import { Router } from "express";
import AuthUser from "./controllers/AuthUser";
import PostController from "./controllers/PostController";
import UserController from "./controllers/UserController";
import auth from "./auth/auth";

const user = new AuthUser();
const userControllers = new UserController();

const router = Router();

router.post("/login", user.login);

router.post("/user", user.userCreate);
router.get("/users", auth.authenticateToken, (req, res)=>{
    
     userControllers.findAllUsers(req, res)

} );

// router.get("/user/:id", user.findUser);
// router.put("/user/:id", user.updateUser);
// router.delete("/user/:id", user.deleteUser);


router.post("/post/user/:id", PostController.createPost);
router.get("/posts", PostController.FindAllPosts);
router.put("/post/:id", PostController.UpdatePost);


export { router };
