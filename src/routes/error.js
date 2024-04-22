import express from "express";
const router = express.Router();

router.get("/404", (req, res) => {
  res.status(404).render("error", {
    status: 404,
    errorTitle: "الصفحة غير موجودة",
  });
});

router.get("/500", (req, res) => {
  res.status(500).render("error", {
    status: 500,
    errorTitle: "خطأ في الخادم الداخلي",
  });
});

export default router;
