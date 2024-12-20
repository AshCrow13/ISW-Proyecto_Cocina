import { Router } from "express";
import menuController from "../controllers/menu.controller.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router.post("/", menuController.create);
router.get("/", menuController.getAll);
router.get("/:id", menuController.getById);
router.put("/:id", menuController.update);
router.delete("/:id", menuController.delete);

//rutas protegidas

router.post("/admin", isAdmin, menuController.create);
router.put("/admin/:id", isAdmin, menuController.update);
router.delete("/admin/:id", isAdmin, menuController.delete);

export default router;
